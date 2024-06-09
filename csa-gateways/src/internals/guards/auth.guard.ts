import { Injectable, CanActivate, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Request } from 'express'
import { IncomingHttpHeaders } from 'http'

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger = new Logger('AuthGuard')
	private readonly errMessage: string = 'Invalid credentials'

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const args: HttpArgumentsHost = context.switchToHttp()
			const req: Request = args.getRequest()

			const headers: IncomingHttpHeaders = req.headers
			if (!headers.authorization) {
				throw new UnauthorizedException(this.errMessage)
			}

			const authToken: string = headers.authorization
			if (!authToken) {
				throw new UnauthorizedException(this.errMessage)
			}

			if (process.env.API_KEY !== authToken) {
				throw new UnauthorizedException(this.errMessage)
			}

			return true
		} catch (e: any) {
			this.logger.error(e)
			throw new UnauthorizedException(this.errMessage)
		}
	}
}
