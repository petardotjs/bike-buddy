import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { json } from '@remix-run/node'
import { NavLink, useLoaderData } from '@remix-run/react'

export async function loader() {
	const products = await prisma.product.findMany({
		select: {
			image: {
				select: {
					id: true,
				},
			},
			price: true,
			name: true,
			id: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	})

	return json({
		products,
	})
}

export default function ShopRoute() {
	const { products } = useLoaderData<typeof loader>()

	return (
		<div className="flex h-[100dvh] flex-col justify-between gap-[10px]">
			<header className="flex justify-between">
				<span className="font-oswald text-lg font-bold">SHOP</span>
				<span className="text-orange-500">
					<Icon name="filter" width="25" height="25" className="mr-[5px]" />
					<span>Filter</span>
				</span>
			</header>
			<main className="flex h-[0] flex-grow flex-col gap-[15px] overflow-scroll">
				<div className="grid grid-cols-2 gap-[10px]">
					{products.map(product => (
						<div key={product.id} className="shadow-sm shadow-slate-300">
							<div className="flex h-[200px] bg-gray-100">
								<img
									src={`/images/${product.image?.id}`}
									className="object-cover"
								/>
							</div>
							<div className="flex h-[80px] flex-col items-center justify-between gap-[5px]">
								<span className="inline-block text-center font-bold">
									{product.name}
								</span>
								<span className="font-oswald text-lg font-bold">
									${product.price}
								</span>
							</div>
						</div>
					))}
				</div>
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
		</div>
	)
}
