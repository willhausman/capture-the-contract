import { useCallback, useMemo } from 'react';

export const useApi = () => {
  const getFullUrl = useCallback(partial => ['api/', partial].reduce((base, part) => (new URL(part, base).href)), []);

  const headers = useMemo(() => ({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }), []);

  const httpRequest = useCallback(async (endpoint, options) => {
    const response = await fetch(getFullUrl(endpoint), options);
    if (!response.ok) {
      throw Error(await response.text());
    }
    return response.json();
  }, [getFullUrl]);

  const get = useCallback(endpoint => httpRequest(endpoint, { method: 'GET', headers }), [httpRequest, headers]);
  const post = useCallback((endpoint, payload?) => httpRequest(endpoint, { method: 'POST', headers, body: { ...payload } }), [httpRequest, headers]);

  return { get, post };
};
