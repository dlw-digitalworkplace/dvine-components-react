# delaware Digital Workplace React components
Common React components for use in SharePoint Framework projects which use the Office UI Fabric styling components.

Demo implementation can be found in [apps/spfx-demo-app](apps/spfx-demo-app)

# react-fabric-peoplepicker

A people picker which retrieves its data from the https://github.com/pnp/pnpjs library

## Usage
```typescript
import { PeoplePicker } from "@dlw-digitalworkplace/react-fabric-peoplepicker";
.
.
.
<PeoplePicker label="Demo picker" />
```

#	react-fabric-taxonomypicker

A taxonomy picker which provides the user with a hierarchical auto-complete box, as well as a treeview picker.
Currently supports:
- Autocomplete input box
- Multilingual support
- Create terms in open term set
- Custom sorting

## Usage
```typescript
import { TaxonomyPicker } from "@dlw-digitalworkplace/react-fabric-taxonomypicker";
.
.
.
<TaxonomyPicker
  title="Select your demo data"
  absoluteSiteUrl={this.props.absoluteSiteUrl}
  label="Demo picker"
  termSetId={this.props.termSetId}
  rootTermId={this.props.rootTermId}
  itemLimit={this.props.itemLimit}
  allowAddTerms={true}
  lcid={this.props.lcid}
  showTranslatedLabels={this.props.showTranslatedLabels}
  isLoading={false}
/>
```

# Contributing
Submitting pull requests is strongly encouraged 😃

This project uses [Rush](https://rushjs.io/) as a monorepo manager, which includes automatic changelog creation.
Therefore, before submitting the pull request, **run `rush version` on your code and commit the generated change file**.
