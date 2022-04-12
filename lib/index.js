import defaults from "defaults";
import { globby } from "globby";
import { debugLog } from "./debug.js";
import path from "path";

export class Matcher {
  constructor(options) {
    this.options = defaults(options, {
      extensions: [],
      ignore_pattern_list: [],
    });

    debugLog(`Initialized with: ${JSON.stringify(this.options, null, 2)}`);
  }

  printResults(results) {
    console.log(`${Object.keys(results).length} result(s) found:`);
    Object.keys(results).forEach((_key) => {
      console.log(results[_key]);
    });
  }

  async matchPatterns(pathDir) {
    const matchedResults = await globby(
      [`${pathDir}/**/*{${this.options.extensions}}`],
      {
        onlyFiles: true,
        ignore: this.options.ignore_pattern_list,
      }
    );

    const results = matchedResults.reduce((prev, curr) => {
      if (prev[this.normalize(curr)]) {
        prev[this.normalize(curr)] += 1;
      } else {
        prev[this.normalize(curr)] = 1;
      }

      return prev;
    }, {});

    const result = [];
    Object.keys(results).forEach((_key) => {
      if (results[_key] > 1) {
        result.push(_key);
      }
    });
    return result;
  }

  normalize(pathURL) {
    return pathURL.substr(0, pathURL.length - path.parse(pathURL).ext.length);
  }
}
