export const fetchLyrics = async (songId: number) => {
    const response = await fetch(`/api/fetchLyrics?songId=${songId}`);
    const data = await response.json();
    return data;
  };
  
  export const searchGenius = async (query: string) => {
    const response = await fetch(`/api/searchGenius?q=${query}`);
    const data = await response.json();
    return data.hits;
  };
  