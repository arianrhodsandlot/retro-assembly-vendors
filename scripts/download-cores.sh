#!/usr/bin/env bash

set -e

wd=$(pwd)
core_dist_dir=$wd/dist/cores
cores=(mednafen_vb fceumm gearboy gw mgba nestopia snes9x)

mkdir -p "$core_dist_dir"
cd "$core_dist_dir"

for core in "${cores[@]}"
do
  curl -Of https://web.libretro.com/"$core"_libretro.js
  curl -Of https://web.libretro.com/"$core"_libretro.wasm
done
