package todoService

import (
	"context"
	"database/sql"
	"net/http"
	"reflect"

	"github.com/google/uuid"
	"github.com/guregu/null/v5"
	"github.com/uptrace/bun"

	"gitlab.com/csa-services/internals/configs"
	"gitlab.com/csa-services/internals/helpers"
	"gitlab.com/csa-services/internals/models"
	"gitlab.com/csa-services/internals/schemas/todo"
)

type service struct {
	ctx context.Context
	env *configs.Environtment
}

func NewService(ctx context.Context, env *configs.Environtment) IService {
	return &service{ctx: ctx, env: env}
}

func (s *service) Created(db *bun.DB, req *createdDTO, res *todo.Response) error {
	todoModel := new(models.Todo)

	err := db.NewSelect().Table("todo").
		Column("id").
		Where("title = ?", req.Title).
		Scan(s.ctx, &todoModel.ID)

	if err != nil && err != sql.ErrNoRows {
		return err
	}

	if !reflect.DeepEqual(todoModel.ID, uuid.UUID{}) {
		res.StatCode = http.StatusConflict
		res.ErrMessage = "Todo already exists"

		return nil
	}

	todoModel.Title = req.Title
	todoModel.Description = null.StringFrom(req.Description)

	result, err := db.NewInsert().Model(todoModel).Exec(s.ctx)
	if err != nil {
		return err
	}

	if rows, err := result.RowsAffected(); err != nil || rows <= 0 {
		res.StatCode = http.StatusPreconditionFailed
		res.ErrMessage = "Created new todo failed"

		return nil
	}

	res.StatCode = http.StatusCreated
	res.StatMessage = "Created new todo successfully"

	return nil
}

func (s *service) FindAll(db *bun.DB, res *todo.Response) error {
	var (
		todoModel []models.Todo   = []models.Todo{}
		parser    helpers.IParser = helpers.NewParser()
	)

	err := db.NewSelect().Model(&todoModel).Scan(s.ctx, &todoModel)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	res.StatCode = http.StatusOK
	res.StatMessage = "Successfully"
	res.Data = parser.StructToAnyPb(todoModel)

	return nil
}

func (s *service) FindById(db *bun.DB, req *findByIdDTO, res *todo.Response) error {
	var (
		todoModel *models.Todo    = new(models.Todo)
		parser    helpers.IParser = helpers.NewParser()
	)

	err := db.NewSelect().Model(todoModel).
		Where("id = ?", req.ID).
		Scan(s.ctx, todoModel)

	if err != nil && err != sql.ErrNoRows {
		return err
	}

	if err == sql.ErrNoRows {
		res.StatCode = http.StatusNotFound
		res.ErrMessage = "Todo doesn't match our data"

		return nil
	}

	res.StatCode = http.StatusOK
	res.StatMessage = "Successfully"
	res.Data = parser.StructToAnyPb(todoModel)

	return nil
}

func (s *service) DeletedById(db *bun.DB, req *deleteByIdDTO, res *todo.Response) error {
	todoModel := new(models.Todo)

	err := db.NewSelect().Model(todoModel).Where("id = ?", req.ID).Scan(s.ctx, todoModel)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	if err == sql.ErrNoRows {
		res.StatCode = http.StatusNotFound
		res.ErrMessage = "Todo doesn't match our data"

		return nil
	}

	result, err := db.NewDelete().Model(todoModel).Where("id = ?", req.ID).Exec(s.ctx)
	if err != nil {
		return err
	}

	if rows, err := result.RowsAffected(); err != nil || rows <= 0 {
		res.StatCode = http.StatusPreconditionFailed
		res.ErrMessage = "Deleted todo failed"

		return nil
	}

	res.StatCode = http.StatusOK
	res.StatMessage = "Deleted todo successfully"

	return nil
}

func (s *service) UpdatedById(db *bun.DB, req *updatedByIdDTO, res *todo.Response) error {
	todoModel := new(models.Todo)

	err := db.NewSelect().Model(todoModel).Where("id = ?", req.ID).Scan(s.ctx, todoModel)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	if err == sql.ErrNoRows {
		res.StatCode = http.StatusNotFound
		res.ErrMessage = "Todo doesn't match our data"

		return nil
	}

	todoModel.Title = req.Title
	todoModel.Description = null.StringFrom(req.Description)

	result, err := db.NewUpdate().Model(todoModel).Where("id = ?", req.ID).OmitZero().Exec(s.ctx)
	if err != nil {
		return err
	}

	if rows, err := result.RowsAffected(); err != nil || rows <= 0 {
		res.StatCode = http.StatusPreconditionFailed
		res.ErrMessage = "Updated old todo failed"

		return nil
	}

	res.StatCode = http.StatusOK
	res.StatMessage = "Updated old todo successfully"

	return nil
}
