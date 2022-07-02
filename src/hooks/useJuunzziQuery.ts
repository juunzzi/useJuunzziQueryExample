import { useEffect, useState } from "react";

const { setCacheData, getCacheData, caching } = (() => {
  const cacheStore: {
    [key: string]: any;
  } = {};

  return {
    setCacheData(key: string, response: any) {
      cacheStore[key] = response;
    },

    getCacheData(key: string) {
      return {
        cachedData: cacheStore[key],
        cacheHit: cacheStore[key] ?? false,
      };
    },

    async caching(key: string, fetcher: any) {
      const { cacheHit, cachedData } = getCacheData(key);
      if (cacheHit) {
        return cachedData;
      }

      if (!cacheHit) {
        const response = await fetcher();

        setCacheData(key, response);

        return response;
      }
    },
  };
})();

export const useJuunzziQuery = (key: string, fetcher: any, parent: string) => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await caching(key, fetcher);

        setResponse(response);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);

    fetch();

    return () => {};
  }, []);

  return {
    response,
    isLoading,
    error,
  };
};
