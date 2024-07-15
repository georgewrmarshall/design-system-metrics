const fs = require("fs").promises;
const glob = require("glob");
const path = require("path");

const rootFolder = "ui";
const ignoreFolder = path.join(rootFolder, "components", "component-library");

const components = new Set([
  // Add component names here
  "AvatarAccount",
  "AvatarBase",
  "AvatarFavicon",
  "AvatarIcon",
  "AvatarNetwork",
  "AvatarToken",
  "BadgeWrapper",
  "BannerAlert",
  "BannerBase",
  "BannerTip",
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
  "Input",
  "Label",
  "Modal",
  "ModalBody",
  "ModalContent",
  "ModalFocus",
  "ModalFooter",
  "ModalHeader",
  "ModalOverlay",
  "PickerNetwork",
  "Popover",
  "PopoverHeader",
  "SelectButton",
  "SelectOption",
  "SelectWrapper",
  "Tag",
  "TagUrl",
  "Text",
  "Textarea",
  "TextField",
  "TextFieldSearch",
]);

const componentInstances = new Map();

const processFile = async (filePath) => {
  try {
    // Read the file content
    const content = await fs.readFile(filePath, "utf8");

    // Regular expression to match the import statement from the component library
    const importRegex =
      /import\s+{([^}]*)}\s+from\s+['"][^'"]*\/component-library['"]/g;

    // Execute the regular expression to get the import statement
    const importMatch = importRegex.exec(content);

    // If the file imports anything from the component library
    if (importMatch) {
      // Parse the import statement to get a list of imported components
      const importedComponents = importMatch[1]
        .split(",")
        .map((name) => name.trim());

      console.log(`Processing file ${filePath}`);
      console.log(`Imported components: ${importedComponents}`);

      // Regular expression to match the JSX components used in the file
      const matches = content.match(/<([A-Z]\w*)(?=\s|\/|>)/g);

      console.log(`Matches: ${matches}`);

      // If any JSX components are used in the file
      if (matches) {
        // For each matched component
        matches.forEach((match) => {
          // Get the component name
          const componentName = match.substring(1);

          // If the component is in the list of components to count
          // and it's included in the import from the component library
          if (
            components.has(componentName) &&
            importedComponents.includes(componentName)
          ) {
            // Get the current count of the component
            const count = componentInstances.get(componentName) || 0;

            // Increment the count of the component
            componentInstances.set(componentName, count + 1);

            console.log(`Matched component: ${componentName}`);
            console.log(`Current count: ${count + 1}`);
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
    let csvContent = "Component,Instances\n";
    components.forEach((componentName) => {
      const instanceCount = componentInstances.get(componentName) || 0;
      console.log(`${componentName}: ${instanceCount}`);
      csvContent += `${componentName},${instanceCount}\n`;
    });

    // Write the CSV content to a file
    try {
      await fs.writeFile(
        "extension-component-adoption-metrics.csv",
        csvContent
      );
      console.log(
        "Component metrics written to extension-component-adoption-metrics.csv"
      );
    } catch (err) {
      console.error("Error writing to file:", err);
    }
  }
);
