export function unquoteString(str: string): string {
  if (/^'.*'$/.test(str) || /^".*"$/.test(str)) {
    return str.slice(1, -1);
  }

  return str;
}
