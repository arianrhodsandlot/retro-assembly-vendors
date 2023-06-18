#!/usr/bin/env bash

set -e

wd=$(pwd)
core_dist_dir=$wd/dist/cores
cores=(beetle_vb fceumm gearboy gw mgba nestopia pcsx2 picodrive snes9x)

mkdir -p "$core_dist_dir"
cd "$core_dist_dir"

for core in "${cores[@]}"
do
  curl -O "https://web.libretro.com/$core.js"
  curl -O "https://web.libretro.com/$core.wasm"
done
