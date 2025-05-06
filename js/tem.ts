
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
      categoryTitle.textContent = `Peliculas por categoría: ${genereMap[id]}`;
    }




    bannerSection.classList.add('d-none');
    popularesSection.classList.add('d-none');
    tendenciasSection.classList.add('d-none');
    proximamenteSection.classList.add('d-none');
    movieSliders.forEach(slider => slider.classList.add('d-none'));

    const categoryGridSectionElem = document.getElementById('category-grid-container');
    categoryGridSectionElem.classList.remove('d-none');

    const moviesContainer = categoryGridSectionElem.querySelector('.movies-grid-container');
    moviesContainer.innerHTML = '';

    allMovies.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');


      movieCard.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          <h5>${movie.title}</h5>
          <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank"></a>
        `;

      // Evita el scroll automático al cambiar el hash
      movieCard.addEventListener('click', () => {
        history.pushState(null, '', '#movie' + movie.id);
      });

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

