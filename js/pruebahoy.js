// Obtén las secciones y botones de manera global
let showMoreTendenciasButton = document.getElementById('show-more-tendencias');
let showLessTendenciasButton = document.getElementById('show-less-tendencias');
let bannerSection = document.getElementById('banner');
let popularesSection = document.getElementById('populares');
let proximamenteSection = document.getElementById('proximamente');
let categoryGridSection = document.getElementById('category-grid-container');
let gridTendenciasSection = document.getElementById('grid-tendencias');  // Asegúrate de que esta sea solo una vez
let movieSliders = document.querySelectorAll('.movie-slider');

// Función para mostrar el grid de tendencias y ocultar las demás secciones
const mostrarGridTendencias = () => {
  // Ocultamos las secciones y los sliders
  bannerSection.classList.add('d-none');
  popularesSection.classList.add('d-none');
  proximamenteSection.classList.add('d-none');
  categoryGridSection.classList.add('d-none');
  movieSliders.forEach(slider => slider.classList.add('d-none'));

  // Mostramos el grid de tendencias
  gridTendenciasSection.classList.remove('d-none');
  // Mostramos el botón de "Volver"
  showLessTendenciasButton.classList.remove('d-none');
};

// Función para mostrar las secciones originales y ocultar el grid de tendencias
const ocultarGridTendencias = () => {
  // Volvemos a mostrar las secciones
  bannerSection.classList.remove('d-none');
  popularesSection.classList.remove('d-none');
  proximamenteSection.classList.remove('d-none');
  categoryGridSection.classList.add('d-none');

  // Volvemos a mostrar todos los sliders de películas
  movieSliders.forEach(slider => slider.classList.remove('d-none'));

  // Ocultamos el grid de tendencias
  gridTendenciasSection.classList.add('d-none');
  // Ocultamos el botón de "Volver"
  showLessTendenciasButton.classList.add('d-none');
};

// Función para generar el grid de películas
const generarGridMoviesTendencias = () => {
  const apiUrlEs = 'https://api.themoviedb.org/3/trending/movie/week?api_key=030eada77e494e280d243a5356401f1a&language=es';
  const apiUrlEn = 'https://api.themoviedb.org/3/trending/movie/week?api_key=030eada77e494e280d243a5356401f1a&language=en-US';

  // Acción al hacer clic en "Ver más" para mostrar el grid
  showMoreTendenciasButton.addEventListener('click', async function () {
    // Mostrar el grid de tendencias
    mostrarGridTendencias();

    // Limpiamos el contenedor antes de llenarlo
    const moviesContainer = gridTendenciasSection.querySelector('.movies-container');
    moviesContainer.innerHTML = ''; // Limpiar cualquier contenido anterior

    try {
      let response = await fetch(apiUrlEs);
      let data = await response.json();

      // Si no se obtienen resultados en español, intentamos obtenerlos en inglés
      if (!data.results || data.results.length === 0) {
        response = await fetch(apiUrlEn);
        data = await response.json();
      }

      // Verificamos si la respuesta contiene películas
      if (data.results && data.results.length > 0) {
        data.results.slice(0, 20).forEach(movie => {
          const movieCard = document.createElement('div');
          movieCard.classList.add('movie-card'); // Aplicamos la clase movie-card-grid
          movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
            <h4>${movie.title}</h4>
          `;
          moviesContainer.appendChild(movieCard);
        });
      }
    } catch (error) {
      console.error('Error al obtener las películas:', error);
    }
  });

  // Acción al hacer clic en "Volver" para ocultar el grid y mostrar las secciones nuevamente
  showLessTendenciasButton.addEventListener('click', function () {
    // Volver a mostrar las secciones
    ocultarGridTendencias();
  });
};

// Llamamos a la función para generar el grid de películas
generarGridMoviesTendencias();
