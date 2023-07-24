.PHONY: all

all: patch_retroarch build_cores extract_databases archive

patch_retroarch:
	./scripts/patch-retroarch.sh

build_cores:
	./scripts/build-cores.sh

extract_databases:
	./scripts/extract-databases.sh

archive:
	./scripts/archive.sh
