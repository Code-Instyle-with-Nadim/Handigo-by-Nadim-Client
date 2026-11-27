export const SERVICE_CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const

export function isServiceCategory(value: string) {
  return (SERVICE_CATEGORIES as readonly string[]).includes(value)
}

export function isServiceMode(value: string) {
  return (SERVICE_MODES as readonly string[]).includes(value)
}
