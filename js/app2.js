const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});



const addLikedMovie = (movie) => {
  const liked = JSON.parse(localStorage.getItem('likedMovies')) || {};
  liked[movie.id] = movie;
  localStorage.setItem('likedMovies', JSON.stringify(liked));
  getLikedMovies();  // Actualiza la UI inmediatamente
};

const removeLikedMovie = (movieId) => {
  const liked = JSON.parse(localStorage.getItem('likedMovies')) || {};
  delete liked[movieId];
  localStorage.setItem('likedMovies', JSON.stringify(liked));
  getLikedMovies();  // Actualiza la UI inmediatamente
};


// Función para obtener todas las películas favoritas
const likedMoviesList = () => {
  return JSON.parse(localStorage.getItem('likedMovies')) || {};
};


// Función para lazy loading (Carga peresosa
const lazyLoader = () => {
  // Selecciónamos todas las imágenes
  const img = document.querySelectorAll('img[data-src]');
  // Configuración del IntersectionObserver
  const options = {
    rootMargin: '300px', // Define un margen para el trigger antes de que la imagen entre al viewport
    threshold: 0.1,  // Cuando el 10% de la imagen esté visible, se activará el callback
  };
  // Callback que se ejecuta cuando la imágen entra en el área visible
  const callback = (entries, observer) => {
    entries.forEach(entry => {
      // Si la imagen esta visible
      if (entry.isIntersecting) {
        const img = entry.target;
        const dataSrc = img.dataset.src;  // Obtiene el data-src


        // Carga la imágen y elimina el data-src
        if (dataSrc) {
          img.src = dataSrc;
          img.removeAttribute('data-src');
        }
        // Deja de observar la imágen
        observer.unobserve(img)


      }
    })
  }

  // Crea  y comeinza a obeservar las imágenes
  const observer = new IntersectionObserver(callback, options);

  img.forEach(image => observer.observe(image));

};

const getMoviesProximmamente = async () => {

  const idioma = localStorage.getItem('idioma') || 'es';

  const movieContainer = document.querySelector('.movies-container-proximamente');
  if (!movieContainer) {
    console.error('No se encontró el contenedor de peliculas.');
    return;
  }

  // Mostrar skeletons
  movieContainer.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const loadingCard = document.createElement('div');
    loadingCard.classList.add('loading-card-slider');
    movieContainer.appendChild(loadingCard);
  }


  try {
    let { data } = await api('/movies/upcoming', { params: { language: idioma } });
    if (!data.results || data.results.length === 0) {
      ({ data } = await api('/movies/upcoming', { params: { language: 'en-US' } }));
    }

    const movies = data.results;
    movieContainer.innerHTML = '';

    movies.slice(0, 6).forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.style.position = 'relative';

      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'relative';
      imgContainer.style.display = 'inline-block';

      const img = document.createElement('img');
      img.setAttribute('data-src', `https://image.tmdb.org/t/p/original${movie.poster_path}`);
      img.alt = movie.title;

      const heartIcon = document.createElement('span');
      heartIcon.innerHTML = '❤️';
      heartIcon.classList.add('heart-icon');



      // Mostrar el corazón al pasar el mouse
      imgContainer.addEventListener('mouseenter', () => {
        if (!heartIcon.classList.contains('liked')) {
          heartIcon.style.opacity = '1';
          heartIcon.style.color = 'rgba(255, 255, 255, 0.4)';
        }
      });
      imgContainer.addEventListener('mouseleave', () => {
        if (!heartIcon.classList.contains('liked')) {
          heartIcon.style.opacity = '0';
          heartIcon.style.color = 'transparent';
        }
      });

      // Toggle real del corazón
      heartIcon.addEventListener('click', e => {
        e.stopPropagation();
        heartIcon.classList.toggle('liked');
        if (heartIcon.classList.contains('liked')) {
          heartIcon.style.color = 'red';
          heartIcon.style.opacity = '1';
          addLikedMovie(movie);      // AGREGAR a favoritos
        } else {
          heartIcon.style.color = 'transparent';
          heartIcon.style.opacity = '0';
          removeLikedMovie(movie.id); // ELIMINAR de favoritos
        }
      });

      imgContainer.appendChild(img);
      imgContainer.appendChild(heartIcon);

      const title = document.createElement('h5');
      title.textContent = movie.title;

      movieCard.appendChild(imgContainer);
      movieCard.appendChild(title);

      // Cambiar hash al tocar la tarjeta
      movieCard.addEventListener('click', () => {
        location.hash = '#movie' + movie.id;
      });

      movieContainer.appendChild(movieCard);
      lazyLoader();
    });
  } catch (error) {
    console.error('Ocurrió un problema:', error);
  }
};

getMoviesProximmamente();

const getPopularMovies = async () => {
  // Buscar el contenedor donde se muestran las peliculas
  const idioma = localStorage.getItem('idioma') || 'es';


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
    let { data } = await api('/movies/popular', { params: { language: idioma, } });
    if (!data.results || data.results.length === 0) {
      ({ data } = await api('/movies/popular', { params: { language: 'en-US' } }));
    }

    const movies = data.results;
    movieContainer.innerHTML = '';

    movies.slice(0, 6).forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.style.position = 'relative';

      // Contenedor de la imágen + el corazon
      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'relative';
      imgContainer.style.display = 'inline-block';

      const img = document.createElement('img');
      img.setAttribute('data-src', `https://image.tmdb.org/t/p/original${movie.poster_path}`);
      img.alt = movie.title;

      const heartIcon = document.createElement('span');
      heartIcon.innerHTML = '❤️';
      heartIcon.classList.add('heart-icon');
      heartIcon.style.opacity = '0';
      heartIcon.style.position = 'auto';

      // Mostrar el corazón al pasar el mouse
      imgContainer.addEventListener('mouseenter', () => {
        if (!heartIcon.classList.contains('liked')) {
          heartIcon.style.opacity = '1';
          heartIcon.style.color = 'rgba(255, 255, 255, 0.4)';
        }
      })
      imgContainer.addEventListener('mouseleave', () => {
        if (!heartIcon.classList.contains('liked')) {
          heartIcon.style.opacity = '0';
          heartIcon.style.color = 'transparent';
        }
      })

      // Toggle real del corazón
      heartIcon.addEventListener('click', e => {
        e.stopPropagation();
        heartIcon.classList.toggle('liked');
        if (heartIcon.classList.contains('liked')) {
          heartIcon.style.color = 'red';
          heartIcon.style.opacity = '1'
          addLikedMovie(movie);      // AGREGAR a favoritos
        } else {
          heartIcon.style.color = 'transparent';
          heartIcon.style.opacity = '0';
          removeLikedMovie(movie.id); // ELIMINAR de favoritos
        }
      });

      imgContainer.appendChild(img);
      imgContainer.appendChild(heartIcon);

      const title = document.createElement('h5');
      title.textContent = movie.title;

      movieCard.appendChild(imgContainer);
      movieCard.appendChild(title);


      // Cambiar hash al tocar la tarjeta
      movieCard.addEventListener('click', () => {
        location.hash = '#movie' + movie.id;
      })


      movieContainer.appendChild(movieCard);
      lazyLoader();
    })
  } catch (error) {
    console.error('Ocurrió un problema:', error);
  }

};
getPopularMovies();

