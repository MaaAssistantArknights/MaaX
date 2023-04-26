interface ApiServiceProvider {
  get: <T>(
    url: string,
    config?: import('axios').AxiosRequestConfig
  ) => Promise<T | Error>
}
