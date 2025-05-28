  // Creamos una instancia de axios
  const api = axios.create({
    // Base URL
    baseURL: 'https://api.themoviedb.org/3/',
    // api_key como parámetro
    params: {
      'api_key': '030eada77e494e280d243a5356401f1a',
    },
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
  })
