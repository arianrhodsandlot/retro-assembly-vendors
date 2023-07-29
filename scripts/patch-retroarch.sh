#!/bin/bash

set -e

cd modules/retroarch
git checkout -f
git apply ../../patches/retroarch/task_save.c.patch
