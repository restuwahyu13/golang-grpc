package middlewares

import (
	"context"
	"errors"

	"gitlab.com/csa-services/internals/configs"
	"gitlab.com/csa-services/internals/helpers"
)

func AuthApiKey[T context.Context](env *configs.Environtment, ctx func() context.Context) error {
	apiKey := ""

	if err := helpers.BindHeaders[context.Context](ctx, "Authorization", &apiKey); err != nil {
		return err
	}

	if env.API_KEY != apiKey {
		return errors.New("Invalid credential")
	}

	return nil
}
