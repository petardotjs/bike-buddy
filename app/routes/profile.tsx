import { getUserId } from '#app/utils/auth.server.ts'
import { DataFunctionArgs, json, redirect } from '@remix-run/node'
import { Icon } from '../components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { useLoaderData, NavLink } from '@remix-run/react'

export async function loader({ request }: DataFunctionArgs) {
	const userId = await getUserId(request)

	if (userId) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
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
			user,
		})
	} else {
		throw redirect('/login')
	}
}

export default function Profile() {
	const { user } = useLoaderData<typeof loader>()

	if (user) {
		return (
			<div className="flex h-[100dvh] flex-col">
				<header className="flex flex-col">
					<span className="flex justify-end gap-[10px] bg-orange-500 px-[5%] pt-[5%] text-white">
						<Icon name="shopping-cart" className="h-[25px] w-[25px]" />
						<Icon name="gear" className="h-[25px] w-[25px]" />
					</span>
					<div className="relative top-[-1px] flex items-center gap-[20px] rounded-b-lg bg-orange-500 px-[5%] pb-[100px]">
						<img
							src={user.image?.id ? `/images/${user.image.id}` : '/user.png'}
							alt="Default user avatar"
							className="h-[50px] w-[50px] rounded-full border-[1px] border-gray-500"
						/>
						<div className="flex flex-col text-white">
							<span className="font-bold">{user.name}</span>
							<span className="flex items-center gap-[7px]">
								<Icon name="wallet" />
								<span>${user.balance}</span>
							</span>
						</div>
					</div>
					<div className=" z-2 relative mx-[5%] mt-[-50px] flex rounded-md bg-white p-[3%] text-xs">
						<span className="flex h-[70px] w-[0] flex-grow flex-col items-center justify-center gap-[5px] border-r-2">
							<Icon name="map" className="h-[30px] w-[30px]" />
							<span>My Routes</span>
						</span>
						<span className="flex h-[70px] w-[0] flex-grow flex-col items-center justify-center gap-[5px] border-r-2">
							<Icon name="heart" className="h-[30px] w-[30px]" />
							<span>Health Info</span>
						</span>
						<span className="flex h-[70px] w-[0] flex-grow flex-col items-center justify-center gap-[5px] border-r-2">
							<Icon name="star" className="h-[30px] w-[30px]" />
							<span>Goals</span>
						</span>
						<span className="flex h-[70px] w-[0] flex-grow flex-col items-center justify-center gap-[5px]">
							<Icon name="gallery-horizontal" className="h-[30px] w-[30px]" />
							<span>Gallery</span>
						</span>
					</div>
				</header>
				<main className="flex h-[0] flex-grow flex-col justify-evenly">
					<div className="flex flex-col gap-[7px] px-[5%]">
						<span className="font-oswald text-lg font-bold">MY ACTIVITY</span>
						<span className="flex gap-[10px] text-lg">
							<Icon name="magnifying-glass" className="h-[25px] w-[25px]" />
							Rent Bike
						</span>
						<span className="flex gap-[10px] text-lg">
							<Icon name="heart" className="h-[25px] w-[25px]" /> Wishlist
						</span>
						<span className="flex gap-[10px] text-lg">
							<Icon name="star" className="h-[25px] w-[25px]" /> Rating Best
							Routes
						</span>
						<span className="flex gap-[10px] text-lg">
							<Icon
								name="counter-clockwise-clock"
								className="h-[25px] w-[25px]"
							/>
							Last Seen Routes
						</span>
						<span className="flex gap-[10px] text-lg">
							<Icon
								name="counter-clockwise-clock"
								className="h-[25px] w-[25px]"
							/>
							List of Routes
						</span>
					</div>
					<div className="flex flex-col gap-[7px] px-[5%]">
						<span className="font-oswald text-lg font-bold">OTHER</span>
						<span className="flex gap-[10px] text-lg">
							<Icon name="chat-bubble" className="h-[25px] w-[25px]" /> Chat
							with Customer Service
						</span>
						<span className="flex gap-[10px] text-lg">
							<Icon name="help-circle" className="h-[25px] w-[25px]" /> Help
							center
						</span>
						<span className="flex gap-[10px] text-lg">
							<Icon name="info" className="h-[25px] w-[25px]" /> Info
						</span>
						<span className="flex gap-[10px] text-lg">
							<Icon name="mobile" className="h-[25px] w-[25px]" /> About App
						</span>
					</div>
				</main>
				<footer className="mx-[5%] mb-[5%] flex h-[50px] justify-between">
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
	} else {
		return <div>No user found.</div>
	}
}
