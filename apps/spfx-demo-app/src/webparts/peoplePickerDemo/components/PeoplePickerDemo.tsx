import { PeoplePicker } from "@dlw-digitalworkplace/react-fabric-peoplepicker";
import * as React from "react";

import { IPeoplePickerDemoProps } from "./IPeoplePickerDemoProps";
import styles from "./PeoplePickerDemo.module.scss";

export default class PeoplePickerDemo extends React.Component<IPeoplePickerDemoProps, {}> {
  public render(): React.ReactElement<IPeoplePickerDemoProps> {
    return (
      <div className={styles.peoplePickerDemo}>
        <PeoplePicker label="Demo picker" />
      </div>
    );
  }
}
