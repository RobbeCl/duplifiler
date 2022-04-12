# find-duplicate-name

Find files with the same name but a different extension recursively within a folder.

I use it to find files which are both javascript and typescript files in the same folder. This can happen when migrating from javascript to typescript and someone edits the original javascript file.

## Usage

`npx find-duplicate-name --extensions .js,.ts --ignore_pattern "**/node_modules/**" -p .
