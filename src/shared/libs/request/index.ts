import axios from 'axios'
import axiosRetry from 'axios-retry'
import FormData from 'form-data'

interface RequestOptions {
  url: string
  method?: 'get' | 'post' | 'put' | 'delete'
  data?: any
  params?: any
  headers?: any
  retries?: number
  retryDelay?: number
  isFormData?: boolean
}

const request = async ({
  url,
  method = 'get',
  data,
  params,
  headers = {},
  retries = 0,
  retryDelay = 1000,
  isFormData = false
}: RequestOptions): Promise<axios.AxiosResponse<any, any>> => {
  // Настройка повторных попыток
  if (retries > 0) {
    axiosRetry(axios, {
      retries,
      retryDelay: (retryCount) => retryCount * retryDelay,
      retryCondition: (error) => !!error
    })
  }

  let body = data
  let finalHeaders = headers

  if (isFormData) {
    const form = new FormData()
    for (const key in data) {
      const value = data[key]

      if (value) {
        form.append(key, value)
      }
    }
    body = form
    finalHeaders = {
      ...headers,
      ...form.getHeaders()
    }
  }

  return await axios({
    method,
    headers: finalHeaders,
    url,
    data: body,
    params
  })
}

export { request }
