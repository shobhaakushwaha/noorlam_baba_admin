export const formatCount = (num) => {
  if (num == null) return 0;

  const n = Number(num);

  if (n < 1000) return n;

  if (n < 1_000_000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";

  if (n < 1_000_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";

  return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
};
