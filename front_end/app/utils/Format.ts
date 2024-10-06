// Format a number
const fnb = (value: number): string => {
  if (value === 0) {
    return '0';
  } else if (value < 1_000) {
    return value.toString();
  } else if (value < 1_000_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else if (value < 1_000_000_000) {
    return (value / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'm';
  } else {
    return (value / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + 'b';
  }
};
export { fnb };
