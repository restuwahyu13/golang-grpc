# GGGAMING Gateways

## Example NestJs Customization Functionality

- ### Custom ExceptionFilter

    ```ts
    import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

    @Catch()
    export class FiltersFilter<T> implements ExceptionFilter {
    	catch(_exception: T, _host: ArgumentsHost) {}
    }
    ```

- ### Custom Decorators

    ```ts
    import { SetMetadata } from '@nestjs/common';

    export const Decorators = (...args: string[]) => SetMetadata('decorators', args);

    ```

    ```ts
    import { ExecutionContext, createParamDecorator } from '@nestjs/common'

    export const UserProfile = createParamDecorator((data, ctx: ExecutionContext): number[] => {
      const req = ctx.switchToHttp().getRequest()
      return req.user
    })
    ```

- ### Custom CanActivate

    ```ts
    @Injectable()
    export class GuardsGuard implements CanActivate {
    	canActivate(_context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    		return true
    	}
    }
    ```

- ### Custom NestInterceptor

    ```ts
    @Injectable()
    export class InterceptorsInterceptor implements NestInterceptor {
    	intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    		return next.handle()
    	}
    }
    ```

- ### Custom PipeTransform

    ```ts
    @Injectable()
    export class PipesPipe implements PipeTransform {
    	transform(value: any, _metadata: ArgumentMetadata) {
    		return value
    	}
    }
    ```

- ### Custom NestMiddleware

    ```ts
    @Injectable()
    export class MiddlewaresMiddleware implements NestMiddleware {
    	use(_req: Request, _res: Response, next: () => void) {
    		next()
    	}
    }
    ```

## Example GRPC Controller

```ts
import { Body, Controller, Get, Post } from '@nestjs/common'

import { PingService } from '~/domains/ping/ping.service'
import { apiResponse, ApiResponse } from '~/internals/helpers/helper.api'
import { Opossum } from '~/internals/libs/opossum.lib'

@Controller()
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get('server-unary')
  async pingServerUnary(): Promise<ApiResponse> {
    try {
      const pingService: ApiResponse = await Opossum.circuit(() => this.pingService.pingServerUnary())
      return pingService
    } catch (e: any) {
      throw apiResponse(e)
    }
  }

  @Get('server-stream')
  async pingServerStreaming(): Promise<ApiResponse> {
    try {
      const pingService: ApiResponse = await Opossum.circuit(() => this.pingService.pingServerStreaming())
      return pingService
    } catch (e: any) {
      throw apiResponse(e)
    }
  }

  @Post('client-unary')
  async pingClientUnary(@Body() body: Record<string, any>): Promise<ApiResponse> {
    try {
      const pingService: ApiResponse = await Opossum.circuit(() => this.pingService.pingClientUnary(body))
      return pingService
    } catch (e: any) {
      throw apiResponse(e)
    }
  }

  @Post('client-stream')
  async pingClientStream(@Body() body: Record<string, any>): Promise<ApiResponse> {
    try {
      const pingService: ApiResponse = await Opossum.circuit(() => this.pingService.pingClientStream(body))
      return pingService
    } catch (e: any) {
      throw apiResponse(e)
    }
  }
}
```

## Example GRPC Service

```ts
import { Metadata } from '@grpc/grpc-js'
import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom, ReplaySubject } from 'rxjs'

import { ApiResponse, apiResponse } from '~/internals/helpers/helper.api'
import { Body, GrpcResponse, PING_SERVICE_NAME, PingServiceClient } from '~/internals/schemas/protofiles/ping.pb'
import { Empty } from '~/internals/schemas/google/protobuf/empty.pb'

@Injectable()
export class PingService {
  constructor(@Inject(PING_SERVICE_NAME) private readonly grpcClient: ClientGrpc) {}

  async pingServerUnary(): Promise<ApiResponse> {
    const pingServiceClient = this.grpcClient.getService<PingServiceClient>(PING_SERVICE_NAME)
    const service: GrpcResponse = await lastValueFrom(pingServiceClient.pingServerUnary(Empty, new Metadata()))

    return apiResponse({ stat_code: service.statCode, stat_message: service.statMessage })
  }

  async pingServerStreaming(): Promise<ApiResponse> {
    const pingServiceClient = this.grpcClient.getService<PingServiceClient>(PING_SERVICE_NAME)
    const service: GrpcResponse = await lastValueFrom(pingServiceClient.pingServerStreaming(Empty, new Metadata()))

    return apiResponse({ stat_code: service.statCode, stat_message: service.statMessage })
  }

  async pingClientUnary(body: Body): Promise<ApiResponse> {
    const pingServiceClient = this.grpcClient.getService<PingServiceClient>(PING_SERVICE_NAME)
    const service: GrpcResponse = await lastValueFrom(pingServiceClient.pingClientUnary(body, new Metadata()))

    return apiResponse({ stat_code: service.statCode, stat_message: service.statMessage })
  }

  async pingClientStream(body: Body): Promise<ApiResponse> {
    const helloRequest = new ReplaySubject<Body>()
    helloRequest.next(body)

    const pingServiceClient = this.grpcClient.getService<PingServiceClient>(PING_SERVICE_NAME)
    const service: GrpcResponse = await lastValueFrom(pingServiceClient.pingClientStreaming(helloRequest, new Metadata()))

    return apiResponse({ stat_code: service.statCode, stat_message: service.statMessage })
  }
}
```
