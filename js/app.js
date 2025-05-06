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


const getMoviesProximmamente = async () => {
  // Buscar el contenedor donde se muestran las peliculas
  const movieContainer = document.querySelector('.movies-container-proximamente');
  if (!movieContainer) {
    console.error('No se encontró el contenedor de peliculas.');
    return;
  }

  // Limpiar cualquier contenido previo y agregar el skeleton de carga
  movieContainer.innerHTML = '';  // Limpiar cualquier contenido previo
  for (let i = 0; i < 6; i++) {  // Crear 6 skeletons para simular las 6 películas
    const loadingCard = document.createElement('div');
    loadingCard.classList.add('loading-card-slider');
    movieContainer.appendChild(loadingCard);
  }

  try {
    let { data } = await api('/movie/upcoming', { params: { language: 'es' } });

    // Si no hay resultados en Español, intenta obtener en inglés
    if (!data.results || data.results.length === 0) {
      ({ data } = await api('/movie/upcoming', { params: { language: 'en-US' } }));
    }

    const movies = data.results;   // Almacenar la respuesta las peliculas
    movieContainer.innerHTML = ''; // Limpiar cualquier contenido previo del contenedor

    // Mostrar las 6 primeras peliculas
    movies.slice(0, 6).forEach(movie => {  // Limitar a 6 peliculas
      const movieCard = document.createElement('div');  // Crear el contenedor de cada película
      movieCard.classList.add('movie-card'); // Agregar la clase 'movie-card'

      // Rellenar el contenedor con la imagen y título de la película
      movieCard.innerHTML = ` 
        <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
        <h5>${movie.title}</h5>
      `;

      // Agregar el evento de clic para actualizar el hash
      movieCard.addEventListener('click', () => {
        location.hash = '#movie' + movie.id;  // Actualiza el hash con el ID de la película
      });

      // Agregar la tarjeta de cada película al contenedor
      movieContainer.appendChild(movieCard);
    });

  } catch (error) {
    console.error('Ocurrió un problema:', error); // Si ocurrió un error mostrarlo en la consola
  }
};

getMoviesProximmamente();


const getPopularMovie = async () => {
  // Buscar el contenedor donde se muestran las peliculas
  const movieContainer = document.querySelector('.movies-container-pupular');
  if (!movieContainer) {
    console.error('No se encontró el contenedor de peliculas.');
    return;
  }

  // Limpiar cualquier contenido previo y agregar el skeleton de carga
  movieContainer.innerHTML = '';  // Limpiar cualquier contenido previo
  for (let i = 0; i < 6; i++) {  // Crear 6 skeletons para simular las 6 películas
    const loadingCard = document.createElement('div');
    loadingCard.classList.add('loading-card-slider');
    movieContainer.appendChild(loadingCard);
  }

  try {
    let { data } = await api('/movie/popular', { params: { language: 'es' } });

    // Si no hay resultados en Español, intenta obtener en inglés
    if (!data.results || data.results.length === 0) {
      ({ data } = await api('/movie/popular', { params: { language: 'en-US' } }));
    }

    const movies = data.results;   // Almacenar la respuesta las peliculas
    movieContainer.innerHTML = ''; // Limpiar cualquier contenido previo del contenedor

    // Mostrar las 6 primeras peliculas
    movies.slice(0, 6).forEach(movie => {  // Limitar a 6 peliculas
      const movieCard = document.createElement('div');  // Crear el contenedor de cada película
      movieCard.classList.add('movie-card'); // Agregar la clase 'movie-card'

      // Rellenar el contenedor con la imagen y título de la película
      movieCard.innerHTML = ` 
        <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
        <h5>${movie.title}</h5>
      `;

      // Agregar el evento de clic para actualizar el hash
      movieCard.addEventListener('click', () => {
        location.hash = '#movie' + movie.id;  // Actualiza el hash con el ID de la película
      });

      // Agregar la tarjeta de cada película al contenedor
      movieContainer.appendChild(movieCard);
    });

  } catch (error) {
    console.error('Ocurrió un problema:', error); // Si ocurrió un error mostrarlo en la consola
  }
};

getPopularMovie();




