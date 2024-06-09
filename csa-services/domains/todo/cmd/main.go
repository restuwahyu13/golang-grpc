package main

import (
	"context"

	"github.com/uptrace/bun"
	"google.golang.org/grpc"

	"gitlab.com/csa-services/internals/configs"
	"gitlab.com/csa-services/internals/helpers"
	"gitlab.com/csa-services/internals/packages"
	"gitlab.com/csa-services/internals/schemas/todo"
)

/**
=======================================================
=	GRPC SERVER GLOBAL VARIABLE TERITORY
=======================================================
**/

var (
	env *configs.Environtment
	db  *bun.DB
	ctx context.Context
)

/**
=======================================================
=	GRPC SERVER MAIN TERITORY
=======================================================
**/

func main() {
	env = new(configs.Environtment)
	ctx := context.Background()

	err := packages.ViperRead(".env", &env)
	if err != nil {
		packages.Logrus("error", err)
		return
	}

	db, err = configs.Database(env.DSN)
	if err != nil {
		packages.Logrus("error", err)
		return
	}

	newGRPCServer(ctx, env)
}

/**
=======================================================
=	GRPC SERVER REGISTER, HANDLER AND SERVICE  TERITORY
=======================================================
**/

func newGRPCServer(ctx context.Context, env *configs.Environtment) {
	server := grpc.NewServer()
	todo.RegisterTodoServiceServer(server, NewRegisterQuestionServiceServer(ctx))

	helpers.Graceful(&helpers.GracefulOptions{Ctx: ctx, Server: server, Address: env.TODO_HOST, Port: env.TODO_PORT})
}
