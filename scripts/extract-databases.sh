#!/usr/bin/env bash

set -e

wd=$(pwd)
database_dist_dir=$wd/dist/database

mkdir -p "$database_dist_dir"
cp modules/database/dat/*.dat "$database_dist_dir"
