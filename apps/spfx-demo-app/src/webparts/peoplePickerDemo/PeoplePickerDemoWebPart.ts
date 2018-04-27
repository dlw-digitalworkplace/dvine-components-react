import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
import * as strings from "PeoplePickerDemoWebPartStrings";
import * as React from "react";
import * as ReactDom from "react-dom";

import { IPeoplePickerDemoProps } from "./components/IPeoplePickerDemoProps";
import PeoplePickerDemo from "./components/PeoplePickerDemo";

export interface IPeoplePickerDemoWebPartProps {
  description: string;
}

export default class PeoplePickerDemoWebPart extends BaseClientSideWebPart<
  IPeoplePickerDemoWebPartProps
> {
  public async onInit(): Promise<void> {
    await super.onInit();

    sp.setup({
      spfxContext: this.context
    });
  }

  public render(): void {
    const element: React.ReactElement<IPeoplePickerDemoProps> = React.createElement(
      PeoplePickerDemo,
      {}
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
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
