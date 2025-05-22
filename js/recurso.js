// Variable para recordar qué sección estaba visible antes de ver los detalles
let visibleSectionBeforeDetail = null;

// Detectar clics en títulos de película
document.addEventListener('click', async function (e) {
  const titleElement = e.target;

  if (titleElement.tagName === 'H4' || titleElement.tagName === 'H5') {
    const movieCard = titleElement.closest('.movie-card');
    if (!movieCard) return;

    const movieTitleText = titleElement.textContent;

    // Guardar la sección visible antes de entrar al detalle
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
        showMovieDetail(movie);
      }
    } catch (err) {
      console.error('Error al buscar la película:', err);
    }
  }
});

// Mostrar detalles de película
async function showMovieDetail(movie) {
  // Ocultar todas las secciones
  gridTendenciasSection.classList.add('d-none');
  gridPopularessSection.classList.add('d-none');
  gridProximamenteSection.classList.add('d-none');
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

      // Ordenar similares por fecha (más reciente primero)
      const similaresOrdenados = similarData.results.slice(0, 4); // Mostrar los primeros 4 sin ordenar

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

/// Recuroso nuevo por si algo jejeje




// Funci´pn category



let totalPeliculasCargadasCategory = 0;
const limitePeliculasCAtegory = 80;
let peliculasMostradasCategory = [];


// Función para obtener películas por categoría
const getMoviesCategory = async (id) => {
  try {
    const genereMap = {
      28: 'Acción',
      12: 'Aventura',
      16: 'Animación',
      35: 'Comedia',
      80: 'Fantasía',
      99: 'Documental',
      18: 'Drama',
      10751: 'Familiar',
      14: 'Fantasia',
      36: 'Historia',
      27: 'Terror',
      10402: 'Música',
      9648: 'Misterio',
      10749: 'Romance',
      878: 'Ciencia ficción',
      10770: 'Película de tv',
      53: 'Suspenso',
      10752: 'Bélica',
      37: 'Western',
    };

    if (!genereMap[id]) return;

    const categoryGridSection = document.getElementById('category-grid-container');
    categoryGridSection.classList.remove('d-none');

    const moviesContainer = categoryGridSection.querySelector('.movies-grid-container-category');
    moviesContainer.innerHTML = '';
    mostrarSkeletoncategory();

    bannerSection.classList.add('d-none');
    popularesSection.classList.add('d-none');
    tendenciasSection.classList.add('d-none');
    proximamenteSection.classList.add('d-none');
    movieSliders.forEach(slider => slider.classList.add('d-none'));

    const fetchByLanguage = async (lang) => {
      const response = await api('discover/movie', {
        params: {
          with_genres: id,
          with_original_language: lang,
        },
      });
      return response.data.results || [];
    };

    const [pelisEs, pelisEN] = await Promise.all([
      fetchByLanguage('es'),
      fetchByLanguage('en'),
    ]);

    const allMoviesRaw = [...pelisEs, ...pelisEN];

    // Eliminar duplicados por ID
    const uniqueMoviesMap = new Map();
    allMoviesRaw.forEach(movie => {
      if (!uniqueMoviesMap.has(movie.id)) {
        uniqueMoviesMap.set(movie.id, movie);
      }
    });

    const allMovies = Array.from(uniqueMoviesMap.values());
    if (allMovies.length === 0) throw new Error('No se encontraron películas');

    const categoryTitle = document.querySelector('.grid-category-title');
    categoryTitle.textContent = `Películas por categoría ${genereMap[id]}`;

    ocultarskeletoncategory();
    moviesContainer.innerHTML = '';

    // Limitar cuántas películas se muestran
    const peliculasParaMostrar = allMovies.slice(0, limitePeliculasCAtegory);
    peliculasMostradasCategory = []; // Reiniciamos si es necesario

    peliculasParaMostrar.forEach(movie => {
      const imgElement = document.createElement('img');
      imgElement.classList.add('img-fluid', 'rounded');
      imgElement.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
      imgElement.onerror = () => {
        imgElement.setAttribute('src', 'img/Brak OBRAZU.png');
      };

      const movieTitle = document.createElement('h5');
      movieTitle.textContent = movie.title;

      const movieLink = document.createElement('a');
      movieLink.href = `https://www.themoviedb.org/movie/${movie.id}`;
      movieLink.target = '_blank';

      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.appendChild(imgElement);
      movieCard.appendChild(movieTitle);
      movieCard.appendChild(movieLink);

      movieCard.addEventListener('click', () => {
        history.pushState(null, '', '#movie' + movie.id);
      });

      moviesContainer.appendChild(movieCard);
      peliculasMostradasCategory.push(movie);
    });

    totalPeliculasCargadasCategory = peliculasMostradasCategory.length;

    createObserver();

    const showLessCategoryGridButton = document.getElementById('show-less-category-grid');
    showLessCategoryGridButton.classList.remove('d-none');

    showLessCategoryGridButton.onclick = () => {
      bannerSection.classList.remove('d-none');
      tendenciasSection.classList.remove('d-none');
      proximamenteSection.classList.remove('d-none');
      categoryGridSection.classList.add('d-none');
      movieSliders.forEach(slider => slider.classList.remove('d-none'));
      showLessCategoryGridButton.classList.add('d-none');
      location.hash = '';
    };

  } catch (error) {
    console.error('Error al cargar películas por categoría:', error);
    ocultarskeletoncategory();

    const categoryGridSection = document.getElementById('category-grid-container');
    const moviesContainer = categoryGridSection.querySelector('.movies-grid-container-category');
    moviesContainer.innerHTML = '';
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-mensage');
    errorMessage.textContent = 'Lo siento, no pudimos cargar las películas en este momento';
    moviesContainer.appendChild(errorMessage);
  }
};

const getPaginatedMoviesByCategory = (id) => {
  let page = 2;
  const maxPages = 6;
  const seenMovieIds = new Set();
  let isLoading = false;
  let scrollActivo = false;
  const limitePeliculasCategory = 80;
  let totalPeliculasCargadasCategory = 0;

  const genereMap = {
    28: 'Acción',
    12: 'Aventura',
    16: 'Animación',
    35: 'Comedia',
    80: 'Fantasía',
    99: 'Documental',
    18: 'Drama',
    10751: 'Familiar',
    14: 'Fantasia',
    36: 'Historia',
    27: 'Terror',
    10402: 'Música',
    9648: 'Misterio',
    10749: 'Romance',
    878: 'Ciencia ficción',
    10770: 'Película de tv',
    53: 'Suspenso',
    10752: 'Bélica',
    37: 'Western',
  };

  if (!genereMap[id]) return;

  const cargarMasPeliculas = async () => {
    if (isLoading || totalPeliculasCargadasCategory >= limitePeliculasCategory || page > maxPages) return;
    isLoading = true;

    mostrarSkeletoncategory(); // Muestra skeletons antes de cargar

    try {
      const [pelisEs, pelisEN] = await Promise.all([
        api('discover/movie', {
          params: {
            with_genres: id,
            with_original_language: 'es',
            page,
          },
        }).then(res => res.data.results || []),

        api('discover/movie', {
          params: {
            with_genres: id,
            with_original_language: 'en',
            page,
          },
        }).then(res => res.data.results || []),
      ]);

      page++;

      const nuevasPeliculas = [...pelisEs, ...pelisEN].filter(movie => !seenMovieIds.has(movie.id));
      nuevasPeliculas.forEach(movie => seenMovieIds.add(movie.id));

      const peliculasDisponibles = nuevasPeliculas.slice(0, limitePeliculasCategory - totalPeliculasCargadasCategory);

      const moviesContainer = document.querySelector('.movies-grid-container-category');
      ocultarskeletoncategory();

      peliculasDisponibles.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.onerror = () => {
          img.src = 'img/Brak OBRAZU.png';
        };

        const title = document.createElement('h5');
        title.textContent = movie.title;

        const link = document.createElement('a');
        link.href = `https://www.themoviedb.org/movie/${movie.id}`;
        link.target = '_blank';

        movieCard.appendChild(img);
        movieCard.appendChild(title);
        movieCard.appendChild(link);

        movieCard.addEventListener('click', () => {
          history.pushState(null, '', '#movie' + movie.id);
        });

        moviesContainer.appendChild(movieCard);
      });

      totalPeliculasCargadasCategory += peliculasDisponibles.length;
      createObserver();
    } catch (error) {
      console.error('Error cargando películas por categoría:', error);
    } finally {
      isLoading = false;
    }
  };

  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 150) {
      cargarMasPeliculas();
    }
  };

  // Asegurarse de no duplicar eventos
  if (!scrollActivo) {
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll);
    scrollActivo = true;
  }

  // Primera carga
  cargarMasPeliculas();
};

