import { css } from "@uifabric/utilities/lib/css";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import * as React from "react";

import { getClassName } from "../../utilities";

const styles = require("./TreeView.module.scss");

export interface ITreeLabelProps {
  id: string;
  label: string;
  hasChildren?: boolean;
  isRootNode?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onToggleCollapse?: () => void;
}

export const TreeLabel: React.StatelessComponent<ITreeLabelProps> = ({
  label,
  hasChildren,
  isExpanded,
  isRootNode,
  isSelected,
  isSelectable = true,
  onClick,
  onDoubleClick,
  onToggleCollapse
}) => (
  <div
    className={css(getClassName("TreeView-NodeLabel"), styles.nodeLabel, {
      [styles.isSelected]: isSelected,
      [styles.isSelectable]: isSelectable
    })}
  >
    {hasChildren && (
      <Icon
        className={css(getClassName("TreeView-NodeLabel-ExpandIcon"), styles.expandIcon)}
        iconName={isExpanded ? "CaretSolid" : "CaretHollow"}
        onClick={onToggleCollapse}
      />
    )}
    <Icon
      className={css(getClassName("TreeView-NodeLabel-TagIcon"), styles.tagIcon)}
      iconName={isRootNode ? "DocumentSet" : isSelectable ? "Tag" : "SingleBookmark"}
    />
    <span
      className={css(getClassName("TreeView-NodeLabel-Text"), styles.labelText)}
      onClick={(isSelectable && onClick) || undefined}
      onDoubleClick={(isSelectable && onDoubleClick) || undefined}
    >
      {label}
    </span>
  </div>
);
