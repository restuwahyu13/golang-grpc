package helpers

import (
	"context"
	"time"
)

type (
	IContext interface {
		Timeout() (context.Context, error)
	}

	sctx struct {
		ctx context.Context
	}
)

func NewContext(ctx context.Context) IContext {
	return &sctx{ctx: ctx}
}

func (h *sctx) Timeout() (context.Context, error) {
	ctx, cancel := context.WithTimeout(h.ctx, time.Duration(time.Minute*3))
	defer cancel()

	select {

	case <-ctx.Done():
		h.ctx = context.Background()
		return nil, ctx.Err()

	default:
		return h.ctx, nil
	}
}
