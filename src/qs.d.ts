declare module "qs" {
  export function parse(value: string): Record<string, unknown>
}
