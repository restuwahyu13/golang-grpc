import { Request } from 'express'
import { Metadata } from '@grpc/grpc-js'
import { lastValueFrom, Observable, ReplaySubject } from 'rxjs'

interface Response {
	statCode?: number
	statMessage?: string
	errCode?: string
	errMessage?: string
	data?: { type_url: string; value: Buffer | Uint8Array | string }
	pagination?: { type_url: string; value: Buffer | Uint8Array | string }
}

export class Grpc {
	static transformHeader(req: Request): Metadata {
		const metadata: Metadata = new Metadata()
		const header: Record<string, any> = req.headers

		delete header['connection']
		header['x-content-type'] = header['content-type']
		header['x-user-agent'] = header['user-agent']

		const keys: string[] = Object.keys(header)

		for (const k of keys) {
			if (header[k] !== undefined) {
				metadata.set(k, header[k])
			}
		}

		return metadata
	}

	static transformBody<T = any, U = any>(req: Request, body: U): { reply: Observable<T>; metadata: Metadata } {
		const metadata: Metadata = Grpc.transformHeader(req)

		if (body.hasOwnProperty('$type')) {
			body = {} as any
		}

		for (const i of Object.keys(body)) {
			if (Object.prototype.isPrototypeOf(body[i])) {
				body[i] = { value: Buffer.from(JSON.stringify(body[i])) }
			}
		}

		const reply: ReplaySubject<T> = new ReplaySubject<T>()
		reply.next(body as any)

		return { reply, metadata }
	}

	static async transformResponse<T = any>(src: Observable<any>): Promise<T> {
		const res: Response = await lastValueFrom(src)
		const goInvalidValue: string[] = [null, '', '0001-01-01T00:00:00Z', '00000000-0000-0000-0000-000000000000']

		if (res.data?.value && res.data.value.length > 0) {
			const data: any = JSON.parse(res.data.value.toString())
			const keys: string[] = Object.keys(data)

			for (const k of keys) {
				if (goInvalidValue.includes(data[k])) {
					delete data[k]
				}
			}

			res.data = data
		}

		if (res.pagination?.value && res.pagination.value.length > 0) {
			const pagination: any = JSON.parse(res.pagination.value.toString())
			const keys: string[] = Object.keys(pagination)

			for (const k of keys) {
				if (goInvalidValue.includes(pagination[k])) {
					delete pagination[k]
				}
			}

			res.pagination = pagination
		}

		return res as any
	}

	static transformRequest<T = any>(...src: any[]): T {
		let obj: any = {}

		if (src.length > 0) {
			src.forEach((v) => {
				obj = Object.assign(obj, { ...v })
			})
		}

		return obj
	}
}
