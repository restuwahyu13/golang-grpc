package helpers

import (
	"bytes"
	"fmt"
	"strconv"
	"strings"

	"github.com/goccy/go-json"
	"github.com/sirupsen/logrus"
	"google.golang.org/protobuf/types/known/anypb"
)

type IParser interface {
	ToString(v interface{}) string
	ToInt(v interface{}) (int, error)
	ToFloat(v interface{}) (float64, error)
	ToByte(v interface{}) ([]byte, error)
	Marshal(source interface{}) ([]byte, error)
	Unmarshal(src []byte, dest interface{}) error
	StructToAnyPb(v interface{}) *anypb.Any
}

type parser struct{}

func NewParser() IParser {
	return &parser{}
}

func (h *parser) ToString(v interface{}) string {
	return strings.TrimSpace(fmt.Sprintf("%v", v))
}

func (h *parser) ToInt(v interface{}) (int, error) {
	parse, err := strconv.Atoi(h.ToString(v))
	if err != nil {
		return 0, nil
	}

	return parse, nil
}

func (h *parser) ToFloat(v interface{}) (float64, error) {
	parse, err := strconv.ParseFloat(h.ToString(v), 64)
	if err != nil {
		return 0, err
	}

	return parse, nil
}

func (h *parser) ToByte(v interface{}) ([]byte, error) {
	reader := strings.NewReader(h.ToString(v))
	data := &bytes.Buffer{}

	if _, err := reader.WriteTo(data); err != nil {
		return nil, err
	}

	return data.Bytes(), nil
}

func (h *parser) StructToAnyPb(v interface{}) *anypb.Any {
	vByte, err := h.Marshal(v)
	if err != nil {
		logrus.Error(err)
	}

	return &anypb.Any{Value: vByte}
}

func (h *parser) Marshal(src interface{}) ([]byte, error) {
	return json.Marshal(src)
}

func (h *parser) Unmarshal(src []byte, dest interface{}) error {
	decoder := json.NewDecoder(bytes.NewReader(src))

	for decoder.More() {
		if err := decoder.Decode(dest); err != nil {
			return err
		}
	}

	return nil
}
