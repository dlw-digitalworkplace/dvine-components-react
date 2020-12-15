import { css } from "@uifabric/utilities/lib";
import * as React from "react";
import { getClassName } from "../../utilities";
const styles = require("./TermAdder.module.scss");

export interface ITermAdderProps {
  addNewItemClick: () => void;
  labels?: ITermAdderLabels;
}

export interface ITermAdderLabels {
  label: string;
  description: string;
}

export const TermAdder: React.StatelessComponent<ITermAdderProps> = ({
  addNewItemClick,
  labels,
}: ITermAdderProps) => (
  <div className={css(getClassName("TaxonomyDialog-TermAdder"), styles.termAdder)}>
    <img
      src="/_layouts/images/EMMDoubleTag.png"
      alt=""
      data-themekey="#"
      className={css(getClassName("TreeView-TermAdder-Icon"), styles.termAdderIcon)}
    />
    <span
      className={css(getClassName("TreeView-TermAdder-Description"), styles.termAdderDescription)}
      id="addNewTermDescription"
    >
      {(labels && labels.description) || "New items are added under the currently selected item."}
      <span
        className={css(getClassName("TreeView-TermAdder-Label"), styles.termAdderLabel)}
        onClick={addNewItemClick}
      >
        {(labels && labels.label) || "Add New Item"}
      </span>
    </span>
  </div>
);
