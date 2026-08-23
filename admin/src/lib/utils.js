// Pure JavaScript class-name merger (zero external dependencies required)
export function cn(...inputs) {
  return inputs
    .flat(Infinity)
    .filter(Boolean)
    .join(" ");
}
