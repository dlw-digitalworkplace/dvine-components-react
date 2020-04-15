declare interface ITaxonomyPickerDemoWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TermSetIdFieldLabel: string;
  TermSetNameFieldLabel: string;
  RootTermIdFieldLabel: string;
  ItemLimitFieldLabel: string;
  LcidFieldLabel: string;
  ShowTranslatedLabelsLabel: string;
  HideDeprecatedTermsLabel: string;
}

declare module "TaxonomyPickerDemoWebPartStrings" {
  const strings: ITaxonomyPickerDemoWebPartStrings;
  export = strings;
}
