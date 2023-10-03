const fs = require("fs");
const glob = require("glob");

const rootFolder = "ui";
const ignoreFolder = "ui/components/component-library";
const componentLibraryImportRegex =
  /import {([\s\S]*?)} from ['"](\.{2,}\/component-library)['"];/g;

const components = [
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
  "Button",
  "ButtonBase",
  "ButtonIcon",
  "ButtonLink",
  "ButtonPrimary",
  "ButtonSecondary",
  "FormTextField",
  "HeaderBase",
  "HelpText",
  "Icon",
  "Input",
  "Label",
  "Modal",
  "ModalContent",
  "ModalHeader",
  "ModalOverlay",
  "PickerNetwork",
  "Tag",
  "TagUrl",
  "Text",
  "TextField",
  "TextFieldSearch",
];

const componentInstances = {};

const processFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const matches = content.match(/<(\w+)/g);

  if (matches) {
    matches.forEach((match) => {
      const componentName = match.substring(1);
      if (components.includes(componentName)) {
        componentInstances[componentName] =
          (componentInstances[componentName] || 0) + 1;
      }
    });
  }
};

glob(`${rootFolder}/**/*.js`, { ignore: [ignoreFolder] }, (err, files) => {
  if (err) {
    console.error("Error reading files:", err);
    return;
  }

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");
    const importMatches = [...content.matchAll(componentLibraryImportRegex)];

    if (importMatches.length > 0) {
      processFile(file);
    }
  });

  console.log("Component Adoption Metrics:");
  components.forEach((componentName) => {
    const instanceCount = componentInstances[componentName] || 0;
    console.log(`${componentName}: ${instanceCount} instances`);
  });
});
