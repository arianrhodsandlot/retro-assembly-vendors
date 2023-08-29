#!/bin/bash

set -e

wd=$(pwd)

retroarch_dir=$wd/modules/retroarch
cd "$retroarch_dir"
git checkout -f
git apply "$wd/patches/retroarch.patch"

genesis_plus_gx_dir=$wd/modules/cores/Genesis-Plus-GX
cd "$genesis_plus_gx_dir"
git checkout -f
git apply "$wd/patches/genesis-plus-gx.patch"