const getTredingMovies = async () => {
  // Buscar el contenedor donde se muestran las peliculas
  const idioma = localStorage.getItem('idioma') || 'es';


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
    let { data } = await api('movies/trending', { params: { language: idioma, time_window: 'week' } });

    // fallback inglés si no hay resultados
    if (!data.results || data.results.length === 0) {
      ({ data } = await api('movies/trending', { params: { language: 'en-US', time_window: 'week' } }));
    }

    const movies = data.results;   // Almacenar la respuesta las peliculas
    movieContainer.innerHTML = ''; // Limpiar cualquier contenido previo del contenedor

    // Mostrar las 6 primeras peliculas
    movies.slice(0, 6).forEach(movie => {  // Limitar a 6 peliculas
      const movieCard = document.createElement('div');  // Crear el contenedor de cada película
      movieCard.classList.add('movie-card'); // Agregar la clase 'movie-card'

      // Contenedor de la imágen + el corazon
      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'relative';
      imgContainer.style.display = 'inline-block';

      const img = document.createElement('img');
      img.setAttribute('data-src', `https://image.tmdb.org/t/p/original${movie.poster_path}`);
      img.alt = movie.title;

      const heartIcon = document.createElement('span');
      heartIcon.innerHTML = '❤️';
      heartIcon.classList.add('heart-icon');
      heartIcon.style.opacity = '0';
      heartIcon.style.position = 'auto';

      // Mostrar el corazón al pasar el mouse
      imgContainer.addEventListener('mouseenter', () => {
        if (!heartIcon.classList.contains('liked')) {
          heartIcon.style.opacity = '1';
          heartIcon.style.color = 'rgba(255, 255, 255, 0.4)';
        }
      })
      imgContainer.addEventListener('mouseleave', () => {
        if (!heartIcon.classList.contains('liked')) {
          heartIcon.style.opacity = '0'
          heartIcon.style.color = 'transparent';
        }
      })

      // Toggle real del corazón
      heartIcon.addEventListener('click', e => {
        e.stopPropagation();
        heartIcon.classList.toggle('liked');
        if (heartIcon.classList.contains('liked')) {
          heartIcon.style.color = 'red';
          heartIcon.style.opacity = '1';
          addLikedMovie(movie)
        } else {
          heartIcon.style.color = 'transparent';
          heartIcon.style.opacity = '0';
          removeLikedMovie(movie.id)
        }
      });

      imgContainer.appendChild(img);
      imgContainer.appendChild(heartIcon);

      const title = document.createElement('h5');
      title.textContent = movie.title;

      movieCard.appendChild(imgContainer);
      movieCard.appendChild(title);

      // Cambiar hash al tocar la tarjeta
      movieCard.addEventListener('click', () => {
        location.hash = '#movie' + movie.id;
      })

      movieContainer.appendChild(movieCard);
      lazyLoader();
    })
  } catch (error) {
    console.error('Ocurrió un problema:', error);
  }
}


const getCategoriesPreview = async (idioma = 'es') => {
  try {
    const { data } = await api.get('genres', {
      params: { language: idioma }
    });

    if (!data || !data.genres) throw new Error('Error al obtener las categorías');

    const categoryList = document.getElementById('dynamicCategoriesList');
    categoryList.innerHTML = '';

    data.genres.forEach(category => {
      const li = document.createElement('li');
      li.classList.add('category-item');
      li.innerHTML = `<a href="#" data-category-id="${category.id}" data-category-name="${category.name}">${category.name}</a>`;

      li.addEventListener('click', (event) => {
        event.preventDefault();
        const categoryId = category.id;
        const categoryName = category.name;
        window.location.hash = `category=${categoryId}-${categoryName}`;
        getMoviesCategory(categoryId);
      });

      categoryList.appendChild(li);
    });

  } catch (error) {
    console.error('Error cargando categorías:', error);
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

let totalPeliculasMostradasBuscadas = 0;
const limitePeliculasBuscadas = 160;
let peliculasMostradasBusquedas = [];

const getMoviesSearch = async (query) => {
  try {
    const { data } = await api.get('/movies/search', { params: { query } });

    const movies = data.results;
    const container = document.querySelector('#search-section .container');
    const title = document.querySelector('.search-title');

    // Limpiar contenido anterior
    container.innerHTML = ``;

    const gridTitlte = document.querySelector('.grid-category-title');
    if (gridTitlte) gridTitlte.textContent = '';
    if (categoryGridSection) categoryGridSection.classList.add('d-none');

    // Renderizar películas
    movies.forEach(movie => {
      if (!movie.poster_path || totalPeliculasMostradasBuscadas >= limitePeliculasBuscadas) return;

      const movieElement = document.createElement('div');
      movieElement.classList.add('movie-card', 'mb-4');

      const imgElement = document.createElement('img');
      imgElement.classList.add('img-fluid', 'rounded');
      imgElement.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      imgElement.onerror = () => imgElement.src = 'img/Brak OBRAZU.png';

      movieElement.innerHTML = `<h5>${movie.title}</h5>`;
      movieElement.prepend(imgElement);

      movieElement.addEventListener('click', () => {
        history.pushState(null, '', `#movie=${movie.id}`);
      });

      container.appendChild(movieElement);
      totalPeliculasMostradasBuscadas++;
    });

    lazyLoader();

    // Ocultar otras secciones
    bannerSection.classList.add('d-none');
    tendenciasSection.classList.add('d-none');
    popularesSection.classList.add('d-none');
    likedSection.classList.add('d-none');
    proximamenteSection.classList.add('d-none');

    // Mostrar sección de búsqueda
    searchSection.classList.remove('d-none');
    title.textContent = decodeURIComponent(query);
    toggleButtonsVisibility('back');

  } catch (error) {
    console.error('Error al buscar películas:', error);
  }
};

const toggleButtonsVisibility = (buttonType) => {
  const backBtn = document.getElementById('back-btn');
  const homeBtn = document.getElementById('home-btn');

  if (buttonType === 'back') {
    backBtn.classList.remove('d-none');
    homeBtn.classList.add('d-none');
  } else if (buttonType === 'home') {
    backBtn.classList.add('d-none');
    homeBtn.classList.remove('d-none');
  }
};

document.getElementById('back-btn').addEventListener('click', () => {
  window.history.back();
});

document.getElementById('home-btn').addEventListener('click', () => {
  bannerSection.classList.remove('d-none');
  tendenciasSection.classList.remove('d-none');
  popularesSection.classList.remove('d-none');
  searchSection.classList.add('d-none');
  toggleButtonsVisibility('home');
});

// 🔁 Scroll infinito corregido
const getPaginatedMoviesBySearch = (query) => {
  let page = 2;
  const maxPages = 8;
  const seenMovieIds = new Set();
  let isLoading = false;

  const container = document.querySelector('#search-section .container');

  const CargarMasPeliculas = async () => {
    if (isLoading || totalPeliculasMostradasBuscadas >= limitePeliculasBuscadas || page > maxPages) return;

    isLoading = true;
    console.log(`Cargando página ${page}...`);

    try {
      const { data } = await api.get('/movies/search', { params: { query, page } });
      page++;

      data.results.forEach(movie => {
        if (!movie.poster_path || seenMovieIds.has(movie.id)) return;

        seenMovieIds.add(movie.id);

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-card', 'mb-4');

        const imgElement = document.createElement('img');
        imgElement.classList.add('img-fluid', 'rounded');
        imgElement.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        imgElement.onerror = () => imgElement.src = 'img/Brak OBRAZU.png';

        movieElement.innerHTML = `<h5>${movie.title}</h5>`;
        movieElement.prepend(imgElement);

        movieElement.addEventListener('click', () => {
          history.pushState(null, '', `#movie=${movie.id}`);
        });

        container.appendChild(movieElement);
        totalPeliculasMostradasBuscadas++;
      });

    } catch (error) {
      console.error('Error al cargar más películas:', error);
    } finally {
      isLoading = false;
    }
  };

  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      console.log('Scroll detectado cerca del fondo');
      CargarMasPeliculas();
    }
  };

  window.addEventListener('scroll', onScroll);
};


