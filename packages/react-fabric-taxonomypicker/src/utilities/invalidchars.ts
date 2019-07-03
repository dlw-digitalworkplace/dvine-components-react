
export function replaceIllegalCharacters(input: string): string {
  let inputNew: string = replaceAll(input, "\t", " ");
  inputNew = replaceAll(inputNew, ";", ",");
  inputNew = replaceAll(inputNew, "\"", "\uFF02");
  inputNew = replaceAll(inputNew, "<", "\uFF1C");
  inputNew = replaceAll(inputNew, ">", "\uFF1E");
  inputNew = replaceAll(inputNew, "&", "＆");
  inputNew = trimSpaces(inputNew);
  return inputNew;
}

export function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(find, "g"), replace);
}

export function trimSpaces(str: string) {
  return str.replace(/\s+/g, " ").trim();
}