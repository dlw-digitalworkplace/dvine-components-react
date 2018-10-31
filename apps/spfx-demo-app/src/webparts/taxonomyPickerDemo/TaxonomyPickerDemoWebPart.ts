import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";
import * as React from "react";
import * as ReactDom from "react-dom";
import * as strings from "TaxonomyPickerDemoWebPartStrings";

import { ITaxonomyPickerDemoProps } from "./components/ITaxonomyPickerDemoProps";
import TaxonomyPickerDemo from "./components/TaxonomyPickerDemo";

export interface ITaxonomyPickerDemoWebPartProps {
  termSetId: string;
  rootTermId: string;
  itemLimit: number;
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
        rootTermId: this.properties.rootTermId,
        itemLimit: this.properties.itemLimit
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
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("termSetId", {
                  label: strings.TermSetIdFieldLabel
                }),
                PropertyPaneTextField("rootTermId", {
                  label: strings.RootTermIdFieldLabel
                }),
                PropertyPaneTextField("itemLimit", {
                  label: strings.ItemLimitFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
