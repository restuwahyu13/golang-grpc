package todoService

import "github.com/google/uuid"

type (
	createdDTO struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}

	findByIdDTO struct {
		ID uuid.UUID `json:"id"`
	}

	deleteByIdDTO struct {
		ID uuid.UUID `json:"id"`
	}

	updatedByIdDTO struct {
		ID          uuid.UUID `json:"id"`
		Title       string    `json:"title"`
		Description string    `json:"description"`
	}
)
