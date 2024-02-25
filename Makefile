.PHONY: all

all: patch_modules build_cores archive

build_cores:
	./scripts/build-cores.sh

archive:
	./scripts/archive.sh
