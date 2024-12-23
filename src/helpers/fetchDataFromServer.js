
const authUrl = 'http://localhost:3001/api/auth'
const protectedUrl = 'http://localhost:3001/api'

const fetchDataFromServer = async (endpoint, method, body = null) => {
    const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
    }
    
  try {
    const response = await fetch(`${authUrl}${endpoint}`, options)
    if (!response.ok) {
      throw new Error('Something went wrong')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching data', error)
  }
}

export default fetchDataFromServer