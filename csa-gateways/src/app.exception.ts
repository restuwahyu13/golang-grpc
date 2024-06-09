import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus as status, Logger } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Response } from 'express'
import { OutgoingMessage } from 'http'
import validator from 'validator'

@Catch()
export class AppErrorException implements ExceptionFilter {
  private readonly logger: Logger = new Logger('AppErrorException')
  private statCode: number = status.INTERNAL_SERVER_ERROR
  private errCode: string = 'GENERAL_ERROR'
  private errMessage: string = 'Application between service is busy please try again later!'

  async catch(exception: HttpException, host: ArgumentsHost): Promise<OutgoingMessage> {
    const args: HttpArgumentsHost = host.switchToHttp()
    const res: Response = args.getResponse<Response>()
    const error: Record<string, any> = exception

    if (error instanceof HttpException) {
      this.logger.error(`
      ==================================
      ======== Error Exception 1 =========
      ==================================

        name: ${exception.name}
        code: ${exception.getStatus()}
        message: ${exception.message}
        response: ${JSON.stringify(exception.getResponse())}
        stack: ${exception.stack}

      ==================================
      ==================================
      ==================================
      `)

      this.statCode = exception && !Number.isNaN(exception.getStatus()) ? exception.getStatus() : status.INTERNAL_SERVER_ERROR

      const resMessage: any = exception.getResponse()
      const customErrMessage = resMessage.hasOwnProperty('message') ? resMessage.message : resMessage
      this.errMessage = exception && !validator.isEmpty(exception.message) ? customErrMessage : this.errMessage

      args.getNext()
    } else if (error instanceof Error) {
      this.logger.error(`
      ==================================
      ======== Error Exception 2 =========
      ==================================

        name: ${error.name}
        message: ${error.message}
        response: ${JSON.stringify(error)}
        stack: ${error.stack}

      ==================================
      ==================================
      ==================================
      `)

      args.getNext()
    } else {
      this.logger.error(`
      ==================================
      ======== Error Exception 3 =========
      ==================================

        name: ${error.name}
        message: ${error.message}
        response: ${JSON.stringify(error)}
        stack: ${error.stack}

      ==================================
      ==================================
      ==================================
      `)

      this.statCode = error && error?.statCode ? error.statCode : this.statCode
      this.errMessage = error && error?.errMessage ? error.errMessage : this.errMessage

      args.getNext()
    }

    if (this.statCode === status.BAD_REQUEST) {
      this.statCode = status.UNPROCESSABLE_ENTITY
    } else if (this.statCode === status.FAILED_DEPENDENCY) {
      this.statCode = status.INTERNAL_SERVER_ERROR
    }

    const customErrorMsgAndErrCode: { errCode: string; errMessage?: string } = this.setDefaultErrMsgAndErrCode(this.statCode)
    if (customErrorMsgAndErrCode.errCode) {
      this.errCode = customErrorMsgAndErrCode.errCode
    } else if (customErrorMsgAndErrCode.errCode && customErrorMsgAndErrCode.errMessage) {
      this.errCode = customErrorMsgAndErrCode.errCode
      this.errMessage = customErrorMsgAndErrCode.errMessage
    }

    return res.status(this.statCode).json({ statCode: this.statCode, errCode: this.errCode, errMessage: this.errMessage })
  }

  private setDefaultErrMsgAndErrCode(statCode: number): { errCode: string; errMessage?: string } {
    if (statCode === status.INTERNAL_SERVER_ERROR) {
      this.errCode = 'GENERAL_ERROR'
      this.errMessage = 'Application between service is busy please try again later!'
    } else if (statCode === status.BAD_GATEWAY) {
      this.errCode = 'SERVICE_ERROR'
      this.errMessage = 'Application communication between server busy try again later!'
    } else if (statCode === status.SERVICE_UNAVAILABLE) {
      this.errCode = 'SERVICE_UNAVAILABLE'
      this.errMessage = 'Application communication between server not available try again later!'
    } else if (statCode === status.GATEWAY_TIMEOUT) {
      this.errCode = 'SERVICE_TIMEOUT'
      this.errMessage = 'Application communication between server timeout try again later!'
    } else if (statCode === status.CONFLICT) {
      this.errCode = 'DUPLICATE_RESOURCE'
    } else if (statCode === status.UNPROCESSABLE_ENTITY) {
      this.errCode = 'INVALID_REQUEST'
    } else if (statCode === status.PRECONDITION_FAILED) {
      this.errCode = 'REQUEST_COULD_NOT_BE_PROCESSED'
    } else if (statCode === status.FORBIDDEN) {
      this.errCode = 'ACCESS_DENIED'
    } else if (statCode === status.UNAUTHORIZED) {
      this.errCode = 'UNAUTHORIZED_TOKEN'
    } else if (statCode === status.NOT_FOUND) {
      this.errCode = 'UNKNOWN_RESOURCE'
    }

    return { errCode: this.errCode, errMessage: this.errMessage }
  }
}
