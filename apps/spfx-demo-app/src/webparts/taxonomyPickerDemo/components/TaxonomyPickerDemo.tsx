import { ITerm } from "@dlw-digitalworkplace/react-fabric-taxonomypicker/lib/model/ITerm";
import * as React from "react";
import { ITaxonomyPickerDemoProps } from "./ITaxonomyPickerDemoProps";
import { ITaxonomyPickerDemoState } from "./ITaxonomyPickerDemoState";
import styles from "./TaxonomyPickerDemo.module.scss";
import { TaxonomyPickerLoader } from "./TaxonomyPickerLoader";

export default class TaxonomyPickerDemo extends React.Component<
  ITaxonomyPickerDemoProps,
  ITaxonomyPickerDemoState
> {
  constructor(props: ITaxonomyPickerDemoProps) {
    super(props);
    this.state = {
      selectedTerms: [],
    };
  }

  public render(): React.ReactElement<ITaxonomyPickerDemoProps> {
    return (
      <div className={styles.taxonomyPickerDemo}>
        <TaxonomyPickerLoader
          title="Select your demo data"
          absoluteSiteUrl={this.props.absoluteSiteUrl}
          label="Demo picker"
          termSetName={this.props.termSetName}
          termSetId={this.props.termSetId}
          rootTermId={this.props.rootTermId}
          itemLimit={this.props.itemLimit}
          allowAddTerms={false}
          lcid={this.props.lcid}
          showTranslatedLabels={this.props.showTranslatedLabels}
          hideDeprecatedTerms={this.props.hideDeprecatedTerms}
          selectedItems={this.state.selectedTerms}
          onChange={this._onChange}
        />
      </div>
    );
  }

  private _onChange = (newValue?: ITerm[]): void => {
    this.setState(
      {
        selectedTerms: newValue,
      },
      () => {
        console.dir(this.state.selectedTerms);
      }
    );
  };
}
