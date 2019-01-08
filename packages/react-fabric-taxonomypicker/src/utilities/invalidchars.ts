
export function replaceIllegalCharacters(input: string): string {
    let inputNew: string = replaceAll(input, "\t", " ");
    inputNew = replaceAll(inputNew, ";", ",");
    inputNew = replaceAll(inputNew, "\"", "\uFF02");
    inputNew = replaceAll(inputNew, "<", "\uFF1C");
    inputNew = replaceAll(inputNew, ">", "\uFF1E");
    inputNew = replaceAll(inputNew, "&", "＆");
    return inputNew;
}

export function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, "g"), replace);
}