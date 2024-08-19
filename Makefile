.PHONY: all

all: build_cores archive

build_cores:
	./scripts/build-cores.sh

archive:
	./scripts/archive.sh
