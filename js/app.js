// Creamos una instancia de axios
const api = axios.create( {
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

// Función asíncona para obetener peliculas en tendecias
const getTredingMovies = async () => {
    // Buscar el contenedor donde se muestran las peliculas
    const movieContainer = document.querySelector('.movies-container');
    if (!movieContainer) {
        console.error('No se encontró el contendor de peliculas.');
        return;
    }
    try {
         
        const { data } = await api('trending/movie/week', { params: { language: 'es' } });

         // Si no hay resultados en Español, intenta obtener en inglés
         if (!data.results || data.results.length === 0) {
            ({ data } = await api('trending/movie/week', { params: { language: 'en-US' } }));
        }
    

        const movies = data.results;   // Almacenar la respuesta las peliculas
        movieContainer.innerHTML = ''; // limpia cualquier contendio previo del contenedor

        // Mostrar las 6 primeras peliculas
        movies.slice(0, 6).forEach(movie => {  // limitar a 6 peliculas
            const movieCard = document.createElement('div');  // Crear el contendor de cada fila
            movieCard.classList.add('movie-card'); // Agregar la clase 'move-card'

            // Rellenar el contendor con la imagen  y titúlo de la pelicula
            movieCard.innerHTML = ` 
             <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
              <h5>${movie.title}</h5>
              
            `;

            // Agregar la tarjeta de cada pelicula al contendor
            movieContainer.appendChild(movieCard);

        });

    } catch (error) {
        console.error('Ocurrió un problema:', error); // Si ocurrio en un error mostrarlo en la consola)

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

    }  catch (error) {
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




const getMoviesCategory = async (id) => { // Solo recibe el id
    try {
      const fetchByLanguage = async (lang) => {
        const response = await api.get('discover/movie', {
          params: {
            with_genres: id,
            with_original_language: lang,
          },
        });
        return response.data.results || [];
      };

      const [pelisES, pelisEN] = await Promise.all([
        fetchByLanguage('es'),
        fetchByLanguage('en'),
      ]);

      const allMovies = [...pelisES, ...pelisEN];

      if (allMovies.length === 0) {
        throw new Error('No se encontraron películas en español o inglés.');
      }

      // Encontrar el nombre de la categoría usando su id
      const genereMap = {
        28: 'Accion',
        12: 'Aventura',
        16: 'Animación',
        35: 'Comedia',
        80: 'Crimen',
        99: 'Documental',
        18: 'Drama',
        10751: 'Familiar',
        14: 'Fantasia',
        36: 'Historia',
        27: 'Terror',
        10402: 'Música',
        9648: 'Misterio',
        10749: 'Romance',
        878: 'Ciencia ficcion',
        10770: 'Pelicula de tv',
        53: 'Suspenso',
        10752: 'Bélica',
        37: 'Western',
      };

      const categoryTitle = document.querySelector('.grid-category-title');
      if (genereMap[id]) {
        categoryTitle.textContent =  `Peliculas por categoría: ${genereMap[id]}`;
      }
      
   

      
      bannerSection.classList.add('d-none');
      popularesSection.classList.add('d-none');
      tendenciasSection.classList.add('d-none');
      proximamenteSection.classList.add('d-none');
      movieSliders.forEach(slider => slider.classList.add('d-none'));

      const categoryGridSectionElem = document.getElementById('category-grid-container');
      categoryGridSectionElem.classList.remove('d-none');

      const moviesContainer = categoryGridSectionElem.querySelector('.movies-container');
      moviesContainer.innerHTML = '';

      allMovies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          <h5>${movie.title}</h5>
          <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank"></a>
        `;
        moviesContainer.appendChild(movieCard);
      });

      const showLessCategoryGridButton = document.getElementById('show-less-category-grid');
      showLessCategoryGridButton.classList.remove('d-none');

      showLessCategoryGridButton.addEventListener('click', function () {
        bannerSection.classList.remove('d-none');
        popularesSection.classList.remove('d-none');
        proximamenteSection.classList.remove('d-none');
        categoryGridSectionElem.classList.add('d-none');
        movieSliders.forEach(slider => slider.classList.remove('d-none'));
        showLessCategoryGridButton.classList.add('d-none');
        location.hash = '';
      });

    } catch (error) {
      console.error('Error al generar el grid de películas:', error);
    }
};


// Función asíncrona para el buscador
const getMoviesSearch = async  (query) => {

  try  {
 
    const { data } = await api('/search/movie', {

      params: {
         query
     },

    });

    const movies = data.results;
    const container = document.querySelector('#category-grid-container .movies-container');
    const title = document.querySelector('.grid-category-title');

    // Limpiamos el conteniodo anterior
    container.innerHTML = '';

    movies.forEach(movie => {
      if (!movie.poster_path) return;

      const movieElement = document.createElement('div');
      movieElement.classList.add('movie-card', 'mb-4');

      movieElement.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="img-fluid rounded">
          <h5>${movie.title}</h5>
       `;

      container.appendChild(movieElement);

    })

    // Ocultamos el home
    bannerSection.classList.add('d-none');
    tendenciasSection.classList.add('d-none');
    popularesSection.classList.add('d-none');
    proximamenteSection.classList.add('d-none');

    // Mostrar resultados
    categoryGridSection.classList.remove('d-none');

    // Cambiar el titulo del texto buscado
    title.textContent = decodeURIComponent(query);


  } catch (error) {
    console.error('Error al buscar películas:', error);

  }

};

// Botón de volver
const volverBtn =  document.getElementById('show-less-category-grid');

volverBtn.addEventListener('click', () => {
   // Ocultar sección de resultados
   categoryGridSection.classList.add('d-none');

   // Mostrar el home
   bannerSection.classList.remove('d-none');
   tendenciasSection.classList.remove('d-none');
   popularesSection.classList.remove('d-none');
   proximamenteSection.classList.remove('d-none');

   // Limpiar resultados
   const container = document.querySelector('#category-grid-container .movies-container');
   container.innerHTML = '';

   // Restaurar título
   const title = document.querySelector('.grid-category-title');
   title.textContent = 'Películas por categoría';
});






















