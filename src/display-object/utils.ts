export function getNumber(value: any, defaultValue = 0) {
  return isNaN(+value) ? defaultValue : +value;
}
