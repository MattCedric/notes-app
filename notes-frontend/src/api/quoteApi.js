export const getQuote = async () => {
  const cached = sessionStorage.getItem('daily-quote');
  if (cached) return JSON.parse(cached);

  const res = await fetch('https://dummyjson.com/quotes/random');
  const data = await res.json();
  sessionStorage.setItem('daily-quote', JSON.stringify(data));
  return data;
};