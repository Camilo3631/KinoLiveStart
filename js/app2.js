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
    let { data } = await api('/movie/upcoming', { params: { language: 'es' } });
    if (!data.results || data.results.length === 0) {
      ({ data } = await api('/movie/upcoming', { params: { language: 'en-US' } }));
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
    if (!data.results || data.results.length === 0) {
      ({ data } = await api('/movie/popular', { params: { language: 'en-US' } }));
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


let totalPeliculasMostradasBuscadas = 0;
const limitePeliculasBuscadas = 160;
let peliculasMostradasBusquedas = [];

// Función asincrona para obtener la película según su búsqueda
const getMoviesSearch = async (query) => {

  try {
    const { data } = await api('/search/movie', {
      params: { query }
    });

    const movies = data.results;
    limitePeliculasBuscadas >= data.totalPeliculasMostradasBuscadas;
    const container = document.querySelector('#search-section .container');
    const title = document.querySelector('.search-title');


    // Limpiar el contenido anterior
    container.innerHTML = ``;

    // Limpiar otros titulos si hay 
    const gridTitlte = document.querySelector('.grid-category-title');
    if (gridTitlte) gridTitlte.textContent = '';

    // Ocultar otras secciones
    if (categoryGridSection) categoryGridSection.classList.add('d-none');

    // Procesar cada película
    movies.forEach(movie => {
      if (!movie.poster_path || totalPeliculasMostradasBuscadas >= limitePeliculasBuscadas) return;

      const movieElement = document.createElement('div');
      movieElement.classList.add('movie-card', 'mb-4');

      const imgElement = document.createElement('img');
      imgElement.classList.add('img-fluid', 'rounded');
      imgElement.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`); // Intenta cargar la imagen real
      imgElement.onerror = () => { // En caso de error, establece la imagen por defecto
        imgElement.setAttribute('src', 'img/Brak OBRAZU.png');
      }

      movieElement.innerHTML = ` 
       <h5>${movie.title}</h5>
      `;

      movieElement.prepend(imgElement);  // Añadir la imagen antes del título

      // 🔥 Llamamos a lazyLoader después de agregar las imágenes dinámicamente
      lazyLoader();

      // Añadir evento de clic para redigir
      movieElement.addEventListener('click', () => {
        history.pushState(null, '', `#movie=${movie.id}`);

      });

      // Añadir el elemnto de la película la contendor
      container.appendChild(movieElement);
      totalPeliculasMostradasBuscadas++;
    });

    // Ocultar el home  y demás secciónes
    bannerSection.classList.add('d-none');
    tendenciasSection.classList.add('d-none');
    popularesSection.classList.add('d-none');
    likedSection.classList.add('d-none');
    proximamenteSection.classList.add('d-none');

    // Mostrar la sección de búsqueda
    searchSection.classList.remove('d-none');

    // Cambiar el titulo de lo que búscamos
    title.textContent = decodeURIComponent(query);

    // Mostrar solo el bóton de volver
    toggleButtonsVisibility('back');
  } catch (error) {
    console.error('Error al buscar películas:', error);
  }
};

// Función para ocultar o mostrar los bótones según la seccíon
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

// Función para el bóton de volver
const volverBtn = document.getElementById('back-btn');
volverBtn.addEventListener('click', () => {
  // Simula el clic del botón de atrás del navegador
  window.history.back();
});

// Función para volver al home
const homeBtn = document.getElementById('home-btn');
homeBtn.addEventListener('click', () => {
  // Mostrar todas las secciónes del home y ocultar la sección de búsqueda
  bannerSection.classList.remove('d-none')
  tendenciasSection.classList.remove('d-none');
  popularesSection.classList.remove('d-none');
  searchSection.classList.add('d-none');

  // Mostrar solo el botón de 'Volver al Home'
  toggleButtonsVisibility('home');

});

// Función de paginante de serchmovies (Clasure)
const getPaginatedMoviesBySearch = (query) => {
  let page = 2;
  const maxPages = 8;  // Maximo de páginas buscadas
  const seenMovieIds = new Set() // Evita duplicaciónes

  // Manejador del scroll infinito
  async function CargarMasPeliculas() {
    // No carar más sí alcanza el limite de películas o de páginas
    if (totalPeliculasMostradasBuscadas >= limitePeliculasBuscadas || page > maxPages) return;

    try {
      const { data } = await api('/search/movie', {
        params: { query, page }
      });

      const movies = data.results;
      page++; // Incrementar página para la próxima vez

      const container = document.querySelector('#search-section .container');

      movies.forEach(movie => {
        if (!movie.poster_path || totalPeliculasMostradasBuscadas >= limitePeliculasBuscadas) return;
        if (seenMovieIds.has(movie.id)) return;

        seenMovieIds.add(movie.id);

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-card', 'mb-4');

        const imgElement = document.createElement('img');
        imgElement.classList.add('img-fluid', 'rounded');
        imgElement.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
        imgElement.onerror = () => {
          ;
          imgElement.setAttribute('src', 'img/Brak OBRAZU.png');
        };

        movieElement.innerHTML = `<h5>${movie.title}</h5>`;
        movieElement.prepend(imgElement);

        movieElement.addEventListener('click', () => {
          history.pushState(null, '', `#movie=${movie.id}`)
        })

        container.appendChild(movieElement);
        totalPeliculasMostradasBuscadas++;
      });

    } catch (error) {
      console.error('Error al cargar más películas:', error);
    }
  }

  // Scroll interno 
  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      CargarMasPeliculas();
    }
  }

  // Registrar el scroll
  window.addEventListener('scroll', onScroll);

};





let totalPeliculasCargadasCategory = 0;
const limitePeliculasCategory = 80;
const seenMovieIds = new Set(); // también global para evitar duplicados

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
          page: 1,
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

    // Cambiar el titulo de la categoría
    const categoryTitle = document.querySelector('.grid-category-title');
    categoryTitle.textContent = `Películas por categoría ${genereMap[id]}`;

    // Ocultar los skeletons  y mostrar películas
    ocultarskeletoncategory();
    moviesContainer.innerHTML = '';

    const peliculasParaMostrar = allMovies.slice(0, limitePeliculasCategory);



    peliculasParaMostrar.forEach(movie => {
      // Crear el elemento de imagen con manejo de error
      const imgElement = document.createElement('img');
      imgElement.classList.add('img-fluid', 'rounded');
      imgElement.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`);

      // Si la imagen falla, se carga una imagen por defecto
      imgElement.onerror = () => {
        imgElement.setAttribute('src', 'img/Brak OBRAZU.png');
      };

      // Crear el título de la película
      const movieTitle = document.createElement('h5');
      movieTitle.textContent = movie.title;

      // Crear el enlace a la página de la película
      const movieLink = document.createElement('a');
      movieLink.href = `https://www.themoviedb.org/movie/${movie.id}`;
      movieLink.target = '_black';

      // Crea la targeta de película y añadir elementos
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.appendChild(imgElement);
      movieCard.appendChild(movieTitle);
      movieCard.appendChild(movieLink);

      // Agregar el evento de clic para el historial
      movieCard.addEventListener('click', () => {
        history.pushState(null, 'òijh', '#movie' + movie.id);
      });

      // Añadir la tarjeta de película al contenedor
      moviesContainer.appendChild(movieCard);
    });


    totalPeliculasCargadasCategory = peliculasParaMostrar.length;
    // 🔥 Llamamos a lazyLoader después de agregar las imágenes dinámicamente
    lazyLoader();

    // Mostrar botón "Ver menos"
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

  } catch {
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
  await cargarPeliculasTendecias();
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
let paginaActualTendencias = 2; // Empieza en la 2 porque la 1 ya está cargada
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

// Cargar películas Tendencias sin borrar las anteriores, evitando duplicados
const cargarPeliculasTendecias = async () => {
  if (
    paginaActualTendencias > maxPaginasTendencias ||
    totalPeliculasMostradasTendecias >= limitePeliculasTendencias ||
    cargandoPeliculasTendencias
  ) return;

  cargandoPeliculasTendencias = true;
  mostrarSkeletonstendecias();

  try {
    let response = await api('trending/movie/week', { params: { language: 'es', page: paginaActualTendencias } });

    if (!response.data.results || response.data.results.length === 0) {
      response = await api('trending/movie/week', { params: { language: 'en-US', page: paginaActualTendencias } });
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

// Generar eventos para botones mostrar más / mostrar menos
const generarGridMoviesTendencias = () => {
  showMoreTendenciasButton.addEventListener('click', () => {
    mostrarGridTendencias();

    // Resetear estado y limpiar solo al iniciar el grid (no en cada carga)
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
  for (let i = 0; i < 20; i++) {
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

  try {
    let response = await api('/movie/popular', {
      params: { language: 'es', page: paginaActualPopulares }
    });

    if (!response.data.results || response.data.results.length === 0) {
      response = await api('/movie/popular', {
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

  try {
    let response = await api('/movie/upcoming', {
      params: { language: 'es', page: paginaActualProximamente }
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
  const  MoviesArray = Object.values(likedMovies); // Convertir a array

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

    heartIcon.addEventListener('click', e  => {
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















    




