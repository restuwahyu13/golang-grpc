package helpers

import "math"

type pagination struct {
	Limit   int     `json:"limit"`
	Offset  int     `json:"offset"`
	Perpage float64 `json:"perpage"`
	Total   int     `json:"total"`
}

func Pagination(limit, offset, total int) *pagination {
	pg := new(pagination)
	pg.Limit = limit
	pg.Offset = offset
	pg.Perpage = math.Ceil(float64(total) / float64(limit))
	pg.Total = total

	return pg
}
