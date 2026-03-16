export function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);

    let videoId = "";

    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else {
      videoId = parsed.searchParams.get("v") ?? "";
    }

    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1`;
  } catch {
    return null;
  }
}

type MoneyFormatOptions = {
  locale?: string;
  currency?: string;
  fxRate?: number;
};

const DEFAULT_RATES_FROM_IDR: Record<string, number> = {
  IDR: 1,
  USD: 1 / 15600,
  SGD: 1 / 11600,
  MYR: 1 / 3300,
  JPY: 1 / 104,
  EUR: 1 / 17000,
};

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  ID: "IDR",
  US: "USD",
  SG: "SGD",
  MY: "MYR",
  JP: "JPY",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
};

export function resolveUserLocaleCurrency() {
  const locale =
    typeof navigator !== "undefined" && navigator.language
      ? navigator.language
      : "id-ID";

  const region = locale.split("-")[1]?.toUpperCase();
  const currency = (region && COUNTRY_TO_CURRENCY[region]) || "IDR";

  return { locale, currency };
}

export function formatMoneyFromIdr(amountInIdr: number, options: MoneyFormatOptions = {}) {
  const { locale: defaultLocale, currency: defaultCurrency } = resolveUserLocaleCurrency();
  const locale = options.locale || defaultLocale;
  const currency = options.currency || defaultCurrency;
  const rate = options.fxRate ?? DEFAULT_RATES_FROM_IDR[currency] ?? 1;

  const convertedAmount = amountInIdr * rate;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(convertedAmount);
}

export function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}