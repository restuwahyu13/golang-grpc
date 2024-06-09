import { HttpStatus as status, Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { Request } from 'express'

import { ApiResponse, apiResponse } from '~/internals/helpers/api.helper'
import { Grpc } from '~/internals/helpers/grpc.helper'
import { Empty } from '~/internals/schemas/google/protobuf/empty.pb'
import {
	CreatedDTO,
	FindByIdDTO,
	DeleteByIdDTO,
	UpdatedByIdDTO,
	Response,
	TODO_SERVICE_NAME,
	TodoServiceClient
} from '~/internals/schemas/protofiles/todo.pb'

@Injectable()
export class TodoService {
	constructor(@Inject(TODO_SERVICE_NAME) private readonly grpcClient: ClientGrpc) {}

	async created(req: Request, body: CreatedDTO): Promise<ApiResponse> {
		try {
			const { reply, metadata } = Grpc.transformBody<CreatedDTO, CreatedDTO>(req, body)

			const service: TodoServiceClient = this.grpcClient.getService<TodoServiceClient>(TODO_SERVICE_NAME)
			const res: Response = await Grpc.transformResponse<Response>(service.created(reply, metadata))

			if (res.statCode >= status.BAD_REQUEST) {
				throw res
			}

			return apiResponse(res)
		} catch (e: any) {
			throw apiResponse(e)
		}
	}

	async findAll(req: Request): Promise<ApiResponse> {
		try {
			const { reply, metadata } = Grpc.transformBody<Empty, Empty>(req, Empty)

			const service: TodoServiceClient = this.grpcClient.getService<TodoServiceClient>(TODO_SERVICE_NAME)
			const res: Response = await Grpc.transformResponse<Response>(service.findAll(reply, metadata))

			if (res.statCode >= status.BAD_REQUEST) {
				throw res
			}

			return apiResponse(res)
		} catch (e: any) {
			throw apiResponse(e)
		}
	}

	async findById(req: Request, param: FindByIdDTO): Promise<ApiResponse> {
		try {
			const { reply, metadata } = Grpc.transformBody<FindByIdDTO, FindByIdDTO>(req, param)

			const service: TodoServiceClient = this.grpcClient.getService<TodoServiceClient>(TODO_SERVICE_NAME)
			const res: Response = await Grpc.transformResponse<Response>(service.findById(reply, metadata))

			if (res.statCode >= status.BAD_REQUEST) {
				throw res
			}

			return apiResponse(res)
		} catch (e: any) {
			throw apiResponse(e)
		}
	}

	async deletedById(req: Request, param: DeleteByIdDTO): Promise<ApiResponse> {
		try {
			const { reply, metadata } = Grpc.transformBody<DeleteByIdDTO, DeleteByIdDTO>(req, param)

			const service: TodoServiceClient = this.grpcClient.getService<TodoServiceClient>(TODO_SERVICE_NAME)
			const res: Response = await Grpc.transformResponse<Response>(service.deletedById(reply, metadata))

			if (res.statCode >= status.BAD_REQUEST) {
				throw res
			}

			return apiResponse(res)
		} catch (e: any) {
			throw apiResponse(e)
		}
	}

	async updatedById(req: Request, param: UpdatedByIdDTO): Promise<ApiResponse> {
		try {
			const { reply, metadata } = Grpc.transformBody<UpdatedByIdDTO, UpdatedByIdDTO>(req, param)

			const service: TodoServiceClient = this.grpcClient.getService<TodoServiceClient>(TODO_SERVICE_NAME)
			const res: Response = await Grpc.transformResponse<Response>(service.updatedById(reply, metadata))

			if (res.statCode >= status.BAD_REQUEST) {
				throw res
			}

			return apiResponse(res)
		} catch (e: any) {
			throw apiResponse(e)
		}
	}
}
