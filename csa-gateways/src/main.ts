import 'express-async-errors'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppErrorException } from '~/app.exception'
import { AppInterceptor } from '~/app.interceptor'
import { AppModule } from '~/app.module'
import bodyparser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import hpp from 'hpp'
import nocache from 'nocache'
import 'reflect-metadata'
import zlib from 'zlib'

class Application {
	private app: NestExpressApplication
	private logger: Logger
	private host: string
	private port: number

	constructor() {
		this.logger = new Logger('HttpServer')
		this.host = process.env.HOST ?? '0.0.0.0'
		this.port = +process.env.PORT ?? 3000
	}

	private async setupApplication(): Promise<void> {
		this.app = (await NestFactory.create(AppModule, { bufferLogs: true })) as any
	}

	private globalConfig(): void {
		this.app.useGlobalPipes(new ValidationPipe({ transform: true }))
		this.app.useGlobalFilters(new AppErrorException())
		this.app.useGlobalInterceptors(new AppInterceptor())
		this.app.enableShutdownHooks()
		this.app.disable('x-powered-by')
		this.app.enableCors({
			origin: '*',
			methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
			allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Signature', 'X-RequestID'],
			credentials: true
		})
	}

	private globalMiddleware(): void {
		this.app.use(nocache())
		this.app.use(helmet())
		this.app.use(bodyparser.json({ limit: +process.env.INBOUND_SIZE_MAX }))
		this.app.use(bodyparser.raw({ limit: +process.env.INBOUND_SIZE_MAX }))
		this.app.use(bodyparser.urlencoded({ limit: +process.env.INBOUND_SIZE_MAX, extended: true }))
		this.app.use(hpp({ checkBody: true, checkQuery: true, checkBodyOnlyForContentType: 'application/json' }))
		this.app.use(
			compression({
				strategy: zlib.constants.Z_RLE,
				level: zlib.constants.Z_BEST_COMPRESSION,
				memLevel: zlib.constants.Z_BEST_COMPRESSION
			})
		)
	}

	private serverListening(): void {
		this.app.listen(this.port, this.host, () => this.logger.log(`Server listening on port ${this.port}`))
	}

	async bootstrapping(): Promise<void> {
		await this.setupApplication()
		this.globalConfig()
		this.globalMiddleware()
		this.serverListening()
	}
}

/**
 * @description boostraping app and run app with env development | production | staging | testing
 */

;((): void => {
	new Application().bootstrapping()
})()
