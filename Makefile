.PHONY: all

all: patch_modules build_cores archive

patch_modules:
	./scripts/patch-modules.sh

build_cores:
	./scripts/build-cores.sh

archive:
	./scripts/archive.sh
