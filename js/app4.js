// Instancia axios ya definida
const Api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: '030eada77e494e280d243a5356401f1a',
  },
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

async function bannerDinamicoTMDb(bannerSelector, intervalMs = 15000) {
  const bannerSection = document.querySelector('#banner');
  const heroContainer = bannerSection.querySelector('.hero-container');
  if (!heroContainer) {
    console.error('No se encontró .hero-container');
    return;
  }
  const p = heroContainer.querySelector('p');
  // No obtenemos ni manipulamos los botones
  // const btnWatch = heroContainer.querySelector('.btn-danger');
  // const btnDetails = heroContainer.querySelector('.btn-light');

 
  const idioma = localStorage.getItem('idioma') || 'es';

  try {
    const resMovies = await Api.get('trending/movie/week', { params: { language: idioma } });
    const movies = resMovies.data.results;
    if (!movies.length) {
      p.textContent = 'No se encontraron películas trending.';
      return;
    }

    bannerSection.classList.remove('skeleton');
    heroContainer.classList.remove('d-none');

    let i = 0;

    async function mostrar() {
      const movie = movies[i];

      // Cambiar imagen de fondo
      bannerSection.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path})`;

      // Solo mostramos la descripción (sin trailers ni botones)
      p.textContent = movie.overview || "No hay descripción disponible";

      i = (i + 1) % movies.length;
    }

    await mostrar();
    setInterval(mostrar, intervalMs);

  } catch (error) {
    console.error('Error al obtener películas trending:', error);
    p.textContent = 'Error al cargar películas trending.';
  }
}

bannerDinamicoTMDb();
