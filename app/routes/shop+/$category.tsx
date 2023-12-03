import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { DataFunctionArgs, json } from '@remix-run/node'
import { useLoaderData, NavLink } from '@remix-run/react'

export async function loader({ params }: DataFunctionArgs) {
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
		where: {
			category: {
				name: params.category,
			},
		},
	})

	return json({
		products,
		categoryName: params.category,
	})
}

export default function CategoryRoute() {
	const { products, categoryName } = useLoaderData<typeof loader>()

	const icon =
		categoryName === 'footwear'
			? 'footprints'
			: categoryName === 'bags'
			  ? 'shopping-bag'
			  : 'shirt'

	return (
		<div className="flex h-[100dvh] flex-col justify-between gap-[10px]">
			<header className="flex justify-between">
				<span className="font-oswald text-lg font-bold">SHOP</span>
				<div className="flex h-[120px] w-[120px] items-center justify-center font-oswald font-bold shadow-sm shadow-slate-300">
					<div className="flex flex-col gap-[5px] ">
						<Icon name={icon} className="h-[35px] w-[35px]" />
						<span className="text-orange-500">
							{categoryName?.toUpperCase()}
						</span>
					</div>
				</div>
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
					<Icon className="h-[35px] w-[35px]" name="magnifying-glass" />
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
