package main

import (
	"context"

	todoService "gitlab.com/csa-services/domains/todo"
	"gitlab.com/csa-services/internals/schemas/todo"
)

type registerTodoServiceServer struct {
	todo.UnimplementedTodoServiceServer
}

var (
	serviceQuestionService todoService.IService
	handlerQuestionService todoService.IHandler
)

func NewRegisterQuestionServiceServer(ctx context.Context) *registerTodoServiceServer {
	serviceQuestionService = todoService.NewService(ctx, env)
	handlerQuestionService = todoService.NewHandler(env, serviceQuestionService)

	return &registerTodoServiceServer{}
}

func (h *registerTodoServiceServer) Created(call todo.TodoService_CreatedServer) error {
	return handlerQuestionService.Created(db, call)
}

func (h *registerTodoServiceServer) FindAll(call todo.TodoService_FindAllServer) error {
	return handlerQuestionService.FindAll(db, call)
}

func (h *registerTodoServiceServer) FindById(call todo.TodoService_FindByIdServer) error {
	return handlerQuestionService.FindById(db, call)
}

func (h *registerTodoServiceServer) DeletedById(call todo.TodoService_DeletedByIdServer) error {
	return handlerQuestionService.DeletedById(db, call)
}

func (h *registerTodoServiceServer) UpdatedById(call todo.TodoService_UpdatedByIdServer) error {
	return handlerQuestionService.UpdatedById(db, call)
}
