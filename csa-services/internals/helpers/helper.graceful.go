package helpers

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
)

const (
	TCP        = "tcp"
	UDPConn    = "udp"
	UNIXConn   = "unix"
	UNIXPACKET = "unixpacket"
)

type GracefulOptions struct {
	Ctx     context.Context
	Server  *grpc.Server
	Address string
	Port    string
}

func Graceful(options *GracefulOptions) {
	var (
		nlc        net.ListenConfig = net.ListenConfig{}
		signalChan chan os.Signal   = make(chan os.Signal, 1)
	)

	ctx, cancel := context.WithTimeout(options.Ctx, time.Duration(time.Second*120))
	defer cancel()

	signal.Notify(signalChan, syscall.SIGTERM, syscall.SIGABRT, syscall.SIGKILL, syscall.SIGINT, syscall.SIGALRM)

	go func() {
		sig := <-signalChan
		logrus.Infof("Signal received %s", sig.String())
		os.Exit(0)

	}()

	nls, err := nlc.Listen(ctx, "tcp", fmt.Sprintf("%s:%s", options.Address, options.Port))
	if err != nil {
		logrus.Fatal(err)
		return
	}

	logrus.Print("\n")
	logrus.Infof("Server listening on port %s", options.Port)

	if err := options.Server.Serve(nls); err != nil && err != http.ErrServerClosed {
		logrus.Fatal(err)
		return
	}
}
