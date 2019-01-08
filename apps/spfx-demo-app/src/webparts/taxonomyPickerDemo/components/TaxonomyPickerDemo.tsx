import * as React from "react";

import { ITaxonomyPickerDemoProps } from "./ITaxonomyPickerDemoProps";
import styles from "./TaxonomyPickerDemo.module.scss";
import { TaxonomyPickerLoader } from "./TaxonomyPickerLoader";

export default class TaxonomyPickerDemo extends React.Component<ITaxonomyPickerDemoProps, {}> {
  public render(): React.ReactElement<ITaxonomyPickerDemoProps> {
    return (
      <div className={styles.taxonomyPickerDemo}>
        <TaxonomyPickerLoader
          absoluteSiteUrl={this.props.absoluteSiteUrl}
          label="Demo picker"
          termSetId={this.props.termSetId}
          rootTermId={this.props.rootTermId}
          itemLimit={this.props.itemLimit}
          allowAddTerms={true}
          lcid={this.props.lcid}
          showTranslatedLabels={this.props.showTranslatedLabels}
        />
      </div>
    );
  }
}
