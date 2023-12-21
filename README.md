# component-tracking-script

A node.js script to track component adoption metrics

### Requirements

- Does not count deprecated versions of the component e.g. `component-library/deprecated`
- Does not count duplicate named component e.g. `<Button` `from '../../ui/button'` vs `<Button` `from '../../component-library`
- Does not count components in JSDoc e.g. `@deprecated <Box /> is deprecated in favour of <Box />`
