import { createId as cuid } from '@paralleldrive/cuid2'
import { redirect } from '@remix-run/node'
import { GoogleStrategy } from 'remix-auth-google'
import { z } from 'zod'
import { cache, cachified } from '../cache.server.ts'
import { connectionSessionStorage } from '../connections.server.ts'
import { type Timings } from '../timing.server.ts'
import { type AuthProvider } from './provider.ts'

const GoogleUserSchema = z.object({ login: z.string() })
const GoogleUserParseResult = z
	.object({
		success: z.literal(true),
		data: GoogleUserSchema,
	})
	.or(
		z.object({
			success: z.literal(false),
		}),
	)

const shouldMock = false

export class GoogleProvider implements AuthProvider {
	getAuthStrategy() {
		return new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_STRATEGY_CLIENT_ID!,
				clientSecret: process.env.GOOGLE_STRATEGY_CLIENT_SECRET!,
				callbackURL: `http://localhost:3000/google/callback`,
			},
			async ({ profile }) => {
				console.log({ profile })
				const email = profile.emails[0].value.trim().toLowerCase()
				const username = profile.displayName
				const imageUrl = profile.photos[0].value
				return {
					email,
					id: profile.id,
					username,
					name: profile.name.givenName,
					imageUrl,
				}
			},
		)
	}

	async resolveConnectionData(
		providerId: string,
		{ timings }: { timings?: Timings } = {},
	) {
		console.log('resolveConnectionData')
		const result = await cachified({
			key: `connection-data:github:${providerId}`,
			cache,
			timings,
			ttl: 1000 * 60,
			swr: 1000 * 60 * 60 * 24 * 7,
			async getFreshValue(context) {
				await new Promise(r => setTimeout(r, 3000))
				const response = await fetch(
					`https://api.github.com/user/${providerId}`,
					{ headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } },
				)
				const rawJson = await response.json()
				const result = GoogleUserSchema.safeParse(rawJson)
				if (!result.success) {
					// if it was unsuccessful, then we should kick it out of the cache
					// asap and try again.
					context.metadata.ttl = 0
				}
				return result
			},
			checkValue: GoogleUserParseResult,
		})
		console.log('here')
		return {
			displayName: result.success ? result.data.login : 'Unknown',
			link: result.success ? `https://github.com/${result.data.login}` : null,
		} as const
	}

	async handleMockAction(request: Request) {
		console.log('handleMockAction')
		if (!shouldMock) return
		console.log("pls don't")

		const connectionSession = await connectionSessionStorage.getSession(
			request.headers.get('cookie'),
		)
		const state = cuid()
		connectionSession.set('oauth2:state', state)
		const code = 'MOCK_CODE_GITHUB_KODY'
		const searchParams = new URLSearchParams({ code, state })
		throw redirect(`/auth/github/callback?${searchParams}`, {
			headers: {
				'set-cookie':
					await connectionSessionStorage.commitSession(connectionSession),
			},
		})
	}
}
