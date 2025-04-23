// Creamos una istancia de axios
const Api = axios.create({
  // BaseURL
  baseURL: 'https://api.themoviedb.org/3/',
  // api_key como párametro
  params: {
    'api_key': '030eada77e494e280d243a5356401f1a',
  },
  Headers: {
    'Content-Type': 'application/json; charset=utf-8',
  }
});

let visibleSectionBeforeDetail = null; // Para recordar qué sección estaba visible antes de entrar al detalle

// Aplicar el cursor de la mano solo a los títulos
document.querySelectorAll('h4, h5').forEach(el => {
  el.style.cursor = 'pointer';  // Aplicamos el cursor solo a los h4 y h5
});

// Detectar clic en títulos de película (h4, h5)
document.addEventListener('click', async (e) => {
  const titleElement = e.target;

  // Verificar que se hizo clic en un título h4 o h5
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
        getMovieDetailsById(movie.id);
      }

    } catch (err) {
      console.error('Error al buscar la película:', err);
    }
  }
});

// Función general para obtener los detalles de una película por ID
const getMovieDetailsById = async (id) => {
  try {
    const movieRes = await Api.get('movie/' + id, {
      params: { language: 'es' }
    });

    showMovieDetail(movieRes.data);

  } catch (err) {
    console.error('Error al obtener detalles de la película:', err);
  }
}

// Mostrar detalles de la película
const showMovieDetail = async (movie) => {
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

    // Llamar a la nueva función para géneros y recomendaciones
    await fetchGenresAndRecommendations(movie.id);


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
const resetDetailView = () => {
  moviePoster.innerHTML = '';
  movieBackground.style.backgroundImage = '';
  document.getElementById('movie-categories').innerHTML = '';
  document.getElementById('movie-similares').innerHTML = '';
  visibleSectionBeforeDetail = null;
}

// Cargar géneros y recomendaciones
const fetchGenresAndRecommendations = async (id) => {
  const categoriesContainer = document.getElementById('movie-categories');
  const similaresContainer = document.getElementById('movie-similares');

  categoriesContainer.innerHTML = '';
  similaresContainer.innerHTML = '';

  try {
    const [detailRes, recommendationsRes] = await Promise.all([
      Api.get(`movie/${id}`, { params: { language: 'es' } }),  // Usamos 'id' en lugar de 'movieId'
      Api.get(`movie/${id}/recommendations`, { params: { language: 'es' } })  // También se cambia aquí a 'id'
    ]);

    const detailData = detailRes.data;
    const recommendationsData = recommendationsRes.data;

    // Categorías
    if (detailData.genres?.length) {
      categoriesContainer.innerHTML = '<h4>Categorías:</h4>';
      detailData.genres.forEach((genre) => {
        const btn = document.createElement('button');
        btn.textContent = genre.name;
        btn.className = 'btn btn-dark m-1';
        categoriesContainer.appendChild(btn);
      });
    }

    // Películas recomendadas
    if (recommendationsData.results?.length) {
      const row = document.createElement('div');
      row.className = 'row justify-content-center';

      const titleCol = document.createElement('div');
      titleCol.className = 'col-12 text-center mb-4';
      titleCol.innerHTML = '<h4 class="fw-bold">Películas Recomendadas</h4>';
      row.appendChild(titleCol);

      const recomendacionesOrdenadas = recommendationsData.results.slice(0, 4); // Solo las primeras 4 recomendaciones

      recomendacionesOrdenadas.forEach((rec) => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3 d-flex justify-content-center mb-4';

        const card = document.createElement('div');
        card.className = 'movie-card text-center p-2 shadow rounded';
        card.style.width = '100%';

        card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/original${rec.poster_path}" alt="${rec.title}" class="img-fluid rounded mb-2" style="height: 300px; object-fit: cover;">
          <h5 class="text-truncate" title="${rec.title}">${rec.title}</h5>
        `;

        col.appendChild(card);
        row.appendChild(col);
      });

      similaresContainer.appendChild(row);
    }
  } catch (err) {
    console.error('Error al obtener géneros o recomendaciones:', err);
  }
}



// Variable para almacenar las películas ya mostradas
let peliculasMostradas = [];

// Mostrar el grid de tendencias
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

// Ocultar el grid de tendencias
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
  // Añadir el evento solo una vez
  if (!showMoreTendenciasButton.dataset.eventAdded) {
    showMoreTendenciasButton.addEventListener('click', async function () {
      // Mostrar el grid de tendencias
      mostrarGridTendencias();

      // Limpiamos el contenedor antes de llenarlo
      const moviesContainer = gridTendenciasSection.querySelector('.movies-container');

      try {
        // Hacemos la petición de las películas
        let response = await Api.get('trending/movie/week', { params: { language: 'es' } });

        // Si no se obtienen resultados en español, intentamos obtenerlos en inglés
        if (!response.data.results || response.data.results.length === 0) {
          response = await Api.get('trending/movie/week', { params: { language: 'en-US' } });
        }

        // Verificamos si la respuesta contiene películas
        if (response.data.results && response.data.results.length > 0) {
          // Tomamos solo las 20 primeras películas que no estén ya mostradas
          const peliculasNuevas = response.data.results.filter(movie => !peliculasMostradas.includes(movie.id));

          // Limitamos a 20 películas nuevas
          const peliculasLimitadas = peliculasNuevas.slice(0, 20);

          // Agregar películas limitadas al contenedor
          peliculasLimitadas.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card'); // Aplicamos la clase movie-card-grid


            movieCard.innerHTML = `
              <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
              <h5>${movie.title}</h5>
            `;


            // Evita el scroll automático al cambiar el hash
            movieCard.addEventListener('click', () => {
              history.pushState(null, '', '#movie' + movie.id);
            });


            moviesContainer.appendChild(movieCard);

            // Añadimos la película al arreglo de películas mostradas
            peliculasMostradas.push(movie.id);
          });
        } else {
          console.warn('No se encontraron películas para mostrar.');
        }
      } catch (error) {
        console.error('Error al obtener películas de la API de tendencias:', error);
      }
    });

    // Marcar que el evento ha sido agregado para evitar duplicación
    showMoreTendenciasButton.dataset.eventAdded = 'true';
  }

  // Acción al hacer clic en "Ver menos" para ocultar el grid de tendencias
  showLessTendenciasButton.addEventListener('click', ocultarGridTendencias);
};

// Llamamos a la función para generar el grid de películas
generarGridMoviesTendencias();
