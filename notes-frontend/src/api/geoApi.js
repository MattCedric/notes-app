export const getLocation = async () => {
  const cached = sessionStorage.getItem('user-location');
  if (cached) return JSON.parse(cached);

  const res = await fetch('https://ipwho.is/');
  const data = await res.json();
  sessionStorage.setItem('user-location', JSON.stringify(data));
  return data;
};