# delaware Digital Workplace React components
Common React components for use in SharePoint Framework projects which use the Office UI Fabric styling components.

Demo implementation can be found in [apps/spfx-demo-app](apps/spfx-demo-app)

Submitting pull requests is strongly encouraged 😃. Make sure to read the **[Contribution guidelines](#contributing)**

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
 1. Fork the repository to your local GitHub
 2. Clone the code
 3. Create a new branch for your hotfix or feature
 4. Run `npm install` in the root of the project to install all the dependencies
 5. Run `npm run build` to build the code
 6. Run `npm run start:nb` to run the sample app and test the components in the workbench
 7. Make the code changes
 8. Stage and commit your changes in the local branch
 9. Run `rush change` to generate the cange file
 10. Stage and commit the generated change file 
 11. Push all the changes to the remote branch
 12. Merge the branch created in step 3 to the master branch of your git repo
 13. Make sure the master branch builds (`npm run build`)
 14. Create a pull request to get your changes in the @dlw-digitalworkplace package
 
 
   
 
