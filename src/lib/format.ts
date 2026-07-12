import type { Money } from "./commerce/types";

const formatters = new Map<string, Intl.NumberFormat>();

function formatterFor(currencyCode: string): Intl.NumberFormat {
  const cached = formatters.get(currencyCode);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  });
  formatters.set(currencyCode, formatter);
  return formatter;
}

export function formatMoney(money: Money): string {
  return formatterFor(money.currencyCode).format(Number(money.amount));
}
