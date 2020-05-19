import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from "@microsoft/sp-webpart-base";
import * as React from "react";
import * as ReactDom from "react-dom";
import * as strings from "TaxonomyPickerDemoWebPartStrings";
import { ITaxonomyPickerDemoProps } from "./components/ITaxonomyPickerDemoProps";
import TaxonomyPickerDemo from "./components/TaxonomyPickerDemo";

export interface ITaxonomyPickerDemoWebPartProps {
  termSetId: string;
  termSetName: string;
  rootTermId: string;
  itemLimit: number;
  lcid: number;
  showTranslatedLabels: boolean;
  hideDeprecatedTerms: boolean;
  allowAddTerms: boolean;
  pathDelimiter?: string;
}

export default class TaxonomyPickerDemoWebPart extends BaseClientSideWebPart<
  ITaxonomyPickerDemoWebPartProps
> {
  public render(): void {
    const element: React.ReactElement<ITaxonomyPickerDemoProps> = React.createElement(
      TaxonomyPickerDemo,
      {
        absoluteSiteUrl: this.context.pageContext.site.absoluteUrl,
        termSetId: this.properties.termSetId,
        termSetName: this.properties.termSetName,
        rootTermId: this.properties.rootTermId,
        itemLimit: this.properties.itemLimit,
        lcid: this.properties.lcid,
        showTranslatedLabels: this.properties.showTranslatedLabels,
        hideDeprecatedTerms: this.properties.hideDeprecatedTerms,
        allowAddTerms: this.properties.allowAddTerms,
        pathDelimiter: this.properties.pathDelimiter,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("termSetId", {
                  label: strings.TermSetIdFieldLabel,
                }),
                PropertyPaneTextField("termSetName", {
                  label: strings.TermSetNameFieldLabel,
                }),
                PropertyPaneTextField("rootTermId", {
                  label: strings.RootTermIdFieldLabel,
                }),
                PropertyPaneTextField("itemLimit", {
                  label: strings.ItemLimitFieldLabel,
                }),
                PropertyPaneTextField("lcid", {
                  label: strings.LcidFieldLabel,
                }),
                PropertyPaneTextField("pathDelimiter", {
                  label: strings.PathDelimiterLabel,
                }),
                PropertyPaneToggle("showTranslatedLabels", {
                  label: strings.ShowTranslatedLabelsLabel,
                  checked: this.properties.showTranslatedLabels,
                }),
                PropertyPaneToggle("hideDeprecatedTerms", {
                  label: strings.HideDeprecatedTermsLabel,
                  checked: this.properties.hideDeprecatedTerms,
                }),
                PropertyPaneToggle("allowAddTerms", {
                  label: strings.AllowAddTermsLabel,
                  checked: this.properties.allowAddTerms,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
