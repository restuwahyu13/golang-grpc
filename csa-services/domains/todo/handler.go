package todoService

import (
	"context"
	"net/http"

	"github.com/uptrace/bun"

	"gitlab.com/csa-services/internals/configs"
	"gitlab.com/csa-services/internals/helpers"
	"gitlab.com/csa-services/internals/middlewares"
	"gitlab.com/csa-services/internals/schemas/todo"
)

type handler struct {
	env     *configs.Environtment
	service IService
}

func NewHandler(env *configs.Environtment, service IService) IHandler {
	return &handler{env: env, service: service}
}

func (h *handler) Created(db *bun.DB, call todo.TodoService_CreatedServer) error {
	var (
		req *createdDTO    = new(createdDTO)
		res *todo.Response = new(todo.Response)
	)

	if err := middlewares.AuthApiKey[context.Context](h.env, call.Context); err != nil {
		res.StatCode = http.StatusUnauthorized
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	if err := helpers.BindRequest[*todo.CreatedDTO, error](call.Recv, req); err != nil {
		res.StatCode = http.StatusBadGateway
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	if err := h.service.Created(db, req, res); err != nil {
		res.StatCode = http.StatusBadGateway
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	return helpers.BindResponse(call.SendMsg, res)
}

func (h *handler) FindAll(db *bun.DB, call todo.TodoService_FindAllServer) error {
	var res *todo.Response = new(todo.Response)

	if err := middlewares.AuthApiKey[context.Context](h.env, call.Context); err != nil {
		res.StatCode = http.StatusUnauthorized
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	if err := h.service.FindAll(db, res); err != nil {
		res.StatCode = http.StatusBadGateway
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	return helpers.BindResponse(call.SendMsg, res)
}

func (h *handler) FindById(db *bun.DB, call todo.TodoService_FindByIdServer) error {
	var (
		req *findByIdDTO   = new(findByIdDTO)
		res *todo.Response = new(todo.Response)
	)

	if err := middlewares.AuthApiKey[context.Context](h.env, call.Context); err != nil {
		res.StatCode = http.StatusUnauthorized
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	if err := helpers.BindRequest[*todo.FindByIdDTO, error](call.Recv, req); err != nil {
		res.StatCode = http.StatusBadGateway
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	if err := h.service.FindById(db, req, res); err != nil {
		res.StatCode = http.StatusBadGateway
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	return helpers.BindResponse(call.SendMsg, res)
}

func (h *handler) DeletedById(db *bun.DB, call todo.TodoService_DeletedByIdServer) error {
	var (
		req *deleteByIdDTO = new(deleteByIdDTO)
		res *todo.Response = new(todo.Response)
	)

	if err := middlewares.AuthApiKey[context.Context](h.env, call.Context); err != nil {
		res.StatCode = http.StatusUnauthorized
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	if err := helpers.BindRequest[*todo.DeleteByIdDTO, error](call.Recv, req); err != nil {
		res.StatCode = http.StatusBadGateway
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	if err := h.service.DeletedById(db, req, res); err != nil {
		res.StatCode = http.StatusBadGateway
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	return helpers.BindResponse(call.SendMsg, res)
}

func (h *handler) UpdatedById(db *bun.DB, call todo.TodoService_UpdatedByIdServer) error {
	var (
		req *updatedByIdDTO = new(updatedByIdDTO)
		res *todo.Response  = new(todo.Response)
	)

	if err := middlewares.AuthApiKey[context.Context](h.env, call.Context); err != nil {
		res.StatCode = http.StatusUnauthorized
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	if err := helpers.BindRequest[*todo.UpdatedByIdDTO, error](call.Recv, req); err != nil {
		res.StatCode = http.StatusBadGateway
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	if err := h.service.UpdatedById(db, req, res); err != nil {
		res.StatCode = http.StatusBadGateway
		res.ErrMessage = err.Error()

		return helpers.BindResponse(call.SendMsg, res)
	}

	return helpers.BindResponse(call.SendMsg, res)
}
