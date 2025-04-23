let visibleSectionBeforeDetail = null; // Para recordar qué sección estaba visible antes de entrar al detalle

// Detectar clic en títulos de película
document.addEventListener('click', async function (e) {
  const titleElement = e.target;

  if (titleElement.tagName === 'H4' || titleElement.tagName === 'H5') {
    const movieCard = titleElement.closest('.movie-card');
    if (!movieCard) return;

    const movieTitleText = titleElement.textContent;

    // Guardar la sección visible antes de entrar al detalle
    if (!gridTendenciasSection.classList.contains('d-none')) {
      visibleSectionBeforeDetail = 'gridTendencias';
    } else if (!gridPopularessSection.classList.contains('d-none')) {
      visibleSectionBeforeDetail = 'gridPopularess';
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
      const searchRes = await Api.get('search/movie', {
        params: {
          query: movieTitleText,
          language: 'es'
        }
      });

      if (searchRes.data.results.length > 0) {
        const movie = searchRes.data.results[0];

        // Llamar a la función que obtiene detalles de la película por ID
        getMovieDetailsById(movie.id);
      }

    } catch (err) {
      console.error('Error al buscar la película:', err);
    }
  }
});

// Función general para obtener los detalles de una película por ID
async function getMovieDetailsById(id) {
  try {
    // Hacer la solicitud a la API con el ID de la película
    const movieRes = await Api.get('movie/' + id, {
      params: { language: 'es' }
    });

    // Llamar a la función para mostrar los detalles de la película
    showMovieDetail(movieRes.data);  

  } catch (err) {
    console.error('Error al obtener detalles de la película:', err);
  }
}

// Mostrar detalles de la película
async function showMovieDetail(movie) {
  // Ocultar todas las secciones
  gridTendenciasSection.classList.add('d-none');
  gridPopularessSection.classList.add('d-none');
  gridProximamenteSection.classList.add('d-none');
  categoryGridSection.classList.add('d-none');
  searchSection.classList.add('d-none');
  movieSliders.forEach(slider => slider.classList.add('d-none'));
  bannerSection.classList.add('d-none');

  // Mostrar detalles
  movieDetailSection.classList.remove('d-none');

  // Mostrar info
  movieBackground.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  moviePoster.innerHTML = `<img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">`;
  movieTitle.textContent = movie.title;
  movieDescription.textContent = movie.overview || 'Descripción no disponible.';
  movieReleaseDate.textContent = `Fecha de estreno: ${movie.release_date || 'N/A'}`;

  // Mostrar géneros y similares
  await fetchGenresAndSimilar(movie.id);

  // Mostrar botón correspondiente
  document.getElementById('go-back').classList.toggle('d-none', !visibleSectionBeforeDetail || visibleSectionBeforeDetail === 'sliders');
  document.getElementById('go-back-home').classList.toggle('d-none', visibleSectionBeforeDetail !== 'sliders');
}

// Botón para volver a la sección anterior
goBackButton.addEventListener('click', () => {
  movieDetailSection.classList.add('d-none');

  switch (visibleSectionBeforeDetail) {
    case 'gridTendencias':
      gridTendenciasSection.classList.remove('d-none');
      break;
    case 'gridPopularess':
      gridPopularessSection.classList.remove('d-none');
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
function resetDetailView() {
  moviePoster.innerHTML = '';
  movieBackground.style.backgroundImage = '';
  document.getElementById('movie-categories').innerHTML = '';
  document.getElementById('movie-similares').innerHTML = '';
  visibleSectionBeforeDetail = null;
}

// Cargar géneros y similares
async function fetchGenresAndSimilar(movieId) {
  const categoriesContainer = document.getElementById('movie-categories');
  const similaresContainer = document.getElementById('movie-similares');

  categoriesContainer.innerHTML = '';
  similaresContainer.innerHTML = '';

  try {
    const [detailRes, similarRes] = await Promise.all([
      Api.get(`movie/${movieId}`, { params: { language: 'es' } }),
      Api.get(`movie/${movieId}/similar`, { params: { language: 'es' } })
    ]);

    const detailData = detailRes.data;
    const similarData = similarRes.data;

    // Categorías
    if (detailData.genres?.length) {
      categoriesContainer.innerHTML = '<h4>Categorías:</h4>';
      detailData.genres.forEach(genre => {
        const btn = document.createElement('button');
        btn.textContent = genre.name;
        btn.className = 'btn btn-dark m-1';
        categoriesContainer.appendChild(btn);
      });
    }

    // Películas similares
    if (similarData.results?.length) {
      const row = document.createElement('div');
      row.className = 'row justify-content-center';

      const titleCol = document.createElement('div');
      titleCol.className = 'col-12 text-center mb-4';
      titleCol.innerHTML = '<h4 class="fw-bold">Películas similares</h4>';
      row.appendChild(titleCol);

      const similaresOrdenados = similarData.results.slice(0, 4);

      similaresOrdenados.forEach(similar => {
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