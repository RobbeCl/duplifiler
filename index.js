#!/usr/bin/env node

import { program } from "commander";
import { Matcher } from "./lib/index.js";
import { debugLog } from "./lib/debug.js";

program
  .name("duplifiler")
  .description(
    "A CLI tool which lists you files with the same name but a different extension"
  )
  .requiredOption("-e,--extensions [extensions]", "Extension seperated list")
  .requiredOption("-p,--path [path]", "Path to scan")
  .option(
    "--ignore_pattern [ignore_pattern]",
    "Pattern of folders to ignore in the search"
  )
  .parse(process.argv);

(async () => {
  try {
    const pathToScan = program.opts().path;

    const matcher = new Matcher({
      extensions: program.opts().extensions,
      ignore_pattern_list: program.opts().ignore_pattern,
    });

    debugLog(`Starting search at ${pathToScan}`);
    const results = await matcher.matchPatterns(pathToScan);
    matcher.printResults(results);
  } catch (error) {
    console.log(error);
  }
})();
