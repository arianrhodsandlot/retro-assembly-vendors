.PHONY: all

all: patch_retroarch build_cores archive

patch_retroarch:
	./scripts/patch-retroarch.sh

build_cores:
	./scripts/build-cores.sh

archive:
	./scripts/archive.sh
