# **Design System Metrics**

A Node.js-based CLI tool to generate a CSV of component adoption metrics across multiple MetaMask codebases. This tool supports both the MetaMask Extension and MetaMask Mobile repositories and tracks component usage based on a provided configuration.

## **Getting Started**

- [Extension](#extension)
- [Mobile](#mobile)
- [CLI Options](#cli-options)
- [Requirements](#requirements)

---

### **Extension**

1. **Clone the [MetaMask Extension](https://github.com/MetaMask/metamask-extension)** repository if you haven’t already:

```bash
git clone https://github.com/MetaMask/metamask-extension.git
```

2. **Run the CLI tool from the `design-system-metrics` package:**

Navigate to the `design-system-metrics` package directory:

```bash
cd /path/to/design-system-metrics
```

3. **Run the CLI tool for the MetaMask Extension:**

```bash
yarn node index.js --project extension
```

4. A file called `extension-component-adoption-metrics.csv` will be generated in the current working directory if there are no errors.

---

### **Mobile**

1. **Clone the [MetaMask Mobile](https://github.com/MetaMask/metamask-mobile)** repository if you haven’t already:

```bash
git clone https://github.com/MetaMask/metamask-mobile.git
```

2. **Run the CLI tool from the `design-system-metrics` package:**

Navigate to the `design-system-metrics` package directory:

```bash
cd /path/to/design-system-metrics
```

3. **Run the CLI tool for the MetaMask Mobile project:**

```bash
yarn node index.js --project mobile
```

4. A file called `mobile-component-adoption-metrics.csv` will be generated in the current working directory if there are no errors.

---

### **CLI Options**

- **`--project` (Required)**: Specify the project to audit. Options are:

- `extension`: For MetaMask Extension
- `mobile`: For MetaMask Mobile

Example:

```bash
yarn node index.js --project extension
```

- **`--format` (Optional)**: Specify the output format. Options are `csv` (default) or `json`.

Example:

```bash
yarn node index.js --project extension --format json
```

- **Custom Configuration**: By default, the tool uses a `config.json` file to define the component list and ignore patterns. You can also pass a custom configuration file by adding the `--config` option:

```bash
yarn node index.js --project extension --config /path/to/custom-config.json
```

---

### **Requirements**

- The tool **ignores deprecated components** (e.g., `component-library/deprecated`).
- The tool **does not count duplicate components** when imported from different locations (e.g., `<Button` from `../../ui/button` versus `<Button` from `../../component-library`).
- Components **inside JSDoc comments** are not counted (e.g., `@deprecated <Box /> is deprecated in favour of <Box />`).

---

### **Example Output**

Upon running the CLI tool, a CSV file will be generated in the root of the repository (e.g., `extension-component-adoption-metrics.csv` or `mobile-component-adoption-metrics.csv`), listing the components and the number of instances where they are used.

---

### **Contributing**

If you wish to contribute to the tool, ensure you are running the latest version of **Yarn (v4.x)** and **Node.js**. You can make adjustments to the `config.json` file or update the CLI logic for tracking additional components or repositories.

---

### **License**

This project is licensed under the [MIT License](LICENSE).
