searchButton.addEventListener('click', () => {
  location.hash = '#search';
}, { once: true });

showMoreTendenciasButton.addEventListener('click', () => {
  location.hash = '#trends';
}, { once: true });


botones.forEach(boton => {
  boton.addEventListener('click', () => {
      location.hash = '#home';
  });
})

// Invocamos la función y llamamos al evento
window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);


// Funcion para cuando carge el nevador y llame el has
function navigator() {
  // Imprimimos en la consola el objeto location 
  console.log({ location });

  // Preguntamos si el hash está en la sección de trends
  if (location.hash.startsWith('#trends')) {
    trendsPage();

    // Preguntamos si el hash está en la sección de búsqueda
  } else if (location.hash.startsWith('#search=')) {
    searchPage();

    // Preguntamos si el hash empieza con #movie= (detalles de una película)
  } else if (location.hash.startsWith('#movie=')) {
    movieDetailsPage();

    // Preguntamos si el hash empieza con #category= (categorías de las películas)
  } else if (location.hash.startsWith('#category=')) {
    categoriesPage();

    // Si no coincide con nada, mostramos el home
  } else {
    homePage();

  }

};

// Generamos un arrow function para homePage
const homePage = () => {
  console.log('Home!!');
  // Mostrar secciones principales del home
  bannerSection.classList.remove('d-none');
  popularesSection.classList.remove('d-none');
  proximamenteSection.classList.remove('d-none');
  tendenciasSection.classList.remove('d-none');
  
  

  movieDetailSection.classList.add('d-none');
  categoryGridSection.classList.add('d-none')

  // Búscador simpre visible
  searchForm.classList.remove('d-none');


  // Invocamos las funciones
  getCategoriesPreview();
  getTredingMovies();
  generarGridMoviesTendencias();

};

// Generamos un arrow function para categoriesPage
const categoriesPage = () => {
  console.log('Categories!!');
    // Búscador simpre visible
    searchForm.classList.remove('d-none');
    tendenciasSection.classList.remove('d-none');


    movieDetailSection.classList.add('d-none');

    getTredingMovies();
    getCategoriesPreview();
    generarGridCategoryMovies();
    generarGridMoviesTendencias();
}

const movieDetailsPage = () => {
  console.log('Entrando a movieDetailsPage');

  // Mostrar siempre el formulario de búsqueda
  searchForm.classList.remove('d-none');

  // Guardamos cuál era la sección visible antes de los detalles
  if (!visibleSectionBeforeDetail) {
    if (!gridTendenciasSection.classList.contains('d-none')) {
      visibleSectionBeforeDetail = 'gridTendencias';
    } else if (!gridPopularessSection.classList.contains('d-none')) {
      visibleSectionBeforeDetail = 'gridPopulares';
    } else if (!gridProximamenteSection.classList.contains('d-none')) {
      visibleSectionBeforeDetail = 'gridProximamente';
    } else if ([...movieSliders].some(slider => !slider.classList.contains('d-none'))) {
      visibleSectionBeforeDetail = 'sliders';
    }
  }

  // Ocultar secciones principales y los sliders
  bannerSection.classList.add('d-none');
  gridTendenciasSection.classList.add('d-none');
  gridPopularessSection.classList.add('d-none');
  gridProximamenteSection.classList.add('d-none');
  categoryGridSection.classList.add('d-none');
  tendenciasSection.classList.add('d-none');
  popularesSection.classList.add('d-none');
  proximamenteSection.classList.add('d-none');
  movieSliders.forEach(slider => slider.classList.add('d-none'));

  // Mostrar la sección de detalles
  movieDetailSection.classList.remove('d-none');

  // Obtener el ID de la película desde la URL
  const [_, movieId] = location.hash.split('=');
  if (!movieId) return;

  // Obtener detalles de la película
  Api.get(`movie/${movieId}`, { params: { language: 'es' } })
    .then(res => {
      const movie = res.data;

      // Mostrar fondo y póster
      movieBackground.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
      moviePoster.innerHTML = `<img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">`;
      movieTitle.textContent = movie.title;
      movieDescription.textContent = movie.overview || 'Descripción no disponible.';
      movieReleaseDate.textContent = `Fecha de estreno: ${movie.release_date || 'N/A'}`;

      // Mostrar categorías
      const categoriesContainer = document.getElementById('movie-categories');
      categoriesContainer.innerHTML = '';
      if (movie.genres && movie.genres.length > 0) {
        categoriesContainer.innerHTML = '<h4>Categorías:</h4>';
        movie.genres.forEach(genre => {
          const btn = document.createElement('button');
          btn.textContent = genre.name;
          btn.className = 'btn btn-outline-m-1';
          categoriesContainer.appendChild(btn);
        });
      }

      // Mostrar películas similares (solo las primeras 4)
      const similaresContainer = document.getElementById('movie-similares');
      similaresContainer.innerHTML = '';

      Api.get(`movie/${movieId}/similar`, { params: { language: 'es' } })
        .then(similarRes => {
          const similarMovies = similarRes.data.results.slice(0, 4); // Limitar a 4 películas
          if (similarMovies.length > 0) {
            const row = document.createElement('div');
            row.className = 'row justify-content-center';

            const titleCol = document.createElement('div');
            titleCol.className = 'col-12 text-center mb-4';
            titleCol.innerHTML = '<h4 class="fw-bold">Películas similares</h4>';
            row.appendChild(titleCol);

            similarMovies.forEach(similar => {
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
          } else {
            console.log('No se encontraron películas similares.');
          }
        })
        .catch(err => {
          console.error('Error al obtener películas similares:', err);
        });
    })
    .catch(error => {
      console.error('Error al obtener detalles de la película:', error);
    });

  // Funcionalidad del botón "Volver"
  goBackButton.addEventListener('click', () => {
    movieDetailSection.classList.add('d-none');

    
    // Limpiar detalles de la película
    moviePoster.innerHTML = '';
    movieBackground.style.backgroundImage = '';
    document.getElementById('movie-categories').innerHTML = '';
    document.getElementById('movie-similares').innerHTML = '';

    // Restaurar la visibilidad del banner
    bannerSection.classList.remove('d-none');
    tendenciasSection.classList.remove('d-none');
    popularesSection.classList.remove('d-none');
    proximamenteSection.classList.remove('d-none');


    // Limpiar la variable que recuerda qué sección estaba visible
    visibleSectionBeforeDetail = null;

    getTredingMovies();
    getCategoriesPreview();
    generarGridMoviesTendencias();
  });
};


// Generamos un arrow function para searchPage
const searchPage = () => {
  console.log('Search!!');

   // Mostrar secciones principales del home
   bannerSection.classList.remove('d-none');
   tendenciasSection.classList.remove('d-none');
   popularesSection.classList.remove('d-none');
   proximamenteSection.classList.remove('d-none');
 
 
   movieDetailSection.classList.add('d-none');
   categoryGridSection.classList.add('d-none')
 
   // Búscador simpre visible
   searchForm.classList.remove('d-none');

   getTredingMovies();
   getCategoriesPreview();
   generarGridMoviesTendencias();
};



// Función para el slider y grid de tendencias
const trendsPage = () => {
  console.log('TRENDS!!');
  movieContainer.innerHTML = '';

   bannerSection.classList.add('d-none');
   proximamenteSection.classList.add('d-none');
   popularesSection.classList.add('d-none');
   getTredingMovies();
   getCategoriesPreview();
   generarGridMoviesTendencias();

   movieDetailSection.classList.add('d-none');
   categoryGridSection.classList.add('d-none')
 
   // Búscador simpre visible
   searchForm.classList.remove('d-none');

};
