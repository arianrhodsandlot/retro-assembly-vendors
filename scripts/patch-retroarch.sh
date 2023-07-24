#!/bin/bash

file_path="modules/retroarch/tasks/task_save.c"
line_number=65
strings_to_append=' || defined(EMSCRIPTEN)'
temp_file=$(mktemp)
awk -v num="$line_number" -v str="$strings_to_append" 'NR == num { $0 = $0 str } 1' "$file_path" > "$temp_file"
mv "$temp_file" "$file_path"
