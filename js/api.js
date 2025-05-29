
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    'api_key': '030eada77e494e280d243a5356401f1a',
  },
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

export default api;
