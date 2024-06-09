package packages

import (
	"os"
	"strings"

	"github.com/caarlos0/env"
	"github.com/spf13/viper"

	"gitlab.com/csa-services/internals/helpers"
)

func ViperRead(name string, config interface{}) error {
	envMap := make(map[string]interface{})

	if _, ok := os.LookupEnv("GO_ENV"); !ok {
		viper.SetConfigFile(name)
		viper.AutomaticEnv()

		err := viper.ReadInConfig()
		if err != nil {
			return err
		}

		for _, v := range viper.AllKeys() {
			envMap[strings.ToUpper(v)] = ViperGet(strings.ToUpper(v))
			os.Setenv(strings.ToUpper(v), ViperGet(strings.ToUpper(v)))
		}

		envMapByte, err := helpers.NewParser().Marshal(&envMap)
		if err != nil {
			return err
		}

		if err := helpers.NewParser().Unmarshal(envMapByte, config); err != nil {
			return err
		}
	} else {
		if err := env.Parse(config); err != nil {
			return err
		}
	}

	return nil
}

func ViperSet(key, value string) {
	viper.Set(key, value)
}

func ViperGet(env string) string {
	return viper.GetString(env)
}
