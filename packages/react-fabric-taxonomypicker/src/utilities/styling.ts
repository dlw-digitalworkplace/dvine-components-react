const CLASSPREFIX = "dlw";

function getClassName(name?: string): string {
  if (!name) {
    return CLASSPREFIX;
  }

  return `${CLASSPREFIX}-${name}`;
}

export { getClassName };
