const movieDetailSection = document.getElementById('movieDetail');
const movieBackground = document.getElementById('movie-background');
const moviePoster = document.getElementById('movie-poster');
const movieTitle = document.getElementById('movie-title');
const movieDescription = document.getElementById('movie-description');
const movieReleaseDate = document.getElementById('movie-release-date');
const goBackButton = document.getElementById('go-back');

// Secciones para mostrar y ocultar (grids y sliders)
const bannerSection = document.getElementById('banner');
let gridTendenciasSection = document.getElementById('grid-tendencias');
const gridPopularessSection = document.getElementById('grid-populares');
const gridProximamenteSection = document.getElementById('grid-proximamente');
const movieSliders = document.querySelectorAll('.movie-slider');

// Variable para recordar qué sección estaba visible antes de ver los detalles
let visibleSectionBeforeDetail = null;

// Detectar clics en títulos de película (h4 o h5)
document.addEventListener('click', async function (e) {
  const titleElement = e.target;

  if (titleElement.tagName === 'H5' || titleElement.tagName === 'H4') {
    const movieCard = titleElement.closest('.movie-card');
    
    if (!movieCard) {
      console.warn('No se encontró la tarjeta de película.');
      return;
    }

    const movieTitleText = titleElement.textContent;

    // Guardar qué sección estaba visible antes de mostrar los detalles
    if (!visibleSectionBeforeDetail) {
      if (!gridTendenciasSection.classList.contains('d-none')) {
        visibleSectionBeforeDetail = 'gridTendencias';
      } else if (!gridPopularessSection.classList.contains('d-none')) {
        visibleSectionBeforeDetail = 'gridPopularess';
      } else if (!gridProximamenteSection.classList.contains('d-none')) {
        visibleSectionBeforeDetail = 'gridProximamente';
      } else if ([...movieSliders].some(slider => !slider.classList.contains('d-none'))) {
        visibleSectionBeforeDetail = 'sliders';
      }
    }

    // Buscar ID de la película por nombre
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=030eada77e494e280d243a5356401f1a&query=${encodeURIComponent(movieTitleText)}&language=es`;
    try {
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (searchData.results && searchData.results.length > 0) {
        const movie = searchData.results[0];
        showMovieDetail(movie);
      } else {
        console.warn('No se encontró la película en la búsqueda.');
      }
    } catch (err) {
      console.error('Error al buscar la película:', err);
    }
  }
});

// Función para mostrar detalles
async function showMovieDetail(movie) {
  // Ocultar secciones principales
  gridTendenciasSection.classList.add('d-none');
  gridPopularessSection.classList.add('d-none');
  gridProximamenteSection.classList.add('d-none');
  movieSliders.forEach(slider => slider.classList.add('d-none'));

  // Ocultar el banner
  bannerSection.classList.add('d-none');

  // Mostrar sección de detalles
  movieDetailSection.classList.remove('d-none');

  // Mostrar fondo y póster
  movieBackground.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  moviePoster.innerHTML = `<img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">`;

  // Título, descripción, fecha
  movieTitle.textContent = movie.title;
  movieDescription.textContent = movie.overview || 'Descripción no disponible.';
  movieReleaseDate.textContent = `Fecha de estreno: ${movie.release_date || 'N/A'}`;

  // Mostrar géneros y similares
  await fetchGenresAndSimilar(movie.id);
}

// Volver atrás
goBackButton.addEventListener('click', () => {
  movieDetailSection.classList.add('d-none');

  if (visibleSectionBeforeDetail === 'gridTendencias') {
    gridTendenciasSection.classList.remove('d-none');
  } else if (visibleSectionBeforeDetail === 'gridPopularess') {
    gridPopularessSection.classList.remove('d-none');
  } else if (visibleSectionBeforeDetail === 'gridProximamente') {
    gridProximamenteSection.classList.remove('d-none');
  } else if (visibleSectionBeforeDetail === 'sliders') {
    movieSliders.forEach(slider => slider.classList.remove('d-none'));
  }

  moviePoster.innerHTML = '';
  movieBackground.style.backgroundImage = '';
  document.getElementById('movie-categories').innerHTML = '';
  document.getElementById('movie-similares').innerHTML = '';

  visibleSectionBeforeDetail = null;
});

// Función para mostrar géneros y similares
async function fetchGenresAndSimilar(movieId) {
  const categoriesContainer = document.getElementById('movie-categories');
  const similaresContainer = document.getElementById('movie-similares');

  categoriesContainer.innerHTML = '';
  similaresContainer.innerHTML = '';

  try {
    const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=030eada77e494e280d243a5356401f1a&language=es`;
    const similarUrl = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=030eada77e494e280d243a5356401f1a&language=es`;

    const [detailRes, similarRes] = await Promise.all([
      fetch(detailUrl),
      fetch(similarUrl)
    ]);

    const detailData = await detailRes.json();
    const similarData = await similarRes.json();

    // Mostrar categorías
    if (detailData.genres && detailData.genres.length > 0) {
      categoriesContainer.innerHTML = '<h4>Categorías:</h4>';
      detailData.genres.forEach(genre => {
        const btn = document.createElement('button');
        btn.textContent = genre.name;
        btn.className = 'btn btn-outline-m-1';
        categoriesContainer.appendChild(btn);
      });
    }

    // Mostrar similares
    if (similarData.results && similarData.results.length > 0) {
      const row = document.createElement('div');
      row.className = 'row justify-content-center';

      const titleCol = document.createElement('div');
      titleCol.className = 'col-12 text-center mb-4';
      titleCol.innerHTML = '<h4 class="fw-bold">Películas similares</h4>';
      row.appendChild(titleCol);

      similarData.results.slice(0, 4).forEach(similar => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3 d-flex justify-content-center mb-4';

        const card = document.createElement('div');
        card.className = 'movie-card text-center p-2 shadow rounded';
        card.style.width = '100%';

        card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/original${similar.poster_path}" alt="${similar.title}" class="img-fluid rounded mb-2" style="height: 300px; object-fit: cover;">
          <h5 class="text-truncate" title="${similar.title}">${similar.title}</h5>
        `;

        col.appendChild(card);
        row.appendChild(col);
      });

      similaresContainer.appendChild(row);
    }

  } catch (err) {
    console.error('Error al obtener géneros o similares:', err);
  }
}


// Obtén las secciones y botones de manera global
let showMoreTendenciasButton = document.getElementById('show-more-tendencias');
let showLessTendenciasButton = document.getElementById('show-less-tendencias');
let popularesSection = document.getElementById('populares');
let proximamenteSection = document.getElementById('proximamente');
let categoryGridSection = document.getElementById('category-grid-container');

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
