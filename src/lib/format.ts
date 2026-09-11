export function formatCredits(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}
