import { HttpStatus as status, Logger } from '@nestjs/common'

export interface ApiResponse {
  statCode: number
  statMessage?: string
  errCode?: string
  errMessage?: any
  data?: any
  pagination?: Record<string, any>
}

export const apiResponse = (configs: Partial<ApiResponse>): ApiResponse => {
  const errCode: string = 'GENERAL_ERROR'
  let errMessage: string = 'Application between service is busy please try again later!'

  if (configs instanceof Error) {
    errMessage = configs.message
  }

  for (const i of Object.keys(configs)) {
    if (configs[i] === undefined) {
      delete configs[i]
    }
  }

  if (configs instanceof Error) {
    const logger: Logger = new Logger('AppErrorException')
    const error: Error = new Error(configs as any)
    logger.error(error.stack)
    console.error('\n')
  }

  if (!configs.statCode && !configs.statMessage && !configs.errMessage) {
    configs.errCode = errCode
    configs.errMessage = errMessage
  }

  return { statCode: configs.statCode ?? status.INTERNAL_SERVER_ERROR, ...configs }
}
