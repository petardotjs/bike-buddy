import { faker } from '@faker-js/faker'
import { prisma } from '#app/utils/db.server.ts'
import { glob } from 'glob'
import fs from 'fs'

const postImages = glob.sync('public/images/blogs/*')
const categories = ['apparel', 'bags', 'footwear']

for (const image of postImages) {
	await prisma.post.create({
		data: {
			title: faker.lorem.sentence(),
			subtitle: faker.lorem.sentence(),
			content: faker.lorem.paragraphs(),
			postImages: {
				create: {
					blob: fs.readFileSync(image),
					altText: faker.lorem.sentence(),
					contentType: getMimeType(image),
				},
			},
			authors: {
				create: {
					name: faker.person.fullName(),
					email: faker.internet.email(),
					username: faker.internet.userName(),
				},
			},
			createdAt: faker.date.past({
				years: 1,
			}),
		},
	})
}

for (const category of categories) {
	console.log(category)
	await prisma.productCategory.create({
		data: {
			name: category,
		},
	})
}

for (const category of categories) {
	const categoryImages = glob.sync(`public/images/products/${category}/*`)
	console.log(categoryImages)
	for (const image of categoryImages) {
		const productName = faker.commerce.productName()
		await prisma.product.create({
			data: {
				name: productName,
				description: faker.commerce.productDescription(),
				price: Number(faker.commerce.price()),
				category: {
					connect: {
						name: category,
					},
				},
				image: {
					create: {
						blob: fs.readFileSync(image),
						altText: faker.lorem.sentence(),
						contentType: getMimeType(image),
					},
				},
				createdAt: faker.date.past({
					years: 1,
				}),
			},
		})
	}
}

function getMimeType(fileName: string) {
	const mimeTypes = {
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
	}

	const splited = fileName.split('.')
	const extension = splited[splited.length - 1]

	if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
		throw new Error('Invalid file extension')
	}

	return mimeTypes[extension] || 'application/octet-stream'
}
