import { PassThrough } from 'stream'
import {
	createReadableStreamFromReadable,
	json,
	type DataFunctionArgs,
	type HandleDocumentRequestFunction,
} from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import * as Sentry from '@sentry/remix'
import isbot from 'isbot'
import { getInstanceInfo } from 'litefs-js'
import { renderToPipeableStream } from 'react-dom/server'
import { getEnv, init } from './utils/env.server.ts'
import { NonceProvider } from './utils/nonce-provider.ts'
import { makeTimings } from './utils/timing.server.ts'
import { setupServer } from 'msw/node'
import { http, HttpResponse, passthrough } from 'msw'
import { faker } from '@faker-js/faker'

const server = setupServer(
	http.post('https://api.resend.com/emails', async ({ request }) => {
		const body = await request.json()
		const response = HttpResponse.json({ status: 'success' })
		console.info({ body })
		console.info(response.status)

		return json({
			id: faker.string.uuid(),
			created_at: new Date().toISOString(),
		})
	}),
	http.post(`http://localhost:3001/ping`, () => {
		return passthrough()
	}),
	http.get('http://192.168.160.120:9669/api/sensorData', () => {
		return passthrough()
	}),
)
server.listen({
	onUnhandledRequest: req => {
		console.warn(`Unhandled ${req.method} request to ${req.url}.`)
	},
})

const ABORT_DELAY = 5000

init()
global.ENV = getEnv()

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
	import('./utils/monitoring.server.ts').then(({ init }) => init())
}

type DocRequestArgs = Parameters<HandleDocumentRequestFunction>

export default async function handleRequest(...args: DocRequestArgs) {
	const [
		request,
		responseStatusCode,
		responseHeaders,
		remixContext,
		loadContext,
	] = args
	const { currentInstance, primaryInstance } = await getInstanceInfo()
	responseHeaders.set('fly-region', process.env.FLY_REGION ?? 'unknown')
	responseHeaders.set('fly-app', process.env.FLY_APP_NAME ?? 'unknown')
	responseHeaders.set('fly-primary-instance', primaryInstance)
	responseHeaders.set('fly-instance', currentInstance)

	const callbackName = isbot(request.headers.get('user-agent'))
		? 'onAllReady'
		: 'onShellReady'

	const nonce = String(loadContext.cspNonce) ?? undefined
	return new Promise(async (resolve, reject) => {
		let didError = false
		// NOTE: this timing will only include things that are rendered in the shell
		// and will not include suspended components and deferred loaders
		const timings = makeTimings('render', 'renderToPipeableStream')

		const { pipe, abort } = renderToPipeableStream(
			<NonceProvider value={nonce}>
				<RemixServer context={remixContext} url={request.url} />
			</NonceProvider>,
			{
				[callbackName]: () => {
					const body = new PassThrough()
					responseHeaders.set('Content-Type', 'text/html')
					responseHeaders.append('Server-Timing', timings.toString())
					resolve(
						new Response(createReadableStreamFromReadable(body), {
							headers: responseHeaders,
							status: didError ? 500 : responseStatusCode,
						}),
					)
					pipe(body)
				},
				onShellError: (err: unknown) => {
					reject(err)
				},
				onError: (error: unknown) => {
					didError = true

					console.error(error)
				},
				nonce,
			},
		)

		setTimeout(abort, ABORT_DELAY)
	})
}

export async function handleDataRequest(response: Response) {
	const { currentInstance, primaryInstance } = await getInstanceInfo()
	response.headers.set('fly-region', process.env.FLY_REGION ?? 'unknown')
	response.headers.set('fly-app', process.env.FLY_APP_NAME ?? 'unknown')
	response.headers.set('fly-primary-instance', primaryInstance)
	response.headers.set('fly-instance', currentInstance)

	return response
}

export function handleError(
	error: unknown,
	{ request }: DataFunctionArgs,
): void {
	if (error instanceof Error) {
		Sentry.captureRemixServerException(error, 'remix.server', request)
	} else {
		Sentry.captureException(error)
	}
}
