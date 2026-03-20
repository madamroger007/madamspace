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

export function resolveUserLocaleCurrency() {
  return { locale: "id-ID", currency: "IDR" };
}

export function formatMoneyFromIdr(amountInIdr: number, options: MoneyFormatOptions = {}) {
  const locale = options.locale || "id-ID";
  const currency = "IDR";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountInIdr);
}

export function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}