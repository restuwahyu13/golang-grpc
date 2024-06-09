#################################
# GRPC Compiler Territory
#################################

.PHONY: protoc-cli-go-install
protoc-cli-go-install:
	go install -v google.golang.org/protobuf/cmd/protoc-gen-go@latest \
	google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

.PHONY: protoc-cli-js-install
protoc-cli-js-install:
	npm i ts-proto -g

.PHONY: protoc-gen-go
protoc-gen-go:
	rm -rf ${PWD}/csa-services/internals/schemas/**
	\
	protoc --proto_path= ./protofiles/*.proto \
	--fatal_warnings \
	--plugin=${HOME}/go/bin/protoc-gen-go-grpc,enum_stringer=true \
	--go_out="${PWD}/csa-services/internals/schemas"
	\
	protoc --proto_path= ./protofiles/*.proto \
	--fatal_warnings \
	--plugin=${HOME}/go/bin/protoc-gen-go-grpc,enum_stringer=true \
	--go-grpc_out="${PWD}/csa-services/internals/schemas"

.PHONY: protoc-gen-js
protoc-gen-js:
	rm -rf ${PWD}/csa-gateways/src/internals/schemas/**
	\
	protoc --proto_path= ./protofiles/*.proto \
	--fatal_warnings \
	--plugin=${HOME}/Library/Application\ Support/fnm/node-versions/v20.11.1/installation/bin/protoc-gen-ts_proto \
	--ts_proto_out=${PWD}/csa-gateways/src/internals/schemas \
	--ts_proto_opt=nestJs=true,addNestjsRestParameter=true,addGrpcMetadata=true,env=node,outputServices=nice-grpc,stringEnums=true,outputJsonMethods=true,outputPartialMethods=true,outputEncodeMethods=false,outputClientImpl=false,outputTypeAnnotations=optional,useAbortSignal=true,useExactTypes=false,useOptionals=all,fileSuffix=.pb

#################################
# Application Territory
#################################

NPM := npm
GGW_DIR := $(realpath csa-gateways)
GSV_DIR := $(realpath csa-services)

##################################
# App Gateway Command Territory
##################################

.PHONY: gdev
gdev:
	@cd ${GGW_DIR}; ${NPM} run dev

.PHONY: gstart
gstart:
	@cd ${GGW_DIR}; ${NPM} start

.PHONY: gbuild
gbuild:
	@cd ${GGW_DIR}; ${NPM} run build

##################################
# App Service Command Territory
##################################

.PHONY: sdev
sdev:
ifdef type
	@cd ${GSV_DIR}; nodemon -V -e .go -w . -x go run ./domains/${type}/cmd --count=1 --race -V --signal SIGTERM
endif

.PHONY: sbuild
sbuild:
ifdef type
	@cd ${GSV_DIR}; go mod tidy
	@cd ${GSV_DIR}; go mod verify
	@cd ${GSV_DIR}; go vet --race -v ./domains/${type}/cmd
	@cd ${GSV_DIR}; go build --race -v -o ${type} ./domains/${type}/cmd
endif