#!/usr/bin/env bash

set -e

wd=$(pwd)
emsdk_dir=$wd/modules/emsdk
cores_dir=$wd/modules/cores
retroarch_dir=$wd/modules/retroarch
retroarch_dist_dir=$retroarch_dir/dist-scripts

# activate emscripten
emsdk_version='1.39.5'
"$emsdk_dir/emsdk" install $emsdk_version
"$emsdk_dir/emsdk" activate $emsdk_version
. modules/emsdk/emsdk_env.sh

node_bin_dir="${EMSDK_NODE%/*}"
python_bin_dir="${EMSDK_PYTHON%/*}"
PATH=$python_bin_dir:$node_bin_dir:$PATH

# emmake and its friends use "python" in their hashbang while newer python only provides a "python3"
if ! command -v python &> /dev/null; then
  ln -s "$EMSDK_PYTHON" "$python_bin_dir"/python
fi

# generate bitcode (.bc) files for each cores
cd "$cores_dir"
for core in */; do
  cd "$cores_dir/$core"
  if [ -e Makefile.libretro ]; then
    echo "building core $core ..."
    emmake make -f Makefile.libretro platform=emscripten
  else
    echo "building core $core ..."
    emmake make platform=emscripten
  fi
  mv ./*.bc "$retroarch_dist_dir"
done

# compile bitcode (.bc) files to wasm files
cd "$retroarch_dist_dir"
emmake ./dist-cores.sh emscripten

# move compiled js/wasm files to our dist directory
core_dist_dir=$wd/dist/cores
mkdir -p "$core_dist_dir"
retroarch_pkg_dir=$retroarch_dir/pkg/emscripten
mv "$retroarch_pkg_dir"/*.{js,wasm} "$core_dist_dir"
