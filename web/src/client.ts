enum RequestMethod {
  GET,
  POST,
  PATCH,
  DELETE
}

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

async function request<T>(path: string, method: RequestMethod, body: object | null = null): Promise<T> {
  try {
    if (!BASE_API_URL) {
      throw new Error('BASE_API_URL is not set')
    }

    if (!API_KEY) {
      throw new Error('API_KEY is not set')
    }

    const response = await fetch(`${BASE_API_URL}${path}/`, {
      method: RequestMethod[method],
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      ...(body && { body: JSON.stringify(body) })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Unknown error')
    }

    return response.json()
  } catch (error: unknown) {
    console.error(`Error in ${method} ${path}:`, error)
    throw new Error(error instanceof Error ? error.message : 'Unknown error')
  }
}

export async function get<T>(path: string): Promise<T> {
  return request(path, RequestMethod.GET)
}

export async function post<T>(path: string, body: object): Promise<T> {
  return request(path, RequestMethod.POST, body)
}
