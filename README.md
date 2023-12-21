# component-tracking-script

A node.js script to generate a CSV of component adoption metrics.

### Get started

1. Drop this script in the root folder of the [MetaMask extension](https://github.com/MetaMask/metamask-extension)
2. Run

```
node ./component-tracking-script.js
```

3. A file called `component-metrics.csv` should appear in the root folder of the extension if there are no errors

### Requirements

- Does not count deprecated versions of the component e.g. `component-library/deprecated`
- Does not count duplicate named component e.g. `<Button` `from '../../ui/button'` vs `<Button` `from '../../component-library`
- Does not count components in JSDoc e.g. `@deprecated <Box /> is deprecated in favour of <Box />`
