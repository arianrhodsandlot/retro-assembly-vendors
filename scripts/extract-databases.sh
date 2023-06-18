#!/usr/bin/env bash

set -e

wd=$(pwd)
database_dist_dir=$wd/dist/databases

mkdir -p "$database_dist_dir"
cp modules/databases/dat/*.dat "$database_dist_dir"
