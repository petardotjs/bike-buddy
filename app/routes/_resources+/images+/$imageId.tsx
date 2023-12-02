import { prisma } from '#app/utils/db.server.ts'
import { DataFunctionArgs, json } from '@remix-run/node'
import fs from 'fs'

export async function loader({ params }: DataFunctionArgs) {
	if (!params.imageId) {
		throw json({ message: 'Image not found' }, { status: 404 })
	}

	const image = await prisma.postImage.findUnique({
		select: {
			blob: true,
			contentType: true,
		},
		where: {
			id: params.imageId,
		},
	})

	if (!image) {
		throw json({ message: 'Image not found' }, { status: 404 })
	}

	return new Response(image.blob, {
		headers: {
			'Content-Type': image.contentType,
		},
	})
}
