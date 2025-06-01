 const textos = traducciones[idioma] || traducciones['es']; // fallback a españo



  
let visibleSectionBeforeDetail = null; // Para recordar la sección visible antes de entrar en detalles

// Delegación de clics en títulos (h4 y h5)
document.querySelectorAll('h4, h5').forEach(el => {
  el.style.cursor = 'pointer';
});

document.addEventListener('click', async (e) => {
  const titleElement = e.target;

  if (titleElement.tagName === 'H4' || titleElement.tagName === 'H5') {
    const movieCard = titleElement.closest('.movie-card');
    if (!movieCard) return;

    const movieTitleText = titleElement.textContent;

    // Guardar la sección visible antes de entrar al detalle
    if (!gridTendenciasSection.classList.contains('d-none')) {
      visibleSectionBeforeDetail = 'gridTendencias';
    } else if (!gridPopularesSection.classList.contains('d-none')) {
      visibleSectionBeforeDetail = 'gridPopulares';
    } else if (!gridProximamenteSection.classList.contains('d-none')) {
      visibleSectionBeforeDetail = 'gridProximamente';
    } else if (!categoryGridSection.classList.contains('d-none')) {
      visibleSectionBeforeDetail = 'category-grid-container';
    } else if (!searchSection.classList.contains('d-none')) {
      visibleSectionBeforeDetail = 'search-section';
    } else if ([...movieSliders].some(slider => !slider.classList.contains('d-none'))) {
      visibleSectionBeforeDetail = 'sliders';
    }

    // Buscar la película y mostrar detalles
    try {
      const searchRes = await api('movies/search', {
        params: {
          query: movieTitleText,
          language: 'es',
          include_adult: false
        }
      });

      if (searchRes.data.results.length > 0) {
        const movie = searchRes.data.results[0];
        getMovieDetailsById(movie.id);
      }

    } catch (error) {
      console.error('Error al buscar la película:', error);
    }
  }
});

// Función general para obtener los detalles de una película por ID
const getMovieDetailsById = async (id) => {
  currentMovieId = id; // Guardar ID globalmente para recarga
  const idioma = localStorage.getItem('idioma') || 'es';

  try {
    const movieRes = await api('movies/' + id, {
      params: { language: idioma }
    });

    showMovieDetail(movieRes.data);

  } catch (error) {
    console.error('Error al obtener detalles de la película:', error)
  }
};

// Mostrar detalles de la película
const showMovieDetail = async (movie) => {
  // Ocultar todas las secciones
  gridTendenciasSection.classList.add('d-none');
  gridPopularesSection.classList.add('d-none');
  gridProximamenteSection.classList.add('d-none');
  categoryGridSection.classList.add('d-none');
  searchSection.classList.add('d-none');
  movieSliders.forEach(slider => slider.classList.add('d-none'));
  bannerSection.classList.add('d-none');

  // Mostrar detalle
  movieDetailSection.classList.remove('d-none');

  // Mostrar info
  movieBackground.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  moviePoster.innerHTML = `<img data-src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">`;
  movieTitle.textContent = movie.title;
  movieDescription.textContent = movie.overview || 'Descripción no disponible.';
  movieReleaseDate.textContent = `Fecha de estreno: ${movie.release_date || 'N/A'}`;

  // Cargar géneros y recomendaciones
  await fetchGenresAndRecommendations(movie.id);

  // Llamar lazyLoader para imágenes
  lazyLoader();

  // Mostrar botones
  document.getElementById('go-back').classList.toggle('d-none', !visibleSectionBeforeDetail || visibleSectionBeforeDetail === 'sliders');
  document.getElementById('go-back-home').classList.toggle('d-none', visibleSectionBeforeDetail !== 'sliders');
};

// Función declarada correctamente para evitar hoisting error
async function fetchGenresAndRecommendations(id) {
  const idioma = localStorage.getItem('idioma') || 'es';
 /// const textos = traducciones[idioma] || traducciones['es'];

  const categoriesContainer = document.getElementById('movie-categories');
  const similaresContainer = document.getElementById('movie-similares');

  categoriesContainer.innerHTML = '';
  similaresContainer.innerHTML = '';

  try {
    const [detailRes, recommendationsRes] = await Promise.all([
      api.get(`movie/${id}`, { params: { language: idioma } }),
      api.get(`movie/${id}/recommendations`, { params: { language: idioma } })
    ]);

    const detailData = detailRes.data;
    const recommendationsData = recommendationsRes.data;

    // Géneros
    if (detailData.genres?.length) {
      categoriesContainer.innerHTML = '<h4>Categorías:</h4>';
      detailData.genres.forEach((genre) => {
        const btn = document.createElement('button');
        btn.textContent = genre.name;
        btn.className = 'btn btn-dark m-1';
        categoriesContainer.appendChild(btn);
      });
    }

    // Recomendaciones
    if (recommendationsData.results?.length) {
      const row = document.createElement('div');
      row.className = 'row justify-content-center';

      const titleCol = document.createElement('div');
      titleCol.className = 'col-12 text-center mb-4';
      titleCol.innerHTML = '<h4 class="fw-bold">Películas Recomendadas</h4>';
      row.appendChild(titleCol);

      const recomendaciones = recommendationsData.results.slice(0, 4);
      recomendaciones.forEach((rec) => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3 d-flex justify-content-center mb-4';

        const card = document.createElement('div');
        card.className = 'movie-card text-center p-2 shadow rounded';
        card.style.width = '100%';

        card.innerHTML = `
          <img data-src="https://image.tmdb.org/t/p/original${rec.poster_path}" alt="${rec.title}" class="img-fluid rounded mb-2" style="height: 300px; object-fit: cover;">
          <h5 class="text-truncate" title="${rec.title}">${rec.title}</h5>
        `;

        col.appendChild(card);
        row.appendChild(col);
      });

      similaresContainer.appendChild(row);

      // Lazy load
      lazyLoader();
    }

  } catch (error) {
    console.error('Error al obtener géneros o recomendaciones:', error);
  }
}

// Botón para volver a la sección anterior
goBackButton.addEventListener('click', () => {
  movieDetailSection.classList.add('d-none');

  switch (visibleSectionBeforeDetail) {
    case 'gridTendencias':
      gridTendenciasSection.classList.remove('d-none');
      break;
    case 'gridPopulares':
      gridPopularesSection.classList.remove('d-none');
      break;
    case 'gridProximamente':
      gridProximamenteSection.classList.remove('d-none');
      break;
    case 'category-grid-container':
      categoryGridSection.classList.remove('d-none');
      break;
    case 'search-section':
      searchSection.classList.remove('d-none');
      break;
  }

  resetDetailView();
});

// Botón para volver al home
document.getElementById('go-back-home').addEventListener('click', () => {
  movieDetailSection.classList.add('d-none');
  bannerSection.classList.remove('d-none');
  movieSliders.forEach(slider => slider.classList.remove('d-none'));

  resetDetailView();
});

// Reset de los detalles
const resetDetailView = () => {
  moviePoster.innerHTML = '';
  movieBackground.style.backgroundImage = '';
  document.getElementById('movie-categories').innerHTML = '';
  document.getElementById('movie-similares').innerHTML = '';
  visibleSectionBeforeDetail = null;
};
