import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { json } from '@remix-run/node'
import { NavLink, useLoaderData } from '@remix-run/react'
import { format, parseISO } from 'date-fns'

export async function loader() {
	const posts = await prisma.post.findMany({
		select: {
			id: true,
			createdAt: true,
			title: true,
			postImages: {
				select: {
					id: true,
					altText: true,
				},
			},
		},
		take: 10,
		orderBy: {
			createdAt: 'desc',
		},
	})

	return json({
		posts,
	})
}

export default function BlogRoute() {
	const { posts } = useLoaderData<typeof loader>()

	return (
		<div className="flex h-[100dvh] flex-col justify-between">
			<header className="mb-[30px] flex items-center justify-between">
				<span className="font-oswald font-bold">ARTICLES</span>
				<span className="flex items-center gap-[5px] text-orange-500">
					<Icon name="filter" width="25" height="25" />
					<span>Filter</span>
				</span>
			</header>
			<main className="flex h-[80vh] flex-col gap-[15px] overflow-scroll">
				{posts.map(post => {
					return (
						<div key={post.id} className="flex gap-[10px]">
							<img
								src={`/images/${post.postImages[0].id}`}
								alt={post.postImages[0].altText ?? ''}
								className="h-[120px] w-[0] flex-grow rounded-md object-cover object-center"
							/>
							<div className="flex w-[0] flex-grow flex-col justify-evenly">
								<span className="text-sm text-gray-400">
									{formatISODate(post.createdAt)}
								</span>
								<span className="line-clamp-3 font-oswald font-bold">
									{post.title.toUpperCase()}
								</span>
							</div>
						</div>
					)
				})}
			</main>
			<footer className="flex h-[50px] justify-between">
				<NavLink
					to="/"
					className={({ isActive }) => {
						return isActive
							? 'flex w-[50px] items-center justify-center rounded-sm bg-orange-200 text-orange-500'
							: 'flex items-center justify-center rounded-md'
					}}
				>
					<Icon className="h-[35px] w-[35px]" name="home" />
				</NavLink>
				<NavLink
					to="/transfer"
					className={({ isActive }) => {
						return isActive
							? 'flex w-[50px] items-center justify-center rounded-sm bg-orange-200 text-orange-500'
							: 'flex items-center justify-center rounded-md'
					}}
				>
					<Icon className="h-[35px] w-[35px]" name="magnifying-glass" />
				</NavLink>
				<NavLink
					to="/ticket"
					className={({ isActive }) => {
						return isActive
							? 'flex w-[50px] items-center justify-center rounded-sm bg-orange-200 text-orange-500'
							: 'flex items-center justify-center rounded-md'
					}}
				>
					<Icon className="h-[35px] w-[35px]" name="ticket" />
				</NavLink>
				<NavLink
					to="/blog"
					className={({ isActive }) => {
						return isActive
							? 'flex w-[50px] items-center justify-center rounded-sm bg-orange-200 text-orange-500'
							: 'flex items-center justify-center rounded-md'
					}}
				>
					<Icon className="h-[35px] w-[35px]" name="newspaper" />
				</NavLink>
				<NavLink
					to="/profile"
					className={({ isActive }) => {
						return isActive
							? 'flex w-[50px] items-center justify-center rounded-sm bg-orange-200 text-orange-500'
							: 'flex items-center justify-center rounded-md'
					}}
				>
					<Icon className="h-[35px] w-[35px]" name="person" />
				</NavLink>
			</footer>
		</div>
	)
}

function formatISODate(isoString: string) {
	// Parse the ISO string into a Date object
	const date = parseISO(isoString)

	// Format the date as "Month day"
	return format(date, 'MMMM d')
}
