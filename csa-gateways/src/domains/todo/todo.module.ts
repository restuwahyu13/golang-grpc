import { Module } from '@nestjs/common'
import { ClientProvider, ClientsModule, Transport } from '@nestjs/microservices'
import path from 'path'

import { TODO_SERVICE_NAME, TODO_PACKAGE_NAME } from '~/internals/schemas/protofiles/todo.pb'
import { TodoService } from './todo.service'
import { TodoController } from './todo.controller'

@Module({
	imports: [
		ClientsModule.registerAsync({
			clients: [
				{
					name: TODO_SERVICE_NAME,
					useFactory: async (): Promise<ClientProvider> => {
						return {
							transport: Transport.GRPC,
							options: {
								url: process.env.TODO_SERVICE_URL,
								package: TODO_PACKAGE_NAME,
								maxReceiveMessageLength: +process.env.INBOUND_SIZE_MAX,
								maxSendMessageLength: +process.env.INBOUND_SIZE_MAX,
								maxMetadataSize: +process.env.INBOUND_SIZE_MAX,
								gracefulShutdown: true,
								protoPath: path.join(process.cwd(), 'dist/protofiles/todo.proto')
							}
						}
					}
				}
			]
		})
	],
	controllers: [TodoController],
	providers: [TodoService]
})
export class TodoModule {}