const getTredingMovies = async () => {
  // Buscar el contenedor donde se muestran las peliculas
  const movieContainer = document.querySelector('.movies-container-tedencias');
  if (!movieContainer) {
    console.error('No se encontró el contenedor de peliculas.');
    return;
  }

  // Limpiar cualquier contenido previo y agregar el skeleton de carga
  movieContainer.innerHTML = '';  // Limpiar cualquier contenido previo
  for (let i = 0; i < 6; i++) {  // Crear 6 skeletons para simular las 6 películas
    const loadingCard = document.createElement('div');
    loadingCard.classList.add('loading-card-slider');
    movieContainer.appendChild(loadingCard);
  }

  try {
    let { data } = await api('trending/movie/week', { params: { language: 'es' } });

    // Si no hay resultados en Español, intenta obtener en inglés
    if (!data.results || data.results.length === 0) {
      ({ data } = await api('trending/movie/week', { params: { language: 'en-US' } }));
    }

    const movies = data.results;   // Almacenar la respuesta las peliculas
    movieContainer.innerHTML = ''; // Limpiar cualquier contenido previo del contenedor

    // Mostrar las 6 primeras peliculas
    movies.slice(0, 6).forEach(movie => {  // Limitar a 6 peliculas
      const movieCard = document.createElement('div');  // Crear el contenedor de cada película
      movieCard.classList.add('movie-card'); // Agregar la clase 'movie-card'

      // Rellenar el contenedor con la imagen y título de la película
      movieCard.innerHTML = ` 
        <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
        <h5>${movie.title}</h5>
      `;

      // Agregar el evento de clic para actualizar el hash
      movieCard.addEventListener('click', () => {
        location.hash = '#movie' + movie.id;  // Actualiza el hash con el ID de la película
      });

      // Agregar la tarjeta de cada película al contenedor
      movieContainer.appendChild(movieCard);
    });

  } catch (error) {
    console.error('Ocurrió un problema:', error); // Si ocurrió un error mostrarlo en la consola
  }
};




// Función asíncrona para mostrar las categorías de las películas
const getCategoriesPreview = async () => {

  try {
    // Peticion a la API para la lista de generos Español
    const { data } = await api.get('genre/movie/list', { params: { language: 'es' } });

    if (!data || !data.genres) throw new Error('Error al obtener las categorías');

    const categoryList = document.getElementById('dynamicCategoriesList');
    categoryList.innerHTML = ''; // Limpia el contenido previo

    // Mostrar todas las categorías en dos filas sin contendor adicional
    data.genres.forEach(category => {
      const li = document.createElement('li');
      li.classList.add('category-item');
      li.innerHTML = `<a href="#" data-category-id="${category.id}" data-category-name="${category.name}">${category.name}</a>`;

      // Agregar el evento de click al actualizar el hash y llamar a la función de las películas de la categoría
      li.addEventListener('click', (event) => {
        event.preventDefault();  // Prevenir la acción por defecto del <a>

        const categoryId = category.id; // Usamos el id directamente de la categoría
        const categoryName = category.name; // Usamos el nombre directamente de la categoría

        // Mostramos el nombre y el ID de la categoría seleccionada en el log
        console.log(`Categoría seleccionada: ${category.name} (ID: ${categoryId})`);

        // Actualizar el hash con el formato deseado: #category=ID-NOMBRE
        window.location.hash = `category=${categoryId}-${categoryName}`;

        // Llamar a la función para mostrar películas de la categoría
        getMoviesCategory(categoryId);
      });


      categoryList.appendChild(li);

    });

  } catch (error) {
    console.error('Error', error);
  }
};

// Referencia los elemmentos del DOM
const menuToggle = document.getElementById('navbarDropdown');
const categoryList = document.getElementById('dynamicCategoriesList');

let hideTimeout;



// Función para mostrar el menú
const showMenu = () => {
  clearTimeout(hideTimeout);
  categoryList.classList.add('show-menu');
};


// Función para ocultar el menú después de un tiempo
const hideMenu = () => {
  hideTimeout = setTimeout(() => {
    categoryList.classList.remove('show-menu');
  }, 30000); // Se oculta después de 3 segundos sin interacción
};


// Mostrar/ocultar menú al hacer clic en el botón
menuToggle.addEventListener('click', (event) => {
  event.preventDefault();
  if (categoryList.classList.contains('show-menu')) {
    categoryList.classList.remove('show-menu');
  } else {
    showMenu();
  }

});


// Evitar que el menú se oculte mientras el mouse esté sobre él
categoryList.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
categoryList.addEventListener('mouseleave', hideMenu);

