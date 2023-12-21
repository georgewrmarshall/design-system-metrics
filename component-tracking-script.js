const fs = require("fs").promises;
const glob = require("glob");
const path = require("path");

const rootFolder = "ui";
const ignoreFolder = path.join(rootFolder, "components", "component-library");

const components = new Set([
  // Add component names here
  "AvatarAccount",
  "AvatarFavicon",
  "AvatarIcon",
  "AvatarNetwork",
  "AvatarToken",
  "AvatarBase",
  "BadgeWrapper",
  "Box",
  "Button",
  "ButtonBase",
  "ButtonIcon",
  "ButtonLink",
  "ButtonPrimary",
  "ButtonSecondary",
  "Checkbox",
  "Container",
  "FormTextField",
  "HeaderBase",
  "HelpText",
  "Icon",
  "Label",
  "PickerNetwork",
  "Tag",
  "TagUrl",
  "Text",
  "Input",
  "TextField",
  "TextFieldSearch",
  "ModalContent",
  "ModalOverlay",
  "ModalFocus",
  "Modal",
  "ModalBody",
  "BannerBase",
  "BannerAlert",
  "BannerTip",
  "PopoverHeader",
  "Popover",
  "ModalHeader",
  "SelectButton",
  "SelectOption",
  "SelectWrapper",
]);

const componentInstances = new Map();

// Initialize a map to store the file paths for each component
const componentFiles = new Map();

const processFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const importRegex =
      /import\s+{[^}]*}\s+from\s+['"][^'"]*\/component-library['"]/g;
    const isImported = importRegex.test(content);

    console.log(`Processing file ${filePath}`);
    console.log(`Is imported from component library: ${isImported}`);

    if (isImported) {
      const matches = content.match(/<([A-Z]\w*)(?=\s|\/|>)/g);

      console.log(`Matches: ${matches}`);

      if (matches) {
        matches.forEach((match) => {
          const componentName = match.substring(1);
          if (components.has(componentName)) {
            const count = componentInstances.get(componentName) || 0;
            componentInstances.set(componentName, count + 1);

            // Get the current list of file paths for the component
            const filePaths = componentFiles.get(componentName) || [];
            // Add the current file path to the list
            filePaths.push(filePath);
            // Update the list of file paths for the component
            componentFiles.set(componentName, filePaths);

            console.log(`Matched component: ${componentName}`);
            console.log(`Current count: ${count + 1}`);
            console.log(`File paths: ${filePaths}`);
          } else {
            console.log(
              `Component not in list or not imported from component library: ${componentName}`
            );
          }
        });
      }
    }
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
  }
};

glob(
  `${rootFolder}/**/*.{js,tsx}`,
  { ignore: [`${ignoreFolder}/**`, `${rootFolder}/**/*.test.{js,tsx}`] },
  async (err, files) => {
    if (err) {
      console.error("Error reading files:", err);
      return;
    }

    await Promise.all(files.map(processFile));

    console.log("Component Adoption Metrics:");
    let csvContent = "Component,Instances,File Paths\n";
    components.forEach((componentName) => {
      const instanceCount = componentInstances.get(componentName) || 0;
      const filePaths = componentFiles.get(componentName) || [];
      console.log(`${componentName}: ${instanceCount}`);
      csvContent += `${componentName},${instanceCount},"${filePaths.join(
        ", "
      )}"\n`;
    });

    // Write the CSV content to a file
    try {
      await fs.writeFile("component-metrics.csv", csvContent);
      console.log("Component metrics written to component-metrics.csv");
    } catch (err) {
      console.error("Error writing to file:", err);
    }
  }
);
