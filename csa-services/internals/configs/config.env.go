package configs

/*
================================================
	GRPC SERVER ENV TERITORY
================================================
*/

type Environtment struct {
	ENV       string `json:"GO_ENV"  env:"GO_ENV" envDefault:"development"`
	DSN       string `json:"PG_DSN" env:"PG_DSN" envDefault:"postgres://root:root@localhost:5432/postgres?sslmode=disable"`
	API_KEY   string `json:"API_KEY" env:"API_KEY" envDefault:"af7c1fe6-d669-414e-b066-e9733f0de7a8"`
	TODO_HOST string `json:"TODO_HOST" env:"TODO_HOST" envDefault:"0.0.0.0"`
	TODO_PORT string `json:"TODO_PORT" env:"TODO_PORT" envDefault:"30000"`
}