let totalPeliculasCargadasCategory = 0;
const limitePeliculasCategory = 80;
const seenMovieIds = new Set(); // también global para evitar duplicados

const getMoviesCategory = async (id) => {
  try {
    const genereMap = {
      es: { 28: 'Acción', 12: 'Aventura', 16: 'Animación', 35: 'Comedia', 80: 'Fantasía', 99: 'Documental', 18: 'Drama', 10751: 'Familiar', 14: 'Fantasía', 36: 'Historia', 27: 'Terror', 10402: 'Música', 9648: 'Misterio', 10749: 'Romance', 878: 'Ciencia ficción', 10770: 'Película de TV', 53: 'Suspenso', 10752: 'Bélica', 37: 'Western' },
      en: { 28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Fantasy', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western' },
      pl: { 28: 'Akcja', 12: 'Przygoda', 16: 'Animacja', 35: 'Komedia', 80: 'Fantasy', 99: 'Dokumentalny', 18: 'Dramat', 10751: 'Rodzinny', 14: 'Fantasy', 36: 'Historyczny', 27: 'Horror', 10402: 'Muzyka', 9648: 'Tajemnica', 10749: 'Romans', 878: 'Science fiction', 10770: 'Film TV', 53: 'Thriller', 10752: 'Wojenny', 37: 'Western' },
      fr: { 28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie', 80: 'Fantastique', 99: 'Documentaire', 18: 'Drame', 10751: 'Familial', 14: 'Fantaisie', 36: 'Histoire', 27: 'Horreur', 10402: 'Musique', 9648: 'Mystère', 10749: 'Romance', 878: 'Science-fiction', 10770: 'Téléfilm', 53: 'Thriller', 10752: 'Guerre', 37: 'Western' }
    };

    const idioma = localStorage.getItem('idioma') || 'es';
    const categoriasPorIdioma = genereMap[idioma] || genereMap['es'];
    if (!categoriasPorIdioma[id]) return;

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

    // Cambiar título
    const categoryTitle = document.querySelector('.grid-category-title');
    categoryTitle.textContent = `Películas por categoría ${categoriasPorIdioma[id]}`;

    // Llamar a tu backend
    const [pelisIdiomaResp, pelisENResp] = await Promise.all([
      api.get(`/movies/category/${id}?language=${idioma}`),
      api.get(`/movies/category/${id}?language=en`)
    ]);

    const pelisIdioma = pelisIdiomaResp.data.results || [];
    const pelisEN = pelisENResp.data.results || [];

    const allMovies = [...pelisIdioma, ...pelisEN];
    if (allMovies.length === 0) throw new Error('No se encontraron películas');

    // Ocultar los skeletons y mostrar las películas
    ocultarskeletoncategory();
    moviesContainer.innerHTML = '';

    const peliculasParaMostrar = allMovies
      .filter(movie => movie.poster_path && !seenMovieIds.has(movie.id))
      .slice(0, limitePeliculasCategory);

    peliculasParaMostrar.forEach(movie => {
      seenMovieIds.add(movie.id);

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
    });

    totalPeliculasCargadasCategory = peliculasParaMostrar.length;

    lazyLoader();

    // Botón "Ver menos"
    const showLessCategoryGridButton = document.getElementById('show-less-category-grid');
    showLessCategoryGridButton.classList.remove('d-none');
    showLessCategoryGridButton.onclick = () => {
      bannerSection.classList.remove('d-none');
      tendenciasSection.classList.remove('d-none');
      proximamenteSection.classList.remove('d-none');
      categoryGridSection.classList.remove('d-none');
      movieSliders.forEach(slider => slider.classList.add('d-none'));
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



// Función para cargar más películas (paginación con scroll)
const getPaginatedMoviesByCategory = (id) => {
  let page = 2;
  const maxPages = 6;
  let isLoading = false;
  let scrollActivo = false;

  const genereMap = {
    28: 'Acción',
    12: 'Aventura',
    16: 'Animación',
    35: 'Cómedia',
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

  const CargarMasPeliculas = async () => {
    if (isLoading || totalPeliculasCargadasCategory >= limitePeliculasCategory || page > maxPages) return;
    isLoading = true;

    mostrarSkeletoncategory();

    try {
      const [pelisEs, pelisEN] = await Promise.all([
        api.get(`/movies/category/${id}`, {
          params: { language: 'es-ES', page },
        }).then(res => res.data.results || []),

        api.get(`/movies/category/${id}`, {
          params: { language: 'en-US', page },
        }).then(res => res.data.results || []),
      ]);

      page++;

      // Filtrar duplicados usando el Set global
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
        }

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
      lazyLoader();
    } catch (error) {
      console.error('Error cargando películas por categoría:', error);
    } finally {
      isLoading = false;

    }
  };

  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 150) {
      CargarMasPeliculas();
    }
  };

  if (!scrollActivo) {
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll);
    scrollActivo = true;
  }


  CargarMasPeliculas();

};




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
      params: {
        language: idioma,
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
  moviePoster.innerHTML = `<img data-src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">`;
  movieTitle.textContent = movie.title;
  movieDescription.textContent = movie.overview || 'Descripción no disponible.';
  movieReleaseDate.textContent = `Fecha de estreno: ${movie.release_date || 'N/A'}`;

  // Llamar a la nueva función para géneros y recomendaciones
  await fetchGenresAndRecommendations(movie.id);


  // 🔥 Llamamos a lazyLoader después de agregar las imágenes dinámicamente
  lazyLoader();


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
  const idioma = localStorage.getItem('idioma') || 'es';
 const textos = traducciones[idioma] || traducciones['es']; // fallback a españo

  const categoriesContainer = document.getElementById('movie-categories');
  const similaresContainer = document.getElementById('movie-similares');

  categoriesContainer.innerHTML = '';
  similaresContainer.innerHTML = '';




  try {



    const [detailRes, recommendationsRes] = await Promise.all([
      api.get(`movies/${id}`, { params: { language: idioma } }),
      api.get(`movies/${id}/recommendations`, { params: { language: idioma } })
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
           <img data-src="https://image.tmdb.org/t/p/original${rec.poster_path}" alt="${rec.title}" class="img-fluid rounded mb-2" style="height: 300px; object-fit: cover;">
           <h5 class="text-truncate" title="${rec.title}">${rec.title}</h5>
          `;

        col.appendChild(card);
        row.appendChild(col);

      });

      similaresContainer.appendChild(row);


      // 🔥 Llamamos a lazyLoader después de agregar las imágenes dinámicamente
      lazyLoader();

    }

  } catch (error) {
    console.error('Error al obtener géneros o recomendaciones:', error);
  }

};




let totalPeliculasCargadas = 0;
const limiteTotalPeliculas = 80;
let cargando = false;
let buscando = false;
const peliculasCargadas = new Set();

let queryBusqueda = ''; // Guarda el término de búsqueda actual
let paginarBusquedaFn = null; // Función paginadora para búsqueda

const agregarPelicula = (pelicula) => {
  if (!peliculasCargadas.has(pelicula.id)) {
    peliculasCargadas.add(pelicula.id);
    totalPeliculasCargadas++;
    console.log(`Agregada: ${pelicula.title}`);
    // Aquí debes agregar la película al DOM
  }
};

const cargarPeliculasNormales = async () => {
  // Llama tus funciones normales de carga
await cargarPeliculasTendecias() // ✅
 await cargarPeliculasPopulares();
 await cargarPeliculasProximamente();
};

const busquedaPaginada = async () => {
  if (!paginarBusquedaFn) return false;
  const puedeSeguir = await paginarBusquedaFn();
  return puedeSeguir;
};

let onScroll = async () => {
  if (cargando || buscando) return;

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    if (queryBusqueda) {
      buscando = true;
      const puedeSeguir = await busquedaPaginada();
      if (!puedeSeguir) {
        window.removeEventListener('scroll', onScroll);
      }
      buscando = false;
    } else {
      cargando = true;
      if (totalPeliculasCargadas < limiteTotalPeliculas) {
        await cargarPeliculasNormales();
      } else {
        window.removeEventListener('scroll', onScroll);
      }
      cargando = false;
    }
  }
};

const iniciarBusqueda = (query) => {
  peliculasCargadas.clear();
  totalPeliculasCargadas = 0;
  queryBusqueda = query;

  // Remueve el listener anterior para evitar multiples escuchas
  window.removeEventListener('scroll', onScroll);

  // Crea el closure solo una vez por búsqueda
  paginarBusquedaFn = getPaginatedMoviesBySearch(query);

  // Añade el listener para scroll
  window.addEventListener('scroll', onScroll);

  // Llama el scroll manual para cargar la primera página
  onScroll();
};

const volverAlHome = () => {
  peliculasCargadas.clear();
  totalPeliculasCargadas = 0;
  queryBusqueda = '';

  window.removeEventListener('scroll', onScroll);
  paginarBusquedaFn = null;

  window.addEventListener('scroll', onScroll);
  onScroll();
};


let peliculasMostradasTendencias = [];
let paginaActualTendencias = 2; // Empieza en 2 porque la 1 ya está cargada
const maxPaginasTendencias = 6;  // Hasta 6 páginas
let cargandoPeliculasTendencias = false;

let totalPeliculasMostradasTendecias = 0;
const limitePeliculasTendencias = 80;

// Mostrar grid Tendencias y ocultar otras secciones
const mostrarGridTendencias = () => {
  bannerSection.classList.add('d-none');
  popularesSection.classList.add('d-none');
  proximamenteSection.classList.add('d-none');
  categoryGridSection.classList.add('d-none');
  movieSliders.forEach(slider => slider.classList.add('d-none'));

  gridTendenciasSection.classList.remove('d-none');
  showLessTendenciasButton.classList.remove('d-none');
};

// Ocultar grid Tendencias y mostrar otras secciones
const ocultarGridTendencias = () => {
  bannerSection.classList.remove('d-none');
  popularesSection.classList.remove('d-none');
  proximamenteSection.classList.remove('d-none');
  categoryGridSection.classList.add('d-none');
  movieSliders.forEach(slider => slider.classList.remove('d-none'));

  gridTendenciasSection.classList.add('d-none');
  showLessTendenciasButton.classList.add('d-none');

  // Limpiar para la próxima vez que se muestre el grid
  peliculasMostradasTendencias = [];
  totalPeliculasMostradasTendecias = 0;
  paginaActualTendencias = 2;
  gridTendenciasSection.querySelector('.movies-grid-container').innerHTML = '';
};

// Mostrar skeletons
const mostrarSkeletonstendecias = () => {
  const moviesContainer = gridTendenciasSection.querySelector('.movies-grid-container');
  for (let i = 0; i < 20; i++) {
    const skeleton = document.createElement('div');
    skeleton.classList.add('loading-card-grid');
    moviesContainer.appendChild(skeleton);
  }
};

// Ocultar skeletons
const ocultarskeletontendecias = () => {
  const moviesContainer = gridTendenciasSection.querySelector('.movies-grid-container');
  const skeletons = moviesContainer.querySelectorAll('.loading-card-grid');
  skeletons.forEach(skeleton => skeleton.remove());
};

// Cargar películas Tendencias sin borrar las anteriores, evitando duplicados y hasta 80 películas
const cargarPeliculasTendecias = async () => {
  if (
    paginaActualTendencias > maxPaginasTendencias ||
    totalPeliculasMostradasTendecias >= limitePeliculasTendencias ||
    cargandoPeliculasTendencias
  ) return;

  cargandoPeliculasTendencias = true;
  mostrarSkeletonstendecias();

  const idioma = localStorage.getItem('idioma') || 'es';
  try {
    let response = await api('movies/trending', { params: { language: idioma, page: paginaActualTendencias, time_window: 'week' } });

    // fallback a inglés si no hay resultados
    if (!response.data.results || response.data.results.length === 0) {
      response = await api('trending/movies/week', { params: { language: 'en-US', page: paginaActualTendencias } });
    }

    if (response.data.results && response.data.results.length > 0) {
      const peliculasNuevasTedencia = response.data.results.filter(movie => !peliculasMostradasTendencias.includes(movie.id));
      const moviesContainer = gridTendenciasSection.querySelector('.movies-grid-container');

      for (const movie of peliculasNuevasTedencia) {
        if (totalPeliculasMostradasTendecias >= limitePeliculasTendencias) break;

        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.setAttribute('data-id', movie.id);
        movieCard.innerHTML = `
          <img data-src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
          <h5>${movie.title}</h5>
        `;
        movieCard.addEventListener('click', () => {
          history.pushState(null, '', '#movie' + movie.id);
        });

        moviesContainer.appendChild(movieCard);
        peliculasMostradasTendencias.push(movie.id);
        totalPeliculasMostradasTendecias++;
      }

      paginaActualTendencias++;
    } else {
      console.warn('No se encontraron películas para mostrar.');
    }
  } catch (error) {
    console.error('Error al obtener películas de la API de tendencias:', error);
  }

  ocultarskeletontendecias();
  lazyLoader();
  cargandoPeliculasTendencias = false;
};

// Eventos botones mostrar más / menos
const generarGridMoviesTendencias = () => {
  showMoreTendenciasButton.addEventListener('click', () => {
    mostrarGridTendencias();

    // Resetear estado y limpiar al abrir el grid
    peliculasMostradasTendencias = [];
    totalPeliculasMostradasTendecias = 0;
    paginaActualTendencias = 2;
    gridTendenciasSection.querySelector('.movies-grid-container').innerHTML = '';

    cargarPeliculasTendecias();
  });

  showLessTendenciasButton.addEventListener('click', () => {
    ocultarGridTendencias();
  });
};

generarGridMoviesTendencias();


setTimeout(() => {
  const banner = document.getElementById('banner');
  banner.classList.remove('skeleton');
  banner.querySelector('.hero-container').classList.remove('d-none');
}, 2000);


let peliculasMostradasPopulares = [];
let paginaActualPopulares = 2;
const maxPaginasPopulares = 6;
let cargandoPeliculasPopulares = false;

let totalPeliculasMostradasPopulares = 0;
const limitePeliculasPopulares = 80;

const mostrarGridPopulares = () => {
  bannerSection.classList.add('d-none');
  tendenciasSection.classList.add('d-none');
  proximamenteSection.classList.add('d-none');
  categoryGridSection.classList.add('d-none');
  movieSliders.forEach(slider => slider.classList.add('d-none'));

  gridPopularesSection.classList.remove('d-none');
  showlesspopulareButton.classList.remove('d-none');
};

const ocultarGridPopulares = () => {
  bannerSection.classList.remove('d-none');
  tendenciasSection.classList.remove('d-none');
  proximamenteSection.classList.remove('d-none');
  categoryGridSection.classList.add('d-none');
  movieSliders.forEach(slider => slider.classList.remove('d-none'));

  gridPopularesSection.classList.add('d-none');
  showlesspopulareButton.classList.add('d-none');

  // Limpiar para la próxima vez
  peliculasMostradasPopulares = [];
  totalPeliculasMostradasPopulares = 0;
  paginaActualPopulares = 2;
  gridPopularesSection.querySelector('.movies-grid-container-popular').innerHTML = '';
};

const mostrarSkeletonspopulares = () => {
  const moviesContainer = gridPopularesSection.querySelector('.movies-grid-container-popular');
  for (let i = 0; i < 80; i++) {
    const skeleton = document.createElement('div');
    skeleton.classList.add('loading-card-grid');
    moviesContainer.appendChild(skeleton);
  }
};

const ocultarSkeletonspopulares = () => {
  const moviesContainer = gridPopularesSection.querySelector('.movies-grid-container-popular');
  const skeletons = moviesContainer.querySelectorAll('.loading-card-grid');
  skeletons.forEach(skeleton => skeleton.remove());
};

const cargarPeliculasPopulares = async () => {
  if (
    paginaActualPopulares > maxPaginasPopulares ||
    totalPeliculasMostradasPopulares >= limitePeliculasPopulares ||
    cargandoPeliculasPopulares
  ) return;

  cargandoPeliculasPopulares = true;
  mostrarSkeletonspopulares();

  const idioma = localStorage.getItem('idioma') || 'es';

  try {
    let response = await api('movies/popular', {
      params: { language: idioma, page: paginaActualPopulares }
    });
    

    if (!response.data.results || response.data.results.length === 0) {
      response = await api('/movies/popular', {
        params: { language: 'en-US', page: paginaActualPopulares }
      });
    }

    if (response.data.results && response.data.results.length > 0) {
      const peliculasNuevasPopulares = response.data.results.filter(
        movie => !peliculasMostradasPopulares.includes(movie.id)
      );

      const moviesContainer = gridPopularesSection.querySelector('.movies-grid-container-popular');

      for (const movie of peliculasNuevasPopulares) {
        if (totalPeliculasMostradasPopulares >= limitePeliculasPopulares) break;

        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.setAttribute('data-id', movie.id);
        movieCard.innerHTML = `
          <img data-src="https://image.tmdb.org/t/p/original${movie.poster_path || ''}" alt="${movie.title}">
          <h5>${movie.title}</h5>
        `;
        movieCard.addEventListener('click', () => {
          history.pushState(null, '', '#movie' + movie.id);
        });

        moviesContainer.appendChild(movieCard);
        peliculasMostradasPopulares.push(movie.id);
        totalPeliculasMostradasPopulares++;
      }

      paginaActualPopulares++;
    } else {
      console.warn('No se encontraron películas populares para mostrar.');
    }
  } catch (error) {
    console.error('Error al obtener películas populares:', error);
  }

  ocultarSkeletonspopulares();
  lazyLoader();
  cargandoPeliculasPopulares = false;
};

const generarGridMoviesPopulares = () => {
  showmorepopularButton.addEventListener('click', () => {
    mostrarGridPopulares();

    // Resetear estado y limpiar solo al mostrar el grid
    peliculasMostradasPopulares = [];
    totalPeliculasMostradasPopulares = 0;
    paginaActualPopulares = 2;
    gridPopularesSection.querySelector('.movies-grid-container-popular').innerHTML = '';

    cargarPeliculasPopulares();
  });

  showlesspopulareButton.addEventListener('click', () => {
    ocultarGridPopulares();
  });
};

generarGridMoviesPopulares();

let peliculasMostradasProximamente = [];
let paginaActualProximamente = 2;
const maxPaginasProximamente = 6;
let cargandoPeliculasProximamente = false;

let totalPeliculasMostradasProximamente = 0;
const limitePeliculasProximamente = 80;

const mostrarGridProximamente = () => {
  bannerSection.classList.add('d-none');
  tendenciasSection.classList.add('d-none');
  popularesSection.classList.add('d-none');
  categoryGridSection.classList.add('d-none');
  movieSliders.forEach(slider => slider.classList.add('d-none'));

  gridProximamenteSection.classList.remove('d-none');
  showlessproximamenteButton.classList.remove('d-none');
};

const ocultarGridProximamente = () => {
  bannerSection.classList.remove('d-none');
  tendenciasSection.classList.remove('d-none');
  popularesSection.classList.remove('d-none');
  categoryGridSection.classList.add('d-none');
  movieSliders.forEach(slider => slider.classList.remove('d-none'));

  gridProximamenteSection.classList.add('d-none');
  showlessproximamenteButton.classList.add('d-none');

  // Limpiar para la próxima vez
  peliculasMostradasProximamente = [];
  totalPeliculasMostradasProximamente = 0;
  paginaActualProximamente = 2;
  gridProximamenteSection.querySelector('.movies-grid-container-proximamente').innerHTML = '';
};

const mostrarSkeletonsProximamente = () => {
  const moviesContainer = gridProximamenteSection.querySelector('.movies-grid-container-proximamente');
  for (let i = 0; i < 20; i++) {
    const skeleton = document.createElement('div');
    skeleton.classList.add('loading-card-grid');
    moviesContainer.appendChild(skeleton);
  }
};

const ocultarSkeletonsProximamente = () => {
  const moviesContainer = gridProximamenteSection.querySelector('.movies-grid-container-proximamente');
  const skeletons = moviesContainer.querySelectorAll('.loading-card-grid');
  skeletons.forEach(skeleton => skeleton.remove());
};

const cargarPeliculasProximamente = async () => {
  if (
    paginaActualProximamente > maxPaginasProximamente ||
    totalPeliculasMostradasProximamente >= limitePeliculasProximamente ||
    cargandoPeliculasProximamente
  ) return;

  cargandoPeliculasProximamente = true;
  mostrarSkeletonsProximamente();

  const idioma = localStorage.getItem('idioma') || 'es';

  try {
    let response = await api('/movies/upcoming', {
      params: { language: idioma, page: paginaActualProximamente }
    });

    if (!response.data.results || response.data.results.length === 0) {
      response = await api('/movie/upcoming', {
        params: { language: 'en-US', page: paginaActualProximamente }
      });
    }

    if (response.data.results && response.data.results.length > 0) {
      const peliculasNuevasProximamente = response.data.results.filter(
        movie => !peliculasMostradasProximamente.includes(movie.id)
      );

      const moviesContainer = gridProximamenteSection.querySelector('.movies-grid-container-proximamente');

      for (const movie of peliculasNuevasProximamente) {
        if (totalPeliculasMostradasProximamente >= limitePeliculasProximamente) break;

        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.setAttribute('data-id', movie.id);
        movieCard.innerHTML = `
          <img data-src="https://image.tmdb.org/t/p/original${movie.poster_path || ''}" alt="${movie.title}">
          <h5>${movie.title}</h5>
        `;
        movieCard.addEventListener('click', () => {
          history.pushState(null, '', '#movie' + movie.id);
        });

        moviesContainer.appendChild(movieCard);
        peliculasMostradasProximamente.push(movie.id);
        totalPeliculasMostradasProximamente++;
      }

      paginaActualProximamente++;
    } else {
      console.warn('No se encontraron películas próximas para mostrar.');
    }
  } catch (error) {
    console.error('Error al obtener películas próximas:', error);
  }

  ocultarSkeletonsProximamente();
  lazyLoader();
  cargandoPeliculasProximamente = false;
};

const generarGridMoviesProximamente = () => {
  showMoreProximamneteButton.addEventListener('click', () => {
    mostrarGridProximamente();

    // Resetear estado y limpiar solo al mostrar el grid
    peliculasMostradasProximamente = [];
    totalPeliculasMostradasProximamente = 0;
    paginaActualProximamente = 2;
    gridProximamenteSection.querySelector('.movies-grid-container-proximamente').innerHTML = '';

    cargarPeliculasProximamente();
  });

  showlessproximamenteButton.addEventListener('click', () => {
    ocultarGridProximamente();
  });
};

generarGridMoviesProximamente();


// función para guardar en favoritos 
const getLikedMovies = () => {
  const likedMovies = likedMoviesList(); // Obtener desde localStorage
  const MoviesArray = Object.values(likedMovies); // Convertir a array

  const movieContainer = document.querySelector('.movies-container-favourites-movies');
  if (!movieContainer) {
    console.error('No se encontró el contenedor de películas favoritas.')
    return;
  }

  movieContainer.innerHTML = ''; // Limpiar contenido previo

  if (MoviesArray.length === 0) {
    return;
  };

  MoviesArray.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.style.position = 'relative';

    const imgContainer = document.createElement('div');
    imgContainer.style.position = 'relative';
    imgContainer.style.display = 'inline-block';

    const img = document.createElement('img');
    img.setAttribute('data-src', `https://image.tmdb.org/t/p/original${movie.poster_path}`);
    img.alt = movie.title;

    const heartIcon = document.createElement('span');
    heartIcon.innerHTML = '❤️';
    heartIcon.classList.add('heart-icon', 'liked');
    heartIcon.style.color = 'red';
    heartIcon.style.opacity = '1';

    heartIcon.addEventListener('click', e => {
      e.stopPropagation();
      removeLikedMovie(movie.id);
      getLikedMovies();
    });

    imgContainer.appendChild(img);
    imgContainer.appendChild(heartIcon);

    const title = document.createElement('h5');
    title.textContent = movie.title;

    movieCard.appendChild(imgContainer);
    movieCard.appendChild(title);

    movieCard.addEventListener('clck', () => {
      location.hash = '#movie' + movie.id;
    });

    movieContainer.appendChild(movieCard);
  });

  lazyLoader();
};


window.addEventListener('storage', () => {
  getLikedMovies(); // vuelve a cargar las películas favoritas inmediatamente
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
    const resMovies = await api('movies/trending', { params: { language: idioma, time_window: 'week' } })

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




// Traducciones para los títulos
const traducciones = {
  es: {
    tendencias: 'Películas en Tendencia',
    populares: 'Películas Populares',
    proximamente: 'Películas Próximamente',
    categorias: 'Categorías:',
    recomendadas: 'Películas Recomendadas',
    hero_text: 'Prepárate para una aventura increíble',
  },
  en: {
    tendencias: 'Trending Movies',
    populares: 'Popular Movies',
    proximamente: 'Upcoming Movies',
    categorias: 'Categories:',
    recomendadas: 'Recommended Movies',
    hero_text: 'Get ready for an incredible adventure',
  },
  pl: {
    tendencias: 'Filmy na czasie',
    populares: 'Popularne filmy',
    proximamente: 'Nadchodzące filmy',
    categorias: 'Kategorie:',
    recomendadas: 'Polecane filmy',
    hero_text: 'Przygotuj się na niesamowitą przygodę',
  },
  fr: {
    tendencias: 'Films Tendance',
    populares: 'Films Populaires',
    proximamente: 'Films à Venir',
    categorias: 'Catégories :',
    recomendadas: 'Films Recommandés',
    hero_text: 'Prépare-toi pour une aventure incroyable  ',
  }
};

const traduccionesNavbar = {
  es: {
    inicio: 'Inicio',
    tendencias: 'Tendencias',
    categorias: 'Categorías',
    populares: 'Populares',
    proximamente: 'Próximamente'
  },

  en: {
    inicio: 'Home',
    tendencias: 'Trending',
    categorias: 'Categories',
    populares: 'Popular',
    proximamente: 'Upcoming'
  },

  pl: {
    inicio: 'Strona główna',
    tendencias: 'Na czasie',
    categorias: 'Kategorie',
    populares: 'Popularne',
    proximamente: 'Wkrótce'
  },

  fr: {
    inicio: 'Accueil',
    tendencias: 'Tendances',
    categorias: 'Catégories',
    populares: 'Populaires',
    proximamente: 'Bientôt'
  }
};


const traduccionesFooter = {
  es: {
    derechos: '© 2025 Kino Live Start. Todos los derechos reservados.',
    privacidad: 'Política de privacidad',
    reglamento: 'Reglamento',
    contacto: 'Contacto'
  },

  en: {
    derechos: '© 2025 Kino Live Start. All rights reserved.',
    privacidad: 'Privacy Policy',
    reglamento: 'Regulations',
    contacto: 'Contact'
  },

  pl: {
    derechos: '© 2025 Kino Live Start. Wszelkie prawa zastrzeżone.',
    privacidad: 'Polityka prywatności',
    reglamento: 'Regulamin',
    contacto: 'Konatkt'
  },

  fr: {
    derechos: '© 2025 Kino Live Start. Tous droits réservés.',
    privacidad: 'Politique de confidentialité',
    reglamento: 'Réglment',
    contacto: 'Contact'
  }
};

const cambiarIdiomaFooter = (idioma) => {
  const textos = traduccionesFooter[idioma];
  if (!textos) return;

  const footerTexto = document.querySelector('footer p');
  const footerLinks = document.querySelectorAll('footer ul.list-inline li a');
  
  if (footerTexto) footerTexto.textContent = textos.derechos;
  if (footerLinks.length >= 3) {
    footerLinks[0].textContent = textos.privacidad;
    footerLinks[1].textContent = textos.reglamneto;
    footerLinks[2].textContent = textos.contacto;
  }
}


const cambiarIdiomaNavbar = (idioma) => {
  const t = traduccionesNavbar[idioma];
  if (!t) return;

  const inicio = document.querySelector('a.nav-link[href="#home"]');
  const tendencias = document.querySelector('a.nav-link[href="#tendencias"]');
  const categorias = document.querySelector('.nav-item.dropdown > a.nav-link.dropdown-toggle');
  const populares = document.querySelector('a.nav-link[href="#populares"]');
  const proximamente = document.querySelector('a.nav-link[href="#proximamente"]');

  if (inicio) inicio.textContent = t.inicio;
  if (tendencias) tendencias.textContent = t.tendencias;
  if (categorias) categorias.textContent = t.categorias;
  if (populares) populares.textContent = t.populares;
  if (proximamente) proximamente.textContent = t.proximamente;
};

const traduccionesBotones = {

  es: {
     verMas: 'Ver más',
     volver: 'Volver'
  },
  en: {
    verMas: 'Show more',
    volver: 'Back',
  },
  pl: {
     verMas: 'Zabackz więej',
     volver: 'Wróc',
  },
  fr: {
    verMas: 'Voir plus',
    volver: 'Retour'
  }
};

const cambiarIdiomaBotones = (idioma) => {
  const t = traduccionesBotones[idioma];
  if (!t) return;

  // Botónes de verMas
  document.querySelectorAll('.btn.btn-polish-red').forEach(btn => {
    btn.textContent = t.verMas;
  })

  // Botónes de volver
  document.querySelectorAll('.btn.btn-polish-white').forEach(btn => {
    btn.textContent = t.volver;
  })
 
 };

const traduccionesBotenesbar = {

  es: {
    Ver_ahora: 'Ver ahora',
    Detalles: 'Detalles',
    Modo_oscuro: 'Modo oscuro',
    Buscar_placeholder: 'Buscar..',
  },

  en: {
    Ver_ahora: 'Watch now',
    Detalles:  'Details',
    Modo_oscuro: 'Dark mode',
    Buscar_placeholder: 'Search..',
  },

  pl: {
   Ver_ahora: 'Objrzyj teraz',
   Detalles: 'Szegóły',
   Modo_oscuro: 'Tyb ciemy',
   Buscar_placeholder: 'Szukaj..',
  },

  fr: {
    Ver_ahora: 'Regarder maintenant',
    Detalles: 'Détails',
    Modo_oscuro: 'Mode sombre',
    Buscar_placeholder: 'Chercher..',
  }
  };

  const cambiarIdiomaBotonesbaner = (idioma) => {
    const textos = traduccionesBotenesbar[idioma];
    if (!textos) return;

    const btnVerAhora = document.querySelector('.btn.btn-danger.btn-sm');
    const btnDetalles = document.querySelector('.btn.btn-light.btn-sm');
    const labelModoOscuro = document.querySelector('label[for="themeSwitch"]');
    const inputBuscar = document.getElementById('search-input');
  
    if (btnVerAhora) btnVerAhora.textContent = textos.Ver_ahora;
    if (btnDetalles)  btnDetalles.textContent = textos.Detalles;
    if (labelModoOscuro) labelModoOscuro.textContent = textos.Modo_oscuro;
    if (inputBuscar) inputBuscar.placeholder = textos.Buscar_placeholder;
  };


// Cambiar los textos visibles en el DOM según idioma
function cambiarIdiomaTextos(idioma) {
  const textos = traducciones[idioma];
  if (!textos) {
    console.warn(`Idioma no soportado: ${idioma}`);
    return;
  }


  const tend = document.querySelector('.grid-tendencias-title');
  const pop = document.querySelector('.grid-populares-title');
  const prox = document.querySelector('.grid-proximamente-title');


  if (tend) tend.textContent = textos.tendencias;
  if (pop) pop.textContent = textos.populares;
  if (prox) prox.textContent = textos.proximamente;

  // Actualizar textos en vista detalle (si están presentes)
  const categoriasTitulo = document.querySelector('#movie-categories h4');
  const recomendadasTitulo = document.querySelector('#movie-similares h4');
  if (categoriasTitulo) categoriasTitulo.textContent = textos.categorias;
  if (recomendadasTitulo) recomendadasTitulo.textContent = textos.recomendadas;

  // Texto hero
  const hero_text = document.querySelector('.hero-text');
  if (hero_text) {
    hero_text.textContent = textos.hero_text;
  } else {
    console.warn('No se encontró el elemento .hero-text para actualizar');
  }
}

// Traducciones para el slider
const traduccionesSlider = {
  es: {
    tendencias: 'Tendencias',
    peliculas_favoritas: 'Películas favoritas',
    populares: 'Populares',
    proximamente: 'Próximamente'
  },
  en: {
    tendencias: 'Trending',
    peliculas_favoritas: 'Favorite movies',
    populares: 'Popular',
    proximamente: 'Upcoming'
  },
  pl: {
    tendencias: 'Tendencje',
    peliculas_favoritas: 'Ulubione filmy',
    populares: 'Popularne',
    proximamente: 'Wkrótce'
  },
  fr: {
    tendencias: 'Tendances',
    peliculas_favoritas: 'Films favoris',
    populares: 'Populaires',
    proximamente: 'Bientôt'
  }
};

function cambiarIdiomaTextoSlider(idioma) {
  const textoSlider = traduccionesSlider[idioma];
  if (!textoSlider) {
    console.warn(`Idioma no soportado: ${idioma}`);
    return;
  }


  const tendSlider = document.querySelector('.slider-title-tendencias');
  const popSlider = document.querySelector('.slider-title-populares');
  const proxSlider = document.querySelector('.slider-title-proximamente');
  const favSlider = document.querySelector('.slider-title-peliculas-favoritas'); // Verifica que esta clase esté correcta en tu HTML



  if (tendSlider) tendSlider.textContent = textoSlider.tendencias;
  if (popSlider) popSlider.textContent = textoSlider.populares;
  if (proxSlider) proxSlider.textContent = textoSlider.proximamente;
  if (favSlider) favSlider.textContent = textoSlider.peliculas_favoritas;
}

// Variables para manejar cambio de idioma
const languageSwitch = document.getElementById('languageSwitch');
const langLabels = ['es', 'en', 'pl', 'fr'];  // Códigos de idiomas
let currentIndex = 0;

// Leer idioma guardado o usar por defecto
const savedIdioma = localStorage.getItem('idioma');
if (savedIdioma) {
  const index = langLabels.indexOf(savedIdioma);
  currentIndex = index !== -1 ? index : 0;
}

// Actualizar estilos de las etiquetas al idioma activo
function updateLabel() {
  const spans = document.querySelectorAll('#languageSwitch + label span');
  spans.forEach((span, i) => {
    if (i === currentIndex) {
      span.style.fontWeight = 'bold';
      span.style.color = 'gray';
    } else {
      span.style.fontWeight = 'normal';
      span.style.color = 'white';
    }
  });
}

// Variable global para saber si estás en detalle
let currentMovieId = null;

// Actualizar contenido con el nuevo idioma
function actualizarPeliculas() {
  const idioma = langLabels[currentIndex];
  localStorage.setItem('idioma', idioma);

  cambiarIdiomaTextos(idioma);
  cambiarIdiomaTextoSlider(idioma);
  cambiarIdiomaNavbar(idioma);
  cambiarIdiomaFooter(idioma);
  cambiarIdiomaBotones(idioma) 
 bannerDinamicoTMDb(idioma);
 cambiarIdiomaBotonesbaner(idioma);







  getTredingMovies(idioma);
  getMoviesProximmamente(idioma);
  getPopularMovies(idioma);
  getCategoriesPreview(idioma);
  generarGridMoviesTendencias(idioma);
 generarGridMoviesPopulares(idioma);
 generarGridMoviesProximamente(idioma);
  getMoviesCategory(idioma);





  // Si estás en vista de detalle, recargar la película actual
  const visible = !movieDetailSection.classList.contains('d-none');
  if (visible && currentMovieId) {
    getMovieDetailsById(currentMovieId);
  }
}

// Evento click para cambiar idioma
languageSwitch.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % langLabels.length;
  updateLabel();
  actualizarPeliculas();
});

// Al iniciar la página, actualizar labels y cargar películas
updateLabel();
actualizarPeliculas();