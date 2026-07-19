export function formatPrice(amount: number, currency = "INR"): string {
  // Strip any non-alpha chars (e.g. "INR20000" → "INR") and fall back to INR
  const code = currency.replace(/[^A-Za-z]/g, "").toUpperCase() || "INR";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
