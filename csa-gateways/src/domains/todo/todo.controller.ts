import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'

import { ApiResponse } from '~/internals/helpers/api.helper'
import { Grpc } from '~/internals/helpers/grpc.helper'
import { AuthGuard } from '~/internals/guards/auth.guard'
import { TodoService } from './todo.service'
import { TodoBodyDTO, TodoParamDTO } from './todo.dto'

@UseGuards(AuthGuard)
@Controller('todo')
export class TodoController {
	constructor(private readonly todoService: TodoService) {}

	@Post()
	async created(@Req() req: Request, @Body() body: TodoBodyDTO): Promise<ApiResponse> {
		return this.todoService.created(req, body)
	}

	@Get()
	async findAll(@Req() req: Request): Promise<ApiResponse> {
		return this.todoService.findAll(req)
	}

	@Get(':id')
	async findById(@Req() req: Request, @Param() param: TodoParamDTO): Promise<ApiResponse> {
		return this.todoService.findById(req, param)
	}

	@Delete(':id')
	async deletedById(@Req() req: Request, @Param() param: TodoParamDTO): Promise<ApiResponse> {
		return this.todoService.deletedById(req, param)
	}

	@Put(':id')
	async updatedById(@Req() req: Request, @Param() param: TodoParamDTO, @Body() body: TodoBodyDTO): Promise<ApiResponse> {
		return this.todoService.updatedById(req, Grpc.transformRequest(param, body))
	}
}
