#!/usr/bin/env node

const {
  promises: { readdir },
} = require("fs");
const path = require("path");
const fg = require("fast-glob");

class Crawler {
  constructor(options) {
    this.extensions = options.extensions;
    this.ignore_list = options.ignore_list
      ? fg.sync(options.ignore_list, { dot: true })
      : [];

    console.log(fg.sync(options.ignore_list, { dot: true }));
  }

  printResults(results) {
    console.log(`${Object.keys(results).length} result(s) found`);
    Object.keys(results).forEach((_key) => {
      console.log(results[_key]);
    });
  }

  async crawlDir(currentPath) {
    const [foldersInsideDir, filesInsideDir] = await Promise.all([
      this.getDirectories(currentPath),
      this.getFiles(currentPath),
    ]);

    const results = (
      await Promise.all(
        foldersInsideDir.map(async (folder) => {
          if (this.ignore_list.includes(folder)) {
            return {};
          }
          return (await this.crawlDir(`${currentPath}/${folder}`)) ?? {};
        })
      )
    ).reduce((prev, curr) => {
      Object.keys(curr).forEach((_currKey) => {
        prev[_currKey] = curr[_currKey];
      });

      return prev;
    }, {});

    // TODO: Make more performant
    filesInsideDir.forEach((_toSearchFile) => {
      filesInsideDir.forEach((_loopFile) => {
        if (!this.extensions.includes(path.parse(_toSearchFile).ext)) {
          return;
        }
        if (!this.extensions.includes(path.parse(_loopFile).ext)) {
          return;
        }

        if (_toSearchFile === _loopFile) {
          return;
        }

        if (path.parse(_toSearchFile).name === path.parse(_loopFile).name) {
          results[`${currentPath}/${path.parse(_loopFile).name}`] = [
            `${currentPath}/${_toSearchFile}`,
            `${currentPath}/${_loopFile}`,
          ];
        }
      });
    });

    return results;
  }

  async getDirectories(source) {
    return (
      (await readdir(source, { withFileTypes: true }))
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name) ?? []
    );
  }

  async getFiles(source) {
    return (
      (await readdir(source, { withFileTypes: true }))
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name) ?? []
    );
  }
}

module.exports = {
  Crawler,
};
