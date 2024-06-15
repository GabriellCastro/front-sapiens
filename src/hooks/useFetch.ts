import useSWR, { SWRConfiguration } from "swr";
import { api } from "../api";

export function useFetch<T>(url: string, options?: SWRConfiguration) {
  const { data, error, mutate, isValidating, isLoading } = useSWR<T>(
    url,
    async (newUrl: string) => {
      const response = await api.get(newUrl);
      return response.data;
    },
    options
  );

  return { data, error, mutate, isValidating, isLoading };
}
