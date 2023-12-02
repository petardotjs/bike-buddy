import { faker } from '@faker-js/faker'
import { prisma } from '#app/utils/db.server.ts'
import { glob } from 'glob'
import fs from 'fs'

const images = glob.sync('public/images/*')

for (const image of images) {
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

function getMimeType(fileName: string) {
	const mimeTypes = {
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
	}

	const extension = fileName.split('.')[1]

	if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
		throw new Error('Invalid file extension')
	}

	return mimeTypes[extension] || 'application/octet-stream'
}
