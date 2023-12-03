import { Icon } from '#app/components/ui/icon.tsx'
import { getUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import {
	json,
	type MetaFunction,
	DataFunctionArgs,
	redirect,
} from '@remix-run/node'
import { Link, NavLink, useLoaderData } from '@remix-run/react'
import appLogo from '#app/assets/app-logo.png'

export const meta: MetaFunction = () => [{ title: 'Epic Notes' }]

export async function loader({ request }: DataFunctionArgs) {
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

	const userId = await getUserId(request)

	const user = await prisma.user.findUnique({
		where: {
			id: userId ?? '',
		},
		select: {
			id: true,
			name: true,
			balance: true,
			image: {
				select: {
					id: true,
				},
			},
		},
	})

	return json({
		posts,
		user,
	})
}

export default function Index() {
	const { posts, user } = useLoaderData<typeof loader>()

	return (
		<main className="flex flex-grow flex-col justify-between">
			<div className="flex items-center justify-between">
				<img src={appLogo} alt="App logo" className="h-[35px] w-[35px]" />
				<div className="flex gap-[10px]">
					<Icon name="heart" className="h-[3px] w-[30px]" />
					<Icon name="shopping-cart" className="h-[30px] w-[30px]" />
					<Icon name="bell" className="h-[30px] w-[30px]" />
				</div>
			</div>
			<div className="flex gap-[20px]">
				<Link
					to="/search"
					className="flex-grow rounded-md border-[1px] border-gray-300 p-2 px-4"
				>
					<input type="text" placeholder="Search items" />
				</Link>
				<Link
					to="search"
					className="flex w-[50px]  items-center justify-center rounded-md bg-orange-500"
				>
					<Icon
						className="h-[25px] w-[25px] text-white"
						name="magnifying-glass"
					/>
				</Link>
			</div>
			{user ? (
				<div className="flex h-[100px] items-center justify-center gap-[10px]">
					<div className="flex h-[100%] w-[0] flex-grow flex-col items-center justify-center shadow-md shadow-gray-300">
						<div>
							<span className="text-sm">Wallet balance</span>
							<span className="flex items-center gap-[5px] font-extrabold">
								<Icon name="wallet" className="h-[25px] w-[25px]" /> $
								{user.balance}
							</span>
						</div>
					</div>
					<div className="flex h-[100%] w-[0] flex-grow flex-col items-center justify-center shadow-md shadow-gray-300">
						<div>
							<span className="text-sm">Top up balance</span>
							<span className="flex items-center gap-[5px] font-bold">
								<Icon name="plus-circled" className="h-[25px] w-[25px]" /> Top
								up
							</span>
						</div>
					</div>
				</div>
			) : null}
			<div>
				<span className="font-oswald text-lg font-bold">
					PICKING BY CATEGORY
				</span>
				<div className="flex gap-[10px] font-oswald font-bold">
					<Link
						to="/shop/footwear"
						className="flex h-[120px] w-[0] flex-grow items-center justify-center bg-gray-100"
					>
						<div className="flex flex-col gap-[5px]">
							<Icon name="footprints" className="h-[35px] w-[35px]" />
							<span className="text-orange-500">FOOTWEAR</span>
						</div>
					</Link>
					<Link
						to="/shop/bags"
						className="flex h-[120px] w-[0] flex-grow items-center justify-center bg-gray-100"
					>
						<div className="flex flex-col gap-[5px]">
							<Icon name="shopping-bag" className="h-[35px] w-[35px]" />
							<span className="text-orange-500">BAGS</span>
						</div>
					</Link>
					<Link
						to="/shop/apparel"
						className="flex h-[120px] w-[0] flex-grow items-center justify-center bg-gray-100"
					>
						<div className="flex flex-col gap-[5px]">
							<Icon name="shirt" className="h-[35px] w-[35px]" />
							<span className="text-orange-500">APPAREL</span>
						</div>
					</Link>
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
								<h2 className="overflow-clip text-ellipsis whitespace-nowrap font-oswald">
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
					<Icon className="h-[35px] w-[35px]" name="arrows-exchange" />
				</NavLink>
				<NavLink
					to="/shop"
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
