#!/usr/bin/env bash

set -e

wd=$(pwd)
database_dist_dir=$wd/dist/databases
database_dir=$wd/modules/database
rdb_dir=$database_dir/rdb

mkdir -p "$database_dist_dir"
cp "$rdb_dir"/* "$database_dist_dir"
