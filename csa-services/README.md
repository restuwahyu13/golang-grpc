# GGGAMING Service

## Example GRPC Main Setup

```go
package main

import (
	"github.com/uptrace/bun"
	"google.golang.org/grpc"
	"google.golang.org/grpc/health/grpc_health_v1"

	"gitlab.com/gggaming-services/internals/configs"
	"gitlab.com/gggaming-services/internals/helpers"
	"gitlab.com/gggaming-services/internals/packages"
	"gitlab.com/gggaming-services/internals/schemas/ping"
)

var env Environtment

func main() {
	if err := packages.ViperRead(".env", &env); err != nil {
		packages.Logrus("fatal", err)
	}

	db, err := configs.Database(env.DSN)
	if err != nil {
		packages.Logrus("fatal", err)
	}

	go packages.NewConsul().Agent("PingService", env.HOST, env.PORT)
	NewGRPCServer(db)
}

func NewGRPCServer(db *bun.DB) {
	server := grpc.NewServer()

	grpc_health_v1.RegisterHealthServer(server, &serverHealthService{})
	ping.RegisterPingServiceServer(server, &servierPingService{})

	helpers.Graceful(&helpers.GracefulConfig{Server: server, Address: env.HOST, Port: env.PORT})
}
```

## Example GRPC Handler Setup

```go
package main

import (
	"context"
	"net/http"

	"google.golang.org/grpc/health/grpc_health_v1"
	"google.golang.org/protobuf/types/known/emptypb"

	"gitlab.com/gggaming-services/internals/schemas/ping"
)

func (h *serverHealthService) Check(context.Context, *grpc_health_v1.HealthCheckRequest) (*grpc_health_v1.HealthCheckResponse, error) {
	return &grpc_health_v1.HealthCheckResponse{Status: 1}, nil
}

func (h *servierPingService) PingServerUnary(ctx context.Context, in *emptypb.Empty) (*ping.GrpcResponse, error) {
	res := new(ping.GrpcResponse)
	message := "Ping Service Unary Pong"

	res.StatCode = http.StatusOK
	res.StatMessage = &message

	return res, nil
}

func (h *servierPingService) PingServerStreaming(ctx context.Context, in *emptypb.Empty) (*ping.GrpcResponse, error) {
	res := new(ping.GrpcResponse)
	message := "Ping Service Streaming Pong"

	res.StatCode = http.StatusOK
	res.StatMessage = &message

	return res, nil
}

func (h *servierPingService) PingClientUnary(ctx context.Context, body *ping.Body) (*ping.GrpcResponse, error) {
	var (
		res *ping.GrpcResponse = new(ping.GrpcResponse)
	)

	res.StatCode = http.StatusOK
	res.StatMessage = &body.Name

	return res, nil
}

func (h *servierPingService) PingClientStreaming(rpc ping.PingService_PingClientStreamingServer) error {
	var (
		res *ping.GrpcResponse = new(ping.GrpcResponse)
	)

	req, err := rpc.Recv()
	if err != nil {
		return err
	}

	msg := req.Name
	res.StatCode = http.StatusOK
	res.StatMessage = &msg

	if err := rpc.SendMsg(res); err != nil {
		return err
	}

	return nil
}
```