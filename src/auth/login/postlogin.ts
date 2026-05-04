import axios from 'axios'

export async function postLogin(data: {
  email: string
  password: string
  role: string
}) {
  try {
    const response = await axios.get(`http://localhost:4000/${data.role}s`, {
      params: {
        email: data.email,
        password: data.password,
      },
    })
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    throw new Error('Login failed')
  }
}
