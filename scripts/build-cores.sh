#!/usr/bin/env bash

set -e

wd=$(pwd)
emsdk_dir=$wd/modules/emsdk
cores_dir=$wd/modules/cores
retroarch_dir=$wd/modules/retroarch
retroarch_dist_dir=$retroarch_dir/dist-scripts
retroarch_pkg_dir=$retroarch_dir/pkg/emscripten
cores_dist_dir=$wd/dist/cores

mkdir -p "$cores_dist_dir"

function activate_emscripten() {
  emsdk_version=$1
  "$emsdk_dir/emsdk" install "$emsdk_version"
  "$emsdk_dir/emsdk" activate "$emsdk_version"
  . "$wd/modules/emsdk/emsdk_env.sh"

  node_bin_dir="${EMSDK_NODE%/*}"
  python_bin_dir="${EMSDK_PYTHON%/*}"
  PATH=$python_bin_dir:$node_bin_dir:$PATH

  # emmake and its friends use "python" in their hashbang while newer python only provides a "python3"
  if ! command -v python &> /dev/null; then
    ln -s "$EMSDK_PYTHON" "$python_bin_dir"/python
  fi
}

function build_core_bitcode() {
  core=$1
  echo "building bitcode for core $core ..."
  # remove early compiled outputs
  cd "$retroarch_dir"
  git clean -xf

  cd "$cores_dir/$core"
  if [ -e Makefile.libretro ]; then
    emmake make -f Makefile.libretro platform=emscripten
  else
    if [ -e libretro/Makefile ]; then
      cd libretro
    elif [ -e platforms/libretro/Makefile ]; then
      cd platforms/libretro
    elif [ -e src/burner/libretro/Makefile ]; then
      cd src/burner/libretro
    fi
    emmake make platform=emscripten
  fi
  mv ./*.bc "$retroarch_dist_dir"
  echo "build bitcode for core $core finished!"
}

function dist_cores()  {
  echo "Compiling bitcode files..."

  # compile bitcode (.bc) files to wasm files
  cd "$retroarch_dist_dir"
  emmake ./dist-cores.sh emscripten
  # move compiled js/wasm files to our dist directory
  mv "$retroarch_pkg_dir"/*.{js,wasm} "$cores_dist_dir"
  echo "Compile bitcode files finished!"
}

activate_emscripten '1.40.1'
cores=(a5200 beetle-lynx-libretro beetle-ngp-libretro beetle-vb-libretro beetle-wswan-libretro Genesis-Plus-GX libretro-fceumm mgba prosystem-libretro snes9x stella2014-libretro)
for core in "${cores[@]}"; do
  build_core_bitcode "$core"
done
dist_cores

activate_emscripten '2.0.34'
cores=(FBNeo)
for core in "${cores[@]}"; do
  build_core_bitcode "$core"
done
dist_cores