// Si el usuario hace clic fuera del menú, se oculta
document.addEventListener('click', (event) => {
  if (!menuToggle.contains(event.target) && !categoryList.contains(event.target)) {
    hideMenu();
  };

});
// Función para mostrar los skeletons antes de cargar las películas en la categoría
const mostrarSkeletoncategory = () => {
  const categoryGridSection = document.getElementById('category-grid-container');
  const moviesContainer = categoryGridSection.querySelector('.movies-grid-container-category');

  // Evita duplicar skeletons si ya existen
  if (moviesContainer.querySelector('.loading-card-grid')) return;

  for (let i = 0; i < 40; i++) {
    const skeleton = document.createElement('div');
    skeleton.classList.add('loading-card-grid');
    moviesContainer.appendChild(skeleton);
  }
};

// Función para ocultar los skeletons después de que las películas se carguen
const ocultarskeletoncategory = () => {
  const categoriesContainer = document.getElementById('category-grid-container');
  const moviesContainer = categoriesContainer.querySelector('.movies-grid-container-category');
  const skeletons = moviesContainer.querySelectorAll('.loading-card-grid');
  skeletons.forEach(skeleton => skeleton.remove());
};

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

    // Si el ID no está en el mapa, salimos silenciosamente
    if (!genereMap[id]) return;

    // Mostrar sección y skeletons
    const categoryGridSection = document.getElementById('category-grid-container');
    categoryGridSection.classList.remove('d-none');

    const moviesContainer = categoryGridSection.querySelector('.movies-grid-container-category');
    moviesContainer.innerHTML = '';
    mostrarSkeletoncategory();

    // Ocultar otras secciones
    bannerSection.classList.add('d-none');
    popularesSection.classList.add('d-none');
    tendenciasSection.classList.add('d-none');
    proximamenteSection.classList.add('d-none');
    movieSliders.forEach(slider => slider.classList.add('d-none'));

    // Función auxiliar para buscar por idioma
    const fetchByLanguage = async (lang) => {
      const response = await api('discover/movie', {
        params: {
          with_genres: id,
          with_original_language: lang,
        },
      });
      return response.data.results || [];
    };

    // Buscar películas en español e inglés al mismo tiempo
    const [pelisEs, pelisEN] = await Promise.all([
      fetchByLanguage('es'),
      fetchByLanguage('en'),
    ]);

    const allMovies = [...pelisEs, ...pelisEN];
    if (allMovies.length === 0) throw new Error('No se encontraron películas');

    // Cambiar título de la categoría
    const categoryTitle = document.querySelector('.grid-category-title');
    categoryTitle.textContent = `Películas por categoría: ${genereMap[id]}`;

    // Ocultar skeletons y mostrar películas
    ocultarskeletoncategory();
    moviesContainer.innerHTML = '';

    allMovies.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.innerHTML = ` 
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h5>${movie.title}</h5>
        <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank"></a>
      `;
      movieCard.addEventListener('click', () => {
        history.pushState(null, '', '#movie' + movie.id);
      });
      moviesContainer.appendChild(movieCard);
    });

    // Mostrar botón "Ver menos"
    const showLessCategoryGridButton = document.getElementById('show-less-category-grid');
    showLessCategoryGridButton.classList.remove('d-none');

    showLessCategoryGridButton.onclick = () => {
      bannerSection.classList.remove('d-none');
      popularesSection.classList.remove('d-none');
      proximamenteSection.classList.remove('d-none');
      categoryGridSection.classList.remove('d-none');
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

// Función asincrona para obetener la pelicula según su búsqueda
const getMoviesSearch = async (query) => {
    try {

      const { data } = await api('/search/movie', {
        params: { query }
      });

      const movies = data.results;
      const container = document.querySelector('#search-section .container');
      const title = document.querySelector('.search-title');

      // Limpiar el contenido anterior
      container.innerHTML = '';

      // Limpiar otros títulos si hay
      const gridTitle = document.querySelector('.gird-category-title');
      if (gridTitle) gridTitle.textContent = '';

      // Ocultar otras secciones
      if (categoryGridSection) categoryGridSection.classList.add('d-none');

      movies.forEach(movie => {
        if (!movie.poster_path) return;

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-card', 'mb-4');


        movieElement.innerHTML = `
        < img src = "https://image.tmdb.org/t/p/w500${movie.poster_path}" alt = "${movie.title}" class="img-fluid rounded" >
          <h5>${movie.title}</h5>
      `;

        // Asegúrate de que el evento esté en el movieElement
        movieElement.addEventListener('click', () => {
          history.pushState(null, '', '#movie' + movie.id);
        });


        container.appendChild(movieElement);
      });

      // Ocultar el home y demas secciones
      bannerSection.classList.add('d-none');
      tendenciasSection.classList.add('d-none');
      popularesSection.classList.add('d-none');
      proximamenteSection.classList.add('d-none');

      // Mostar la seccion de búsqueda
      searchSection.classList.remove('d-none');

      // Cambiamos el titulo de lo que buscamos
      title.textContent = decodeURIComponent(query);

      // Mostrar solo el botón de volver
      toggleButtonsVisibility('back');
    } catch (error) {
      console.error('Error al buscar películas:', error);
    }

  };

  // Función para la ocultación y visibilicación de secciones
  const mostrarSolo = (secction) => {
    // Ocultar todas las secction
    bannerSection.classList.add('d-none');
    tendenciasSection.classList.add('d-none');
    popularesSection.classList.add('d-none');
    proximamenteSection.classList.add('d-none');
    categoryGridSection.classList.add('d-none');

    // Mostrar la sección deseada
    secction.classList.remove('d-none');

  };

  // Función para ocultar o mostrar los botones según la seccion
  const toggleButtonsVisibility = (buttonType) => {
    const backBtn = document.getElementById('back-btn');
    const homeBtn = document.getElementById('home-btn');

    if (buttonType === 'back') {
      // Mostrar solo el botón de "Volver"
      backBtn.classList.remove('d-none');
      homeBtn.classList.add('d-none');
    } else if (buttonType === 'home') {
      // Mostrar solo el botón de "Volver al Home"
      backBtn.classList.add('d-none');
      homeBtn.classList.remove('d-none');
    }
  };

  // Función para el bóton de volver
  const volverBtn = document.getElementById('back-btn');
  volverBtn.addEventListener('click', () => {
    // Simula el clic del botón de atrás del navegador
    window.history.back(); // Retrocede la página sin borrar el contenido

  });

  // Función para "Volver al Home"
  const homeBtn = document.getElementById('home-btn');
  homeBtn.addEventListener('click', () => {
    // Mostrar todas las secciones del Home y ocultar la sección de búsqueda
    bannerSection.classList.remove('d-none');
    tendenciasSection.classList.remove('d-none');
    popularesSection.classList.remove('d-none');
    proximamenteSection.classList.remove('d-none');
    searchSection.classList.add('d-none'); // Ocultar la sección de búsqueda

    // Mostrar solo el botón de "Volver al Home"
    toggleButtonsVisibility('home');
  });


  let visibleSectionBeforeDetail = null; // Para recordar la seccion estaba visiible antes de entrar en datalles


  document.querySelectorAll('h4', 'h5').forEach(el => {
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
        visibleSectionBeforeDetail = 'gridTedencias';
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
        const searchRes = await api('search/movie', {
          params: {
            query: movieTitleText,
            language: 'es'
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

    try {
      const movieRes = await api('movie/' + id, {
        params: {
          language: 'es',
        }

      });

      showMovieDetail(movieRes.data);

    } catch (error) {
      console.error('Error al obtener detalles de la película:', error)
    }

  }

  //  Mostrar detalles de la película
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
        moviePoster.innerHTML = `<img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">`;
      movieTitle.textContent = movie.title;
      movieDescription.textContent = movie.overview || 'Descripción no disponible.';
      movieReleaseDate.textContent = `Fecha de estreno: ${movie.release_date || 'N/A'}`;

      // Llamar a la nueva función para géneros y recomendaciones
      await fetchGenresAndRecommendations(movie.id);


      // Mostrar botón correspondiente
      document.getElementById('go-back').classList.toggle('d-none', !visibleSectionBeforeDetail || visibleSectionBeforeDetail === 'sliders');
      document.getElementById('go-back-home').classList.toggle('d-none', visibleSectionBeforeDetail !== 'sliders');
    };


    // Botón para volver a la sección anterior
    goBackButton.addEventListener('click', () => {
      movieDetailSection.classList.add('d-none');

      switch (visibleSectionBeforeDetail) {

        case 'gridTedencias':
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
    })

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
          api(`movie/${id}`, { params: { language: 'es' } }),  // Usamos 'id' en lugar de 'movieId'
          api(`movie/${id}/recommendations`, { params: { language: 'es' } })  // También se cambia aquí a 'id'
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
          row.className = 'row jusitify-content-center';

          const titleCol = document.createElement('div');
          titleCol.className = 'col-12 text-center mb-4';
          titleCol.innerHTML = '<h4 class="fw-bold">Películas Recomendadas</h4>';
          row.appendChild(titleCol);

          const recomendacionesOrdenadas = recommendationsData.results.slice(0, 4);

          recomendacionesOrdenadas.forEach((rec) => {
            const col = document.createElement('div');
            col.className = 'col-6 col-md-3 d-flex justify-content-center mb-4';

            const card = document.createElement('div')
            card.className = 'movie-card text-center p-2 shadow ronunded';
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

      } catch (error) {
        console.error('Error al obtener géneros o recomendaciones:', error);
      }

    };


    // Variable para almacenar las películas ya mostradas
    let peliculasMostradasTendencias = [];

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

    // Función para mostrar los skeletons antes de cargar las películas
    const mostrarSkeletonstendecias = () => {
      const moviesContainer = gridTendenciasSection.querySelector('.movies-grid-container');
      for (let i = 0; i < 20; i++) { // Cambia 20 por el número deseado de skeletons
        const skeleton = document.createElement('div');
        skeleton.classList.add('loading-card-grid');
        moviesContainer.appendChild(skeleton);  // Añadir los skeletons al contenedor principal
      }
    };

    // Función para ocultar los skeletons después de que las películas se carguen
    const ocultarskeletontendecias = () => {
      const moviesContainer = gridTendenciasSection.querySelector('.movies-grid-container');
      const skeletons = moviesContainer.querySelectorAll('.loading-card-grid');
      skeletons.forEach(skeleton => skeleton.remove());  // Eliminar todos los skeletons
    };

    // Función para generar el grid de películas
    const generarGridMoviesTendencias = () => {
      // Añadir el evento solo una vez
      if (!showMoreTendenciasButton.dataset.eventAdded) {
        showMoreTendenciasButton.addEventListener('click', async function () {
          // Mostrar el grid de tendencias
          mostrarGridTendencias();

          // Mostrar skeletons antes de hacer la solicitud
          mostrarSkeletonstendecias();

          try {
            // Hacemos la petición de las películas
            let response = await api('trending/movie/week', { params: { language: 'es' } });

            // Si no se obtienen resultados en español, intentamos obtenerlos en inglés
            if (!response.data.results || response.data.results.length === 0) {
              response = await api('trending/movie/week', { params: { language: 'en-US' } });
            }

            // Verificamos si la respuesta contiene películas
            if (response.data.results && response.data.results.length > 0) {
              // Tomamos solo las 20 primeras películas que no estén ya mostradas
              const peliculasNuevas = response.data.results.filter(movie => !peliculasMostradasTendencias.includes(movie.id));

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

                // Añadimos la tarjeta de la película al contenedor
                const moviesContainer = gridTendenciasSection.querySelector('.movies-grid-container');
                moviesContainer.appendChild(movieCard);

                // Añadimos la película al arreglo de películas mostradas
                peliculasLimitadas.push(movie.id);
              });
            } else {
              console.warn('No se encontraron películas para mostrar.');
            }
          } catch (error) {
            console.error('Error al obtener películas de la API de tendencias:', error);
          }

          // Ocultar los skeletons después de cargar las películas
          ocultarskeletontendecias();
        });

        // Marcar que el evento ha sido agregado para evitar duplicación
        showMoreTendenciasButton.dataset.eventAdded = 'true';
      }

      // Acción al hacer clic en "Ver menos" para ocultar el grid de tendencias
      showLessTendenciasButton.addEventListener('click', ocultarGridTendencias);
    };

    // Llamamos a la función para generar el grid de películas
    generarGridMoviesTendencias();


    setTimeout(() => {
      const banner = document.getElementById('banner');
      banner.classList.remove('skeleton');
      banner.querySelector('.hero-container').classList.remove('d-none');
    }, 2000);


    // Variable para mostrar peliculas ya mostrada populares
    let peliculasMostradasPopulares = [];

    // Mostrar grid populares
    const mostrarGridPopulares = () => {
      // Ocultamos las secciónes y los sliders
      bannerSection.classList.add('d-none');
      tendenciasSection.classList.add('d-none');
      proximamenteSection.classList.add('d-none');
      categoryGridSection.classList.add('d-none');
      movieSliders.forEach(slider => slider.classList.add('d-none'));

      // Mostrar gridPopulares
      gridPopularesSection.classList.remove('d-none');

      // Mostramos el botón de "Volver"
      showlesspopulareButton.classList.remove('d-none');
    };

    // Ocultar grid Populares
    const ocultarGridPopulares = () => {
      // Volvemos a mostrar las secciones
      bannerSection.classList.remove('d-none');
      tendenciasSection.classList.remove('d-none')
      proximamenteSection.classList.remove('d-none')
      categoryGridSection.classList.add('d-none');

      // Volvemos a mostrar todos los sliders de películas
      movieSliders.forEach(slider => slider.classList.remove('d-none'));

      // Ocultamos el grid de Populares
      gridPopularesSection.classList.add('d-none');

      // Ocultamos el botón de "Volver"
      showlesspopulareButton.classList.add('d-none');

    };

    // Función para mostrar los skeletons antes de cargar las películas
    const mostrarSkeletonspopulares = () => {
      const moviesContainer = gridPopularesSection.querySelector('.movies-grid-container-popular');
      for (let i = 0; i < 20; i++) { // Cambia 20 por el número deseado de skeletons
        const skeleton = document.createElement('div');
        skeleton.classList.add('loading-card-grid');
        moviesContainer.appendChild(skeleton);  // Añadir los skeletons al contenedor principal
      }

    };

    // Función para ocultar los skeleton después de que las películas cargen 
    const ocultarSkeletonspopulares = () => {
      const moviesContainer = gridPopularesSection.querySelector('.movies-grid-container-popular');
      const skeletons = moviesContainer.querySelectorAll('.loading-card-grid');
      skeletons.forEach(skeleton => skeleton.remove());

    };

    // Función para generar el grid de películas
    const generarGridMoviesPopulares = () => {
      // Añadir el evento solo una vez
      if (!showmorepopularButton.dataset.eventAdded) {
        showmorepopularButton.addEventListener('click', async function () {
          // Mostrar grid populares
          mostrarGridPopulares();

          // Mostrar skeletons antes de hacer la solicitud
          mostrarSkeletonspopulares();

          try {
            // Hacemos la petición de películas
            let response = await api('/movie/popular', { params: { language: 'es' } });

            // Si no hay resultados en español, intentamos obetnerlos en inglés
            if (!response.data.results || response.data.results.length === 0) {
              response = await api('/movie/popular', { params: { language: 'en-US' } });
            }


            // Verificamos si la respuesta contiene películas
            if (response.data.results && response.data.results.length > 0) {
              // Tomamos solo las 20 primeras películas que no estén ya mostradas
              const peliculasNuevas = response.data.results.filter(movie => !peliculasMostradasPopulares.includes(movie.id));


              // Limitamos a 20 películas nuevas
              const peliculasLimitadas = peliculasNuevas.slice(0, 20);

              // Agregar películas limitadas al contenedor
              peliculasLimitadas.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');

                movieCard.innerHTML = ` 
                 <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
                 <h5>${movie.title}</h5>
                `;

                // Evita el scroll automático al cambiar el hash
                movieCard.addEventListener('click', () => {
                  history.pushState(null, '', '#movie' + movie.id);
                });

                // Añadimos la tarjeta de la película al contenedor
                const moviesContainer = gridPopularesSection.querySelector('.movies-grid-container-popular');
                moviesContainer.appendChild(movieCard);

                // 👉 Agregar el ID a la lista de ya mostradas
                peliculasMostradasPopulares.push(movie.id);
              });
            } else {
              console.warn('No se encontraron películas para mostrar.');
            }
          } catch (error) {
            console.error('Error al obtener películas de la API de populare:', error);

          }

          // Ocultar los skeletons después de cargar las películas
          ocultarSkeletonspopulares();
        });

        // Marcar que el evento ha sido agregado para evitar duplicación
        showmorepopularButton.dataset.eventAdded = 'true';
      }

      showlesspopulareButton.addEventListener('click', ocultarGridPopulares);

    };

    // Llamamos a la función para generar el grid de películas
    generarGridMoviesPopulares();

    // Variable para mostrar peliculas ya mostrada proximamente
    let peliculasMostradasProximamente = [];

    // Mostrar gridProximamente
    const mostrarGridProximamente = () => {
      // Ocultamos las secciónes y los sliders
      bannerSection.classList.add('d-none');
      tendenciasSection.classList.add('d-none');
      popularesSection.classList.add('d-none');
      categoryGridSection.classList.add('d-none');
      movieSliders.forEach(slider => slider.classList.add('d-none'));

      // Mostrar gridProximamente
      gridProximamenteSection.classList.remove('d-none')


      // Mostramos el botón de "Volver"
      showlessproximamenteButton.classList.remove('d-none');

    };


    // Ocultar grid Proximamente
    const ocultarProximamente = () => {
      // Volvemos a mostrar las secciones
      bannerSection.classList.remove('d-none');
      tendenciasSection.classList.remove('d-none');
      popularesSection.classList.remove('d-none');
      categoryGridSection.classList.add('d-none');

      // Volvemos a mostrar todos los sliders de películas
      movieSliders.forEach(slider => slider.classList.remove('d-none'));

      // Ocultamos el grid de Proximamente
      gridProximamenteSection.classList.add('d-none');

      // Ocultamos el botón de "Volver"
      showlessproximamenteButton.classList.add('d-none');

    };


    // Función para mostrar los skeletons antes de cargar las películas
    const mostrarSkeletonsproximamnete = () => {
      const moviesContainer = gridProximamenteSection.querySelector('.movies-grid-container-proximamente');
      for (let i = 0; i < 20; i++) { // Cambia 20 por el número deseado de skeletons
        const skeleton = document.createElement('div');
        skeleton.classList.add('loading-card-grid');
        moviesContainer.appendChild(skeleton);  // Añadir los skeletons al contenedor principal
      }

    };

    // Función para ocultar los skeleton después de que las películas cargen 
    const ocultarSkeletonproximamente = () => {
      const moviesContainer = gridProximamenteSection.querySelector('.movies-grid-container-proximamente');
      const skeletons = moviesContainer.querySelectorAll('.loading-card-grid');
      skeletons.forEach(skeleton => skeleton.remove());

    };


    // Función para generar el grid de películas
    const generarGridMovieProximamente = () => {
      // Añadir el evento solo una vez
      if (!showMoreProximamneteButton.dataset.eventAdded) {
        showMoreProximamneteButton.addEventListener('click', async function () {
          // Mostrar gridPorximamente
          mostrarGridProximamente();

          // Mostrar skeletons antes de hacer la solicitud
          mostrarSkeletonsproximamnete();

          try {
            // Hacemos la petición de películas 
            let response = await api('/movie/upcoming', { params: { language: 'es' } });

            // Si no hay resultados en español, intentamos obetnerlos en inglés
            if (!response.data.results && response.data.results.length === 0) {
              response = await api('/movie/upcoming', { params: { language: 'en-US' } });
            }

            // Verificamos si la respuesta contiene películas
            if (response.data.results && response.data.results.length > 0) {
              // Tomamos solo las 20 primeras películas que no estén ya mostradas
              const peliculasNuevas = response.data.results.filter(movie => !peliculasMostradasProximamente.includes(movie.id));



              // Limitamos a 20 películas nuevas
              const peliculasLimitadas = peliculasNuevas.slice(0, 20);

              // Agregar películas limitadas al contenedor
              peliculasLimitadas.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');

                movieCard.innerHTML = ` 
                  <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
               <h5>${movie.title}</h5>
              `;

                // Evita el scroll automático al cambiar el hash
                movieCard.addEventListener('click', () => {
                  history.pushState(null, '', '#movie' + movie.id)
                })

                // Añadimos la tarjeta de la película al contenedor
                const moviesContainer = gridProximamenteSection.querySelector('.movies-grid-container-proximamente');
                moviesContainer.appendChild(movieCard);

                // 👉 Agregar el ID a la lista de ya mostradas
                peliculasMostradasProximamente.push(movie.id);
              })
            } else {
              console.warn('No se encontraron películas para mostrar.');
            };
          } catch (error) {
            console.error('Error al obtener películas de la API de proximamente:', error);
          }

          // Ocultar los skeletons después de cargar las películas
          ocultarSkeletonproximamente();
        })

        // Marcar que el evento ha sido agregado para evitar duplicación
        showMoreProximamneteButton.dataset.eventAdded = 'true';
      }


      showlessproximamenteButton.addEventListener('click', ocultarProximamente);

    };


    // Llamamos a la función para generar el grid de películas
    generarGridMovieProximamente();

















