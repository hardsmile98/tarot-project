import axios from 'axios'
import axiosRetry from 'axios-retry'

const request = async ({
  url,
  method = 'get',
  data,
  params,
  headers,
  proxyEnabled = true,
  retries = 0,
  retryDelay = 1000
}: {
  url: string
  method?: 'get' | 'post' | 'put' | 'delete'
  data?: any
  params?: any
  headers?: any
  proxyEnabled?: boolean
  retries?: number
  retryDelay?: number
}): Promise<axios.AxiosResponse<any, any>> => {
  if (retries > 0) {
    axiosRetry(axios, {
      retries,
      retryDelay: (retryCount) => retryCount * retryDelay,
      retryCondition: (error) => !!error
    })
  }

  return await axios({
    method,
    headers,
    url,
    data,
    params
  })
}

export { request }
