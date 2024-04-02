const fs = require("fs").promises;
const glob = require("glob");
const path = require("path");

const rootFolder = "app";
const ignoreFolder = path.join(rootFolder, "component-library");

const components = new Set([
  // Add component names here
  "Accordion",
  "Avatar",
  "AvatarAccount",
  "AvatarBase",
  "AvatarFavicon",
  "AvatarGroup",
  "AvatarIcon",
  "AvatarNetwork",
  "AvatarToken",
  "Badge",
  "BadgeBase",
  "BadgeNetwork",
  "BadgeStatus",
  "BadgeWrapper",
  "Banner",
  "BannerAlert",
  "BannerBase",
  "BannerTip",
  "BottomSheet",
  "BottomSheetFooter",
  "BottomSheetHeader",
  "Button",
  "ButtonBase",
  "ButtonIcon",
  "ButtonLink",
  "ButtonPrimary",
  "ButtonSecondary",
  "Card",
  "Cell",
  "CellBase",
  "CellDisplay",
  "CellMultiSelect",
  "CellSelect",
  "Checkbox",
  "Header",
  "HelpText",
  "Icon",
  "Input",
  "Label",
  "ListItem",
  "ListItemColumn",
  "ModalConfirmation",
  "ModalMadatory",
  "MultiSelectItem",
  "Overlay",
  "PickerAccount",
  "PickerBase",
  "PickerNetwork",
  "SelectItem",
  "SheetBottom",
  "SheetHeader",
  "TabBar",
  "TabBarItem",
  "Tag",
  "TagUrl",
  "Text",
  "TextField",
  "TextFieldSearch",
  "TextWithPrefixIcon",
  "Toast",
]);

const componentInstances = new Map();
const componentFiles = new Map();

const processFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const importRegex =
      /import\s+((?:[^,\s]+)(?:,\s*{[^}]+})?|[^,\s]+,)\s+from\s+['"][^'"]*component-library[^'"]*['"]/gs;
    let importMatch;
    const importedComponents = [];

    // Match all import statements from the component library
    while ((importMatch = importRegex.exec(content)) !== null) {
      // Parse each import statement to get the imported components
      const imports = importMatch[1]
        ? importMatch[1]
            .split(",")
            .map((importName) => importName.trim().split(" ")[0])
        : [importMatch[2]];
      imports.forEach((importName) => {
        importedComponents.push(importName);
      });
    }

    console.log(`Processing file ${filePath}`);
    console.log(`Imported components: ${importedComponents}`);

    const matches = content.match(/<([A-Z]\w*)(?=\s|\/|>)/g);

    console.log(`Matches: ${matches}`);

    if (matches) {
      matches.forEach((match) => {
        const componentName = match.substring(1);
        // Check if the component is in the list of components to count
        // and if it's included in any import from the component library
        if (
          components.has(componentName) &&
          importedComponents.includes(componentName)
        ) {
          const count = componentInstances.get(componentName) || 0;
          componentInstances.set(componentName, count + 1);

          const files = componentFiles.get(componentName) || [];
          files.push(filePath);
          componentFiles.set(componentName, files);

          console.log(`Matched component: ${componentName}`);
          console.log(`Current count: ${count + 1}`);
        }
      });
    }
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
  }
};

glob(
  `${rootFolder}/components/**/*.{js,tsx}`,
  {
    ignore: [
      `${ignoreFolder}/**`,
      `${rootFolder}/components/**/*.test.{js,tsx}`,
    ],
  },
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
      await fs.writeFile("component-adoption-metrics.csv", csvContent);
      console.log(
        "Component metrics written to component-adoption-metrics.csv"
      );
    } catch (err) {
      console.error("Error writing to file:", err);
    }
  }
);
