export const trim = (string: string, character: string) => {
  if (character.length !== 1) {
    throw new Error('character must be single character');
  }

  let start = 0, end = string.length;

  while (start < end && string[start] === character)
    ++start;

  while (end > start && string[end - 1] === character)
    --end;

  return (start > 0 || end < string.length) ? string.substring(start, end) : string;
}