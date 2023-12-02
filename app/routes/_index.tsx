import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { json, type MetaFunction } from '@remix-run/node'
import { NavLink, useLoaderData } from '@remix-run/react'

export const meta: MetaFunction = () => [{ title: 'Epic Notes' }]

export async function loader() {
	const posts = await prisma.post.findMany({
		select: {
			id: true,
			title: true,
			content: true,
			postImages: {
				select: {
					id: true,
				},
			},
		},
		take: 2,
	})

	return json({
		posts,
	})
}

export default function Index() {
	const { posts } = useLoaderData<typeof loader>()

	return (
		<main className="flex flex-grow flex-col justify-between">
			<div className="flex items-center justify-between">
				<span className="text-lg">bikebuddy</span>
				<div className="flex gap-[10px]">
					<Icon name="heart" className="h-[25px] w-[25px]" />
					<Icon name="shopping-cart" className="h-[25px] w-[25px]" />
					<Icon name="bell" className="h-[25px] w-[25px]" />
				</div>
			</div>
			<div className="flex gap-[20px]">
				<input
					type="text"
					placeholder="Search items"
					className="flex-grow  rounded-md border-[1px] border-gray-300 p-2 px-4"
				/>
				<button className="w-[50px] rounded-md  bg-orange-500">
					<Icon
						className="h-[25px] w-[25px] text-white"
						name="magnifying-glass"
					/>
				</button>
			</div>
			<div className=" flex h-[100px] items-center justify-center bg-gray-100">
				placeholder
			</div>
			<div>
				<span className="font-oswald text-lg font-bold">
					PICKING BY CATEGORY
				</span>
				<div className="font-oswald flex gap-[10px] font-bold">
					<div className="flex h-[120px] w-[0] flex-grow items-center justify-center bg-gray-100">
						<div className="flex flex-col gap-[5px]">
							<Icon name="footprints" className="h-[35px] w-[35px]" />
							<span className="text-orange-500">FOOTWEAR</span>
						</div>
					</div>
					<div className="flex h-[120px] w-[0] flex-grow items-center justify-center bg-gray-100">
						<div className="flex flex-col gap-[5px]">
							<Icon name="shopping-bag" className="h-[35px] w-[35px]" />
							<span className="text-orange-500">BAGS</span>
						</div>
					</div>
					<div className="flex h-[120px] w-[0] flex-grow items-center justify-center bg-gray-100">
						<div className="flex flex-col gap-[5px]">
							<Icon name="shirt" className="h-[35px] w-[35px]" />
							<span className="text-orange-500">APPAREL</span>
						</div>
					</div>
				</div>
			</div>
			<div>
				<span className="font-oswald font-bold">FOR YOU</span>
				<div className="flex h-[300px] gap-[20px]">
					{posts.map(post => {
						const minutesToRead = post
							? Math.max(1, Math.ceil(post.content.length / 250))
							: 0

						return (
							<div
								key={post.id}
								className="flex h-full w-[0] flex-grow flex-col gap-[5px]"
							>
								<img
									src={`/images/${post.postImages[0].id}`}
									className="flex-grow rounded-md object-cover object-center"
								/>
								<h2 className="font-oswald overflow-clip text-ellipsis whitespace-nowrap">
									{post.title.toUpperCase()}
								</h2>
								<span className="font-bold text-orange-500">
									{minutesToRead} min read
								</span>
							</div>
						)
					})}
				</div>
			</div>
			<footer className="flex h-[50px] justify-between">
				<NavLink
					to="."
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
		</main>
	)
}
