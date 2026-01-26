import parse from 'html-react-parser';

export function decodeHtmlEntities(value: string) {
  return parse(value);
}
