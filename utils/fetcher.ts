export const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .catch((error) => {
      throw error;
    });
