const { cwd } = require("process");
const {
  promises: { readdir },
} = require("fs");
const { flatten } = require("lodash");
const path = require("path");

const getDirectories = async (source) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getFiles = async (source) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);

const ignore_list = ["node_modules"];
const check_extensions = [".js", ".ts"];

async function crawlDir(currentPath) {
  const [foldersInsideDir, filesInsideDir] = await Promise.all([
    getDirectories(currentPath),
    getFiles(currentPath),
  ]);

  const results = flatten(
    await Promise.all(
      foldersInsideDir.map(async (folder) => {
        if (ignore_list.includes(folder)) {
          return [];
        }
        return crawlDir(`${currentPath}/${folder}`);
      })
    )
  );

  // Do the current directory
  filesInsideDir.forEach((_toSearchFile) => {
    filesInsideDir.forEach((_loopFile) => {
      if (!check_extensions.includes(path.parse(_toSearchFile).ext)) {
        return;
      }
      if (!check_extensions.includes(path.parse(_loopFile).ext)) {
        return;
      }

      if (_toSearchFile === _loopFile) {
        return;
      }

      if (path.parse(_toSearchFile).name === path.parse(_loopFile).name) {
        results.push([
          `${currentPath}/${_toSearchFile}`,
          `${currentPath}/${_loopFile}`,
        ]);
      }
    });
  });

  return results;
}

crawlDir(cwd()).then((results) => {
  console.log(results);

  console.log(`Total: ${results.length}`);
});
