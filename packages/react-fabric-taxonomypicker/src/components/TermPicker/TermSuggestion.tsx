import { css } from "@uifabric/utilities/lib";
import * as React from "react";

import { ITerm } from "../../model/ITerm";
import { getClassName } from "../../utilities";

const styles = require("./TermPicker.module.scss");

export interface ITermSuggestionProps extends ITerm { }

export const TermSuggestion: React.StatelessComponent<ITermSuggestionProps> = ({
  id,
  name,
  defaultLabel,
  path
}: ITerm) => (
    <div className={css(getClassName("TermSuggestion"), styles.termSuggestion)}>
      <div>{defaultLabel ? defaultLabel : name}</div>
      <div className={css(getClassName("TermSuggestion-TermPath"), styles.termPath)}>{path}</div>
    </div>
  );
