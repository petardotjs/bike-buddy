import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { DataFunctionArgs, json } from '@remix-run/node'
import { Form, useLoaderData, useSubmit } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'

export async function loader({ request }: DataFunctionArgs) {
	const trendingProducts = await prisma.product.findMany({
		select: {
			name: true,
		},
		take: 5,
		orderBy: {
			createdAt: 'asc',
		},
	})

	const query = new URL(request.url).searchParams.get('q')

	const suggestions = query
		? await prisma.product.findMany({
				select: {
					name: true,
				},
				where: {
					name: {
						startsWith: query,
					},
				},
		  })
		: []

	return json({
		trendingProducts,
		suggestions,
	})
}

function getQueries() {
	const queries = localStorage.getItem('queries')

	if (queries === null) {
		return []
	} else {
		return JSON.parse(queries) as Array<string>
	}
}

export default function SearchRoute() {
	const { trendingProducts, suggestions } = useLoaderData<typeof loader>()
	const submit = useSubmit()
	const formRef = useRef(null)
	const queries = typeof window !== 'undefined' ? getQueries() : []
	console.log(queries)

	return (
		<div className="flex h-[100dvh] flex-col">
			<header>
				<div className="relative flex h-[50px] gap-[20px]">
					{suggestions.length > 0 && (
						<div className="absolute left-0 right-0 top-full bg-white p-[10px]">
							{suggestions.map(suggestion => {
								return (
									<div className="flex items-center gap-[10px] p-[10px]">
										<Icon name="magnifying-glass" />
										<span>{suggestion.name}</span>
									</div>
								)
							})}
						</div>
					)}
					<Icon name="chevron-left" className="h-[25px] w-[25px]" />
					<Form className="flex gap-[20px]" method="GET" ref={formRef}>
						<input
							name="q"
							type="text"
							placeholder="Search items"
							className="flex-grow  rounded-md border-[1px] border-gray-300 p-2 px-4"
							onChange={() => {
								submit(formRef.current)
							}}
							onKeyDown={event => {
								if (event.key === 'Enter') {
									const queries = localStorage.getItem('queries')

									if (queries === null) {
										localStorage.setItem(
											'queries',
											JSON.stringify([event.target.value]),
										)
									} else {
										const queriesArray = JSON.parse(queries) as any
										queriesArray.unshift(event.target.value)
										localStorage.setItem(
											'queries',
											JSON.stringify(new Array(...new Set(queriesArray))),
										)
									}
								}
							}}
						/>
						<button className="w-[50px] rounded-md  bg-orange-500">
							<Icon
								className="h-[25px] w-[25px] text-white"
								name="magnifying-glass"
							/>
						</button>
					</Form>
				</div>
			</header>
			<main className="mt-[10px] flex-grow">
				<div>
					<div className="flex items-center justify-between">
						<span className="font-oswald text-lg font-bold">HISTORY</span>
						<span className="font-semibold text-orange-500">
							<Icon name="trash" />
							Delete all
						</span>
					</div>
					<div>
						{queries.map(query => {
							return (
								<div className="flex items-center justify-between p-[10px]">
									<span className="flex gap-[15px]">
										<Icon name="counter-clockwise-clock" />
										<span>{query}</span>
									</span>
									<Icon name="cross-1" />
								</div>
							)
						})}
					</div>
				</div>
				<div>
					<span className="font-oswald text-lg font-bold">TRENDING</span>
					<div className="flex flex-wrap gap-[5px]">
						{trendingProducts.map(product => {
							return (
								<span className="rounded-full bg-orange-100 p-[10px] text-orange-500">
									{product.name}
								</span>
							)
						})}
					</div>
				</div>
			</main>
		</div>
	)
}
