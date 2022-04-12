const program = require("commander");
const { Crawler } = require("./lib");
const { debugLog } = require("./lib/debug");

program
  .version("1.0.0")
  .name("find-duplicate-name")
  .description(
    "A CLI tool which lists you files with the same name but a different extension"
  )
  .requiredOption("-e,--extensions [extensions]", "Extension seperated list")
  .requiredOption("-p,--path [path]", "Path to scan")
  .option(
    "--ignore_pattern [folder]",
    "Pattern of folders to ignore in the search"
  )
  .parse(process.argv);

(async () => {
  try {
    // Use current working dir vs __dirname where this code lives
    const pathToScan = program.opts().path;

    // Use user input or default options

    const extensions = program.opts().extensions;

    const cralwer = new Crawler({
      extensions,
      ignore_list: ["**/node_modules/**"],
    });

    debugLog(`Starting search at ${pathToScan}`);
    const results = await cralwer.crawlDir(pathToScan, extensions.split(","));
    cralwer.printResults(results);
  } catch (error) {
    console.log(error);
  }
})();
