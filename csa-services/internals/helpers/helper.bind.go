package helpers

import (
	"context"
	"errors"
	"fmt"
	"reflect"

	"github.com/goccy/go-json"
	"google.golang.org/grpc/metadata"
)

func BindResponse(send func(m any) error, dest any) error {
	if err := send(dest); err != nil {
		return err
	}

	return nil
}

func BindRequest[T any, U error](recv func() (T, U), dest any) error {
	var (
		err  error = nil
		body any   = nil
	)

	body, err = recv()
	if err != nil {
		return err
	}

	bodyByte, err := NewParser().Marshal(&body)
	if err != nil {
		return nil
	}

	if err := NewParser().Unmarshal(bodyByte, dest); err != nil {

		return nil
	}

	return nil
}

func BindHeaders[T context.Context](ctx func() context.Context, key string, dest any) error {
	incomingMessage, ok := metadata.FromIncomingContext(ctx())
	storeIncomingMessage := make(map[string]string)

	if !ok {
		return errors.New("Invalid incoming message")
	}

	getIncomingMessage := incomingMessage.Get(key)
	if len(getIncomingMessage) <= 0 {
		return errors.New("Find incoming message failed")
	}

	for _, v := range getIncomingMessage {
		storeIncomingMessage[key] = v
	}

	if reflect.ValueOf(storeIncomingMessage).IsNil() {
		return errors.New("List incoming message failed")
	}

	message := storeIncomingMessage[key]

	if !json.Valid([]byte(message)) {
		message = fmt.Sprintf(`"%v"`, message)
	}

	if err := json.Unmarshal([]byte(message), dest); err != nil {
		return err
	}

	return nil
}
