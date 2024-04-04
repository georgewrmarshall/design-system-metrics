# component-tracking-scripts

A node.js script to generate a CSV of component adoption metrics.

## Get started

- [Extension](#extension)
- [Mobile](#mobile)

### Extension

1. Drop the `extension-adoption-metrics-script.js` script in the root folder of the [MetaMask extension](https://github.com/MetaMask/metamask-extension)
2. Run

```
node ./extension-adoption-metrics-script.js
```

3. A file called `extension-component-adoption-metrics.csv` should appear in the root folder of the extension if there are no errors

### Mobile

1. Drop the `mobile-adoption-metrics-script.js` script in the root folder of the [MetaMask Mobile](https://github.com/MetaMask/metamask-mobile)
2. Run

```
node ./mobile-adoption-metrics-script.js
```

3. A file called `mobile-component-adoption-metrics.csv` should appear in the root folder of the mobile app if there are no errors

### Requirements

- Does not count deprecated versions of the component e.g. `component-library/deprecated`
- Does not count duplicate named component e.g. `<Button` `from '../../ui/button'` vs `<Button` `from '../../component-library`
- Does not count components in JSDoc e.g. `@deprecated <Box /> is deprecated in favour of <Box />`
