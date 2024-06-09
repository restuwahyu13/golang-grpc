import { IsString, IsUUID } from 'class-validator'

export class TodoBodyDTO {
	@IsString()
	title: string

	@IsString()
	description?: string
}

export class TodoParamDTO {
	@IsUUID()
	id: string
}
