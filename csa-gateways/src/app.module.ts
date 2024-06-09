import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { TodoModule } from '~/domains/todo/todo.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env'],
			expandVariables: true,
			isGlobal: true,
			cache: true
		}),
		TodoModule
	]
})
export class AppModule {}
