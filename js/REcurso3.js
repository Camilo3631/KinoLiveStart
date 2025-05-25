
// ✅ Función para agregar
const addLikedMovie = (movie) => {
  const liked = JSON.parse(localStorage.getItem('likedMovie')) || {};
  liked[movie.id] = movie;
  localStorage.setItem('likedMovie', JSON.stringify(liked));
};

// ❌ Función para eliminar
const removeLikedMovie = (movieId) => {
  const liked = JSON.parse(localStorage.getItem('likedMovie')) || {};
  delete liked[movieId];
  localStorage.setItem('likedMovie', JSON.stringify(liked));
};

