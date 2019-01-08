import {
  ITaxonomyPickerProps,
  TaxonomyPicker
} from "@dlw-digitalworkplace/react-fabric-taxonomypicker";
import { Environment, EnvironmentType } from "@microsoft/sp-core-library";
import { SPComponentLoader } from "@microsoft/sp-loader";
import * as React from "react";

export interface ITaxonomyPickerLoaderProps extends ITaxonomyPickerProps {
}

export interface ITaxonomyPickerLoaderState {
  loadingScripts: boolean;
  errors?: string[];
}

export class TaxonomyPickerLoader extends React.Component<
  ITaxonomyPickerLoaderProps,
  ITaxonomyPickerLoaderState
> {
  constructor(props: ITaxonomyPickerLoaderProps) {
    super(props);

    this.state = {
      loadingScripts: true,
      errors: []
    };
  }

  public componentDidMount(): void {
    if (
      Environment.type === EnvironmentType.SharePoint ||
      Environment.type === EnvironmentType.ClassicSharePoint
    ) {
      this._loadSPJSOMScripts();
    } else {
      this.setState({
        loadingScripts: false,
        errors: [
          ...this.state.errors,
          // tslint:disable-next-line:max-line-length
          "You are on localhost mode (EnvironmentType.Local), be sure you disable termSetGuid and enable defaultOptions configuration in PropertyPaneTaxonomyPicker."
        ]
      });
    }
  }

  public render(): JSX.Element {
    return (
      <div>
        <TaxonomyPicker {...this.props} isLoading={this.state.loadingScripts} />
        {this.state.errors.length > 0 ? this.renderErrorMessage() : null}
      </div>
    );
  }

  private async _loadSPJSOMScripts(): Promise<any> {
    await new Promise((resolve, reject) => setTimeout(() => resolve(), 500));

    const siteColUrl: string = this.props.absoluteSiteUrl;

    try {
      SPComponentLoader.loadScript(siteColUrl + "/_layouts/15/init.js", {
        globalExportsName: "$_global_init"
      })
        .then(
          (): Promise<{}> => {
            return SPComponentLoader.loadScript(siteColUrl + "/_layouts/15/MicrosoftAjax.js", {
              globalExportsName: "Sys"
            });
          }
        )
        .then(
          (): Promise<{}> => {
            return SPComponentLoader.loadScript(siteColUrl + "/_layouts/15/SP.Runtime.js", {
              globalExportsName: "SP"
            });
          }
        )
        .then(
          (): Promise<{}> => {
            return SPComponentLoader.loadScript(siteColUrl + "/_layouts/15/SP.js", {
              globalExportsName: "SP"
            });
          }
        )
        .then(
          (): Promise<{}> => {
            return SPComponentLoader.loadScript(siteColUrl + "/_layouts/15/SP.taxonomy.js", {
              globalExportsName: "SP"
            });
          }
        )
        .then(
          (): void => {
            this.setState({ loadingScripts: false });
          }
        )
        .catch((reason: any) => {
          this.setState({ loadingScripts: false, errors: [...this.state.errors, reason] });
        });
    } catch (error) {
      this.setState({ loadingScripts: false, errors: [...this.state.errors, error] });
    }
  }

  private renderErrorMessage(): any {
    return <div>{this.state.errors}</div>;
  }
}
