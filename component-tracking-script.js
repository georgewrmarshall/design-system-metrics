const fs = require("fs").promises;
const glob = require("glob");
const path = require("path");

const rootFolder = "ui";
const ignoreFolder = path.join(rootFolder, "components", "component-library");

const components = new Set([
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

const processFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const matches = content.match(/<([A-Z]\w*)(?=\s|\/|>)/g);
    console.log(`Processing file ${filePath}`);
    console.log(`Matches: ${matches}`);
    if (matches) {
      matches.forEach((match) => {
        const componentName = match.substring(1);
        if (components.has(componentName)) {
          const count = componentInstances.get(componentName) || 0;
          componentInstances.set(componentName, count + 1);
          console.log(`Matched component: ${componentName}`);
          console.log(`Current count: ${count + 1}`);
        } else {
          console.log(`Component not in list: ${componentName}`);
        }
      });
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
    components.forEach((componentName) => {
      const instanceCount = componentInstances.get(componentName) || 0;
      console.log(`${componentName}: ${instanceCount} instances`);
    });
  }
);
