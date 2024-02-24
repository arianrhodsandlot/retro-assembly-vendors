#!/bin/bash

set -e

wd=$(pwd)

retroarch_dir=$wd/modules/retroarch
cd "$retroarch_dir"
git checkout -f
# git apply "$wd/patches/retroarch.patch"
