// Pure TypeScript class-name merger (zero external dependencies required)
export function cn(...inputs: (string | number | boolean | undefined | null | (string | number | boolean | undefined | null)[])[]): string {
  return inputs
    .flat(Infinity)
    .filter(Boolean)
    .join(" ");
}
