export { cn } from "./cn";

export function formatCurrency(value: number, currency = "MXN") {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(value);
}
