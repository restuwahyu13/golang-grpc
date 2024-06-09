package todoService

import (
	"github.com/uptrace/bun"

	"gitlab.com/csa-services/internals/schemas/todo"
)

type (
	IHandler interface {
		Created(db *bun.DB, call todo.TodoService_CreatedServer) error
		FindAll(db *bun.DB, call todo.TodoService_FindAllServer) error
		FindById(db *bun.DB, call todo.TodoService_FindByIdServer) error
		DeletedById(db *bun.DB, call todo.TodoService_DeletedByIdServer) error
		UpdatedById(db *bun.DB, call todo.TodoService_UpdatedByIdServer) error
	}

	IService interface {
		Created(db *bun.DB, req *createdDTO, res *todo.Response) error
		FindAll(db *bun.DB, res *todo.Response) error
		FindById(db *bun.DB, req *findByIdDTO, res *todo.Response) error
		DeletedById(db *bun.DB, req *deleteByIdDTO, res *todo.Response) error
		UpdatedById(db *bun.DB, req *updatedByIdDTO, res *todo.Response) error
	}
)
