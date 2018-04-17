import * as React from "react";

import { ITaxonomyPickerDemoProps } from "./ITaxonomyPickerDemoProps";
import styles from "./TaxonomyPickerDemo.module.scss";
import { TaxonomyPickerLoader } from "./TaxonomyPickerLoader";

export default class TaxonomyPickerDemo extends React.Component<ITaxonomyPickerDemoProps, {}> {
  public render(): React.ReactElement<ITaxonomyPickerDemoProps> {
    return (
      <div className={styles.taxonomyPickerDemo}>
        <TaxonomyPickerLoader
          label="Demo picker"
          termSetId={this.props.termSetId}
          siteUrl={this.props.siteUrl}
          itemLimit={1}
        />
      </div>
    );
  }
}
