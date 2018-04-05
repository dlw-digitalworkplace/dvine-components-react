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
          termSetId={"69446c7e-44e4-428b-a7da-907000f48ce2"}
          siteUrl={this.props.siteUrl}
          itemLimit={1}
        />
      </div>
    );
  }
}
