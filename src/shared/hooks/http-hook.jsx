import { useCallback, useState, useRef, useEffect } from "react";
import axios from "axios";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(async (method, url, data = null, headers) => {
    setIsLoading(true);
    const httpAbortCtrl = new AbortController();

    try {
      activeHttpRequests.current.push(httpAbortCtrl);
      const response = await axios({
        method,
        url,
        data,
        headers,
        signal: httpAbortCtrl.signal,
      });

      activeHttpRequests.current = activeHttpRequests.current.filter(
        (reqCtrl) => reqCtrl !== httpAbortCtrl
      );

      setIsLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response.data.message);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  useEffect(() => {
    return activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
  }, []);
  return { isLoading, error, sendRequest, errorHandler };
};
