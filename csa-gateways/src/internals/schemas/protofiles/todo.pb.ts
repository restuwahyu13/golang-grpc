/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { Any } from "../google/protobuf/any.pb";
import { Empty } from "../google/protobuf/empty.pb";

export const protobufPackage = "todo";

export interface Response {
  $type?: "todo.Response";
  statCode?: number | undefined;
  statMessage?: string | undefined;
  errCode?: string | undefined;
  errMessage?: string | undefined;
  data?: Any | undefined;
  pagination?: Any | undefined;
}

export interface CreatedDTO {
  $type?: "todo.CreatedDTO";
  title?: string | undefined;
  description?: string | undefined;
}

export interface FindByIdDTO {
  $type?: "todo.FindByIdDTO";
  id?: string | undefined;
}

export interface DeleteByIdDTO {
  $type?: "todo.DeleteByIdDTO";
  id?: string | undefined;
}

export interface UpdatedByIdDTO {
  $type?: "todo.UpdatedByIdDTO";
  id?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
}

export const TODO_PACKAGE_NAME = "todo";

function createBaseResponse(): Response {
  return { $type: "todo.Response" };
}

export const Response = {
  $type: "todo.Response" as const,

  encode(message: Response, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statCode !== undefined && message.statCode !== 0) {
      writer.uint32(8).int32(message.statCode);
    }
    if (message.statMessage !== undefined && message.statMessage !== "") {
      writer.uint32(18).string(message.statMessage);
    }
    if (message.errCode !== undefined && message.errCode !== "") {
      writer.uint32(26).string(message.errCode);
    }
    if (message.errMessage !== undefined && message.errMessage !== "") {
      writer.uint32(34).string(message.errMessage);
    }
    if (message.data !== undefined) {
      Any.encode(message.data, writer.uint32(42).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      Any.encode(message.pagination, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Response {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.statCode = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.statMessage = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.errCode = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.errMessage = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.data = Any.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.pagination = Any.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Response {
    return {
      $type: Response.$type,
      statCode: isSet(object.statCode) ? globalThis.Number(object.statCode) : undefined,
      statMessage: isSet(object.statMessage) ? globalThis.String(object.statMessage) : undefined,
      errCode: isSet(object.errCode) ? globalThis.String(object.errCode) : undefined,
      errMessage: isSet(object.errMessage) ? globalThis.String(object.errMessage) : undefined,
      data: isSet(object.data) ? Any.fromJSON(object.data) : undefined,
      pagination: isSet(object.pagination) ? Any.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: Response): unknown {
    const obj: any = {};
    if (message.statCode !== undefined && message.statCode !== 0) {
      obj.statCode = Math.round(message.statCode);
    }
    if (message.statMessage !== undefined && message.statMessage !== "") {
      obj.statMessage = message.statMessage;
    }
    if (message.errCode !== undefined && message.errCode !== "") {
      obj.errCode = message.errCode;
    }
    if (message.errMessage !== undefined && message.errMessage !== "") {
      obj.errMessage = message.errMessage;
    }
    if (message.data !== undefined) {
      obj.data = Any.toJSON(message.data);
    }
    if (message.pagination !== undefined) {
      obj.pagination = Any.toJSON(message.pagination);
    }
    return obj;
  },

  create(base?: DeepPartial<Response>): Response {
    return Response.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Response>): Response {
    const message = createBaseResponse();
    message.statCode = object.statCode ?? undefined;
    message.statMessage = object.statMessage ?? undefined;
    message.errCode = object.errCode ?? undefined;
    message.errMessage = object.errMessage ?? undefined;
    message.data = (object.data !== undefined && object.data !== null) ? Any.fromPartial(object.data) : undefined;
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? Any.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseCreatedDTO(): CreatedDTO {
  return { $type: "todo.CreatedDTO" };
}

export const CreatedDTO = {
  $type: "todo.CreatedDTO" as const,

  encode(message: CreatedDTO, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== undefined && message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== undefined && message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreatedDTO {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatedDTO();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.title = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.description = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreatedDTO {
    return {
      $type: CreatedDTO.$type,
      title: isSet(object.title) ? globalThis.String(object.title) : undefined,
      description: isSet(object.description) ? globalThis.String(object.description) : undefined,
    };
  },

  toJSON(message: CreatedDTO): unknown {
    const obj: any = {};
    if (message.title !== undefined && message.title !== "") {
      obj.title = message.title;
    }
    if (message.description !== undefined && message.description !== "") {
      obj.description = message.description;
    }
    return obj;
  },

  create(base?: DeepPartial<CreatedDTO>): CreatedDTO {
    return CreatedDTO.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreatedDTO>): CreatedDTO {
    const message = createBaseCreatedDTO();
    message.title = object.title ?? undefined;
    message.description = object.description ?? undefined;
    return message;
  },
};

function createBaseFindByIdDTO(): FindByIdDTO {
  return { $type: "todo.FindByIdDTO" };
}

export const FindByIdDTO = {
  $type: "todo.FindByIdDTO" as const,

  encode(message: FindByIdDTO, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FindByIdDTO {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFindByIdDTO();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FindByIdDTO {
    return { $type: FindByIdDTO.$type, id: isSet(object.id) ? globalThis.String(object.id) : undefined };
  },

  toJSON(message: FindByIdDTO): unknown {
    const obj: any = {};
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create(base?: DeepPartial<FindByIdDTO>): FindByIdDTO {
    return FindByIdDTO.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<FindByIdDTO>): FindByIdDTO {
    const message = createBaseFindByIdDTO();
    message.id = object.id ?? undefined;
    return message;
  },
};

function createBaseDeleteByIdDTO(): DeleteByIdDTO {
  return { $type: "todo.DeleteByIdDTO" };
}

export const DeleteByIdDTO = {
  $type: "todo.DeleteByIdDTO" as const,

  encode(message: DeleteByIdDTO, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteByIdDTO {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteByIdDTO();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeleteByIdDTO {
    return { $type: DeleteByIdDTO.$type, id: isSet(object.id) ? globalThis.String(object.id) : undefined };
  },

  toJSON(message: DeleteByIdDTO): unknown {
    const obj: any = {};
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create(base?: DeepPartial<DeleteByIdDTO>): DeleteByIdDTO {
    return DeleteByIdDTO.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DeleteByIdDTO>): DeleteByIdDTO {
    const message = createBaseDeleteByIdDTO();
    message.id = object.id ?? undefined;
    return message;
  },
};

function createBaseUpdatedByIdDTO(): UpdatedByIdDTO {
  return { $type: "todo.UpdatedByIdDTO" };
}

export const UpdatedByIdDTO = {
  $type: "todo.UpdatedByIdDTO" as const,

  encode(message: UpdatedByIdDTO, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.title !== undefined && message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    if (message.description !== undefined && message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdatedByIdDTO {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdatedByIdDTO();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.title = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.description = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdatedByIdDTO {
    return {
      $type: UpdatedByIdDTO.$type,
      id: isSet(object.id) ? globalThis.String(object.id) : undefined,
      title: isSet(object.title) ? globalThis.String(object.title) : undefined,
      description: isSet(object.description) ? globalThis.String(object.description) : undefined,
    };
  },

  toJSON(message: UpdatedByIdDTO): unknown {
    const obj: any = {};
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.title !== undefined && message.title !== "") {
      obj.title = message.title;
    }
    if (message.description !== undefined && message.description !== "") {
      obj.description = message.description;
    }
    return obj;
  },

  create(base?: DeepPartial<UpdatedByIdDTO>): UpdatedByIdDTO {
    return UpdatedByIdDTO.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<UpdatedByIdDTO>): UpdatedByIdDTO {
    const message = createBaseUpdatedByIdDTO();
    message.id = object.id ?? undefined;
    message.title = object.title ?? undefined;
    message.description = object.description ?? undefined;
    return message;
  },
};

export interface TodoServiceClient {
  created(request: Observable<CreatedDTO>, metadata: Metadata, ...rest: any): Observable<Response>;

  findAll(request: Observable<Empty>, metadata: Metadata, ...rest: any): Observable<Response>;

  findById(request: Observable<FindByIdDTO>, metadata: Metadata, ...rest: any): Observable<Response>;

  deletedById(request: Observable<DeleteByIdDTO>, metadata: Metadata, ...rest: any): Observable<Response>;

  updatedById(request: Observable<UpdatedByIdDTO>, metadata: Metadata, ...rest: any): Observable<Response>;
}

export interface TodoServiceController {
  created(
    request: Observable<CreatedDTO>,
    metadata: Metadata,
    ...rest: any
  ): Promise<Response> | Observable<Response> | Response;

  findAll(
    request: Observable<Empty>,
    metadata: Metadata,
    ...rest: any
  ): Promise<Response> | Observable<Response> | Response;

  findById(
    request: Observable<FindByIdDTO>,
    metadata: Metadata,
    ...rest: any
  ): Promise<Response> | Observable<Response> | Response;

  deletedById(
    request: Observable<DeleteByIdDTO>,
    metadata: Metadata,
    ...rest: any
  ): Promise<Response> | Observable<Response> | Response;

  updatedById(
    request: Observable<UpdatedByIdDTO>,
    metadata: Metadata,
    ...rest: any
  ): Promise<Response> | Observable<Response> | Response;
}

export function TodoServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TodoService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["created", "findAll", "findById", "deletedById", "updatedById"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TodoService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TODO_SERVICE_NAME = "TodoService";

export interface TodoServiceImplementation<CallContextExt = {}> {
  created(request: AsyncIterable<CreatedDTO>, context: CallContext & CallContextExt): Promise<DeepPartial<Response>>;
  findAll(request: AsyncIterable<Empty>, context: CallContext & CallContextExt): Promise<DeepPartial<Response>>;
  findById(request: AsyncIterable<FindByIdDTO>, context: CallContext & CallContextExt): Promise<DeepPartial<Response>>;
  deletedById(
    request: AsyncIterable<DeleteByIdDTO>,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<Response>>;
  updatedById(
    request: AsyncIterable<UpdatedByIdDTO>,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<Response>>;
}

export interface TodoServiceClient<CallOptionsExt = {}> {
  created(request: AsyncIterable<DeepPartial<CreatedDTO>>, options?: CallOptions & CallOptionsExt): Promise<Response>;
  findAll(request: AsyncIterable<DeepPartial<Empty>>, options?: CallOptions & CallOptionsExt): Promise<Response>;
  findById(request: AsyncIterable<DeepPartial<FindByIdDTO>>, options?: CallOptions & CallOptionsExt): Promise<Response>;
  deletedById(
    request: AsyncIterable<DeepPartial<DeleteByIdDTO>>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<Response>;
  updatedById(
    request: AsyncIterable<DeepPartial<UpdatedByIdDTO>>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<Response>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in Exclude<keyof T, "$type">]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
