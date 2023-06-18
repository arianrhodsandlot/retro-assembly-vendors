.PHONY: all

all: build_cores download_cores extract_databases archive

build_cores:
	./scripts/build-cores.sh

download_cores:
	./scripts/download-cores.sh

extract_databases:
	./scripts/extract-databases.sh

archive:
	./scripts/archive.sh
