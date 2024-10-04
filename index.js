#!/usr/bin/env node

const fs = require("fs").promises;
const { glob } = require("glob");
const path = require("path");
const babelParser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { program } = require("commander");
const chalk = require("chalk");

// Load configuration
const CONFIG_PATH = path.join(__dirname, "config.json");
let config;

// Function to load and parse the configuration file
const loadConfig = async () => {
  try {
    const configContent = await fs.readFile(CONFIG_PATH, "utf8");
    config = JSON.parse(configContent);
  } catch (err) {
    console.error(
      chalk.red(`Failed to load configuration file: ${err.message}`)
    );
    process.exit(1);
  }
};

// Define CLI options using Commander
program
  .version("1.0.0")
  .description("Design System Metrics CLI Tool")
  .requiredOption(
    "-p, --project <name>",
    "Specify the project to audit (e.g., extension, mobile)"
  )
  .option("-f, --format <type>", "Output format (csv, json)", "csv")
  .parse(process.argv);

const options = program.opts();

// Initialize component instances and file mappings
let componentInstances = new Map();
let componentFiles = new Map();

// Function to process a single file
const processFile = async (filePath, componentsSet, importedComponentsSet) => {
  try {
    const content = await fs.readFile(filePath, "utf8");

    // Parse the file content into an AST
    const ast = babelParser.parse(content, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    // Traverse the AST to find import declarations from the component library
    traverse(ast, {
      ImportDeclaration({ node }) {
        const importPath = node.source.value;
        console.log(`Import path detected: ${importPath}`);
        if (importPath.includes("/component-library")) {
          node.specifiers.forEach((specifier) => {
            if (specifier.type === "ImportDefaultSpecifier") {
              importedComponentsSet.add(specifier.local.name);
              console.log(
                `Default imported component: ${specifier.local.name}`
              );
            } else if (specifier.type === "ImportSpecifier") {
              importedComponentsSet.add(specifier.local.name);
              console.log(`Named imported component: ${specifier.local.name}`);
            }
          });
        }
      },
    });

    // Traverse the AST to find JSX elements
    traverse(ast, {
      JSXElement({ node }) {
        const openingElement = node.openingElement;
        if (
          openingElement &&
          openingElement.name &&
          (openingElement.name.type === "JSXIdentifier" ||
            openingElement.name.type === "JSXMemberExpression")
        ) {
          let componentName = "";

          if (openingElement.name.type === "JSXIdentifier") {
            componentName = openingElement.name.name;
          } else if (openingElement.name.type === "JSXMemberExpression") {
            // Handle namespaced components like <UI.Button>
            let current = openingElement.name;
            while (current.object) {
              current = current.object;
            }
            componentName = current.name;
          }

          console.log(`JSX component detected: ${componentName}`);

          if (
            componentsSet.has(componentName) &&
            importedComponentsSet.has(componentName)
          ) {
            const count = componentInstances.get(componentName) || 0;
            componentInstances.set(componentName, count + 1);

            const files = componentFiles.get(componentName) || [];
            files.push(filePath);
            componentFiles.set(componentName, files);

            console.log(
              `Matched JSX component: ${componentName}, Count: ${count + 1}`
            );
          }
        }
      },
    });
  } catch (err) {
    console.error(
      chalk.yellow(`Error processing file ${filePath}: ${err.message}`)
    );
  }
};

// Main function to coordinate the audit
const main = async () => {
  await loadConfig();

  const projectName = options.project;
  const projectConfig = config.projects[projectName];

  if (!projectConfig) {
    console.error(
      chalk.red(
        `Project "${projectName}" is not defined in the configuration file.`
      )
    );
    process.exit(1);
  }

  const { rootFolder, ignoreFolders, filePattern, outputFile, components } =
    projectConfig;

  const componentsSet = new Set(components);

  console.log(chalk.blue(`\nStarting audit for project: ${projectName}\n`));

  try {
    const files = await glob(filePattern, {
      ignore: [
        ...ignoreFolders.map((folder) => path.join(folder, "**")),
        `${rootFolder}/**/*.test.{js,tsx}`,
      ],
    });

    if (files.length === 0) {
      console.log(chalk.yellow("No files matched the provided pattern."));
      return;
    }

    // Process files concurrently
    await Promise.all(
      files.map((file) => processFile(file, componentsSet, new Set()))
    );

    console.log(chalk.green("\nComponent Adoption Metrics:"));

    let csvContent = "Component,Instances,File Paths\n";
    let jsonOutput = {};

    componentsSet.forEach((componentName) => {
      const instanceCount = componentInstances.get(componentName) || 0;
      const filePaths = componentFiles.get(componentName) || [];
      console.log(`${chalk.cyan(componentName)}: ${instanceCount}`);

      if (options.format.toLowerCase() === "json") {
        jsonOutput[componentName] = {
          instances: instanceCount,
          files: filePaths,
        };
      } else {
        csvContent += `"${componentName}",${instanceCount},"${filePaths.join(
          ", "
        )}"\n`;
      }
    });

    // Write the metrics to the specified output file
    try {
      if (options.format.toLowerCase() === "json") {
        await fs.writeFile(outputFile, JSON.stringify(jsonOutput, null, 2));
      } else {
        await fs.writeFile(outputFile, csvContent);
      }
      console.log(
        chalk.green(`\nComponent metrics written to ${outputFile}\n`)
      );
    } catch (err) {
      console.error(chalk.red(`Error writing to file: ${err.message}`));
    }
  } catch (err) {
    console.error(chalk.red(`Error reading files: ${err.message}`));
  }
};

main();
