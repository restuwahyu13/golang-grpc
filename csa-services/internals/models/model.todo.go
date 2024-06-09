package models

import (
	"github.com/google/uuid"
	"github.com/guregu/null/v5"
	"github.com/uptrace/bun"
)

type Todo struct {
	bun.BaseModel `bun:"table:todo"`
	ID            uuid.UUID   `json:"id" bun:"id,pk,type:uuid,default:uuid_generate_v4()"`
	Title         string      `json:"title" bun:"title,notnull"`
	Description   null.String `json:"description,omitempty" bun:"description,nullzero"`
}
