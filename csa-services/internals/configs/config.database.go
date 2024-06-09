package configs

import (
	"database/sql"
	"time"

	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"

	"gitlab.com/csa-services/internals/packages"
)

func Database(dsn string) (*bun.DB, error) {
	db := sql.OpenDB(pgdriver.NewConnector(
		pgdriver.WithDSN(dsn),
		pgdriver.WithReadTimeout(time.Second*time.Duration(60)),
		pgdriver.WithWriteTimeout(time.Second*time.Duration(30)),
		pgdriver.WithTimeout(time.Second*time.Duration(30)),
		pgdriver.WithDialTimeout(time.Second*time.Duration(30)),
		pgdriver.WithInsecure(true),
	))

	if err := db.Ping(); err != nil {
		defer packages.Logrus("error", "Database connection error: %v", err)
		return nil, err
	}

	if db != nil {
		defer packages.Logrus("info", "Database connection success")
		db.SetConnMaxIdleTime(time.Duration(time.Second * time.Duration(30)))
		db.SetConnMaxLifetime(time.Duration(time.Second * time.Duration(30)))
	}

	bundb := bun.NewDB(db, pgdialect.New())

	if env := packages.ViperGet("GO_ENV"); env != "production" {
		bundb.AddQueryHook(bundebug.NewQueryHook(bundebug.WithEnabled(true), bundebug.WithVerbose(true), bundebug.FromEnv("BUNDEBUG")))
	}

	return bundb, nil
}
