document.addEventListener('DOMContentLoaded', function () {
  // Obtenemos las secciones y botones
  const showMoreTendenciasButton = document.getElementById('show-more-tendencias');
  const showLessTendenciasButton = document.getElementById('show-less-tendencias');
  const bannerSection = document.getElementById('banner');
  const popularesSection = document.getElementById('populares');
  const proximamenteSection = document.getElementById('proximamente');
  const categoryGridSection = document.getElementById('category-grid-container');
  const gridTendenciasSection = document.getElementById('grid-tendencias');
  const movieSliders = document.querySelectorAll('.movie-slider'); // Selección de los sliders

  // Objeto de películas (20 películas ejemplo)
  const gridTendencias = [
    { 
      titulo: 'Pelicula 1', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_1.jpg',
      enlace: 'https://www.ejemplo.com/pelicula1'
    },
    { 
      titulo: 'Pelicula 2', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_2.jpg',
      enlace: 'https://www.ejemplo.com/pelicula2'
    },
    { 
      titulo: 'Pelicula 3', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_3.jpg',
      enlace: 'https://www.ejemplo.com/pelicula3'
    },
    { 
      titulo: 'Pelicula 4', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_4.jpg',
      enlace: 'https://www.ejemplo.com/pelicula4'
    },
    { 
      titulo: 'Pelicula 5', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_5.jpg',
      enlace: 'https://www.ejemplo.com/pelicula5'
    },
    { 
      titulo: 'Pelicula 6', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_6.jpg',
      enlace: 'https://www.ejemplo.com/pelicula6'
    },
    { 
      titulo: 'Pelicula 7', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_7.jpg',
      enlace: 'https://www.ejemplo.com/pelicula7'
    },
    { 
      titulo: 'Pelicula 8', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_8.jpg',
      enlace: 'https://www.ejemplo.com/pelicula8'
    },
    { 
      titulo: 'Pelicula 9', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_9.jpg',
      enlace: 'https://www.ejemplo.com/pelicula9'
    },
    { 
      titulo: 'Pelicula 10', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_10.jpg',
      enlace: 'https://www.ejemplo.com/pelicula10'
    },
    { 
      titulo: 'Pelicula 11', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_11.jpg',
      enlace: 'https://www.ejemplo.com/pelicula11'
    },
    { 
      titulo: 'Pelicula 12', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_12.jpg',
      enlace: 'https://www.ejemplo.com/pelicula12'
    },
    { 
      titulo: 'Pelicula 13', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_13.jpg',
      enlace: 'https://www.ejemplo.com/pelicula13'
    },
    { 
      titulo: 'Pelicula 14', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_14.jpg',
      enlace: 'https://www.ejemplo.com/pelicula14'
    },
    { 
      titulo: 'Pelicula 15', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_15.jpg',
      enlace: 'https://www.ejemplo.com/pelicula15'
    },
    { 
      titulo: 'Pelicula 16', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_16.jpg',
      enlace: 'https://www.ejemplo.com/pelicula16'
    },
    { 
      titulo: 'Pelicula 17', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_17.jpg',
      enlace: 'https://www.ejemplo.com/pelicula17'
    },
    { 
      titulo: 'Pelicula 18', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_18.jpg',
      enlace: 'https://www.ejemplo.com/pelicula18'
    },
    { 
      titulo: 'Pelicula 19', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_19.jpg',
      enlace: 'https://www.ejemplo.com/pelicula19'
    },
    { 
      titulo: 'Pelicula 20', 
      imagen: 'https://image.tmdb.org/t/p/original/sample_movie_20.jpg',
      enlace: 'https://www.ejemplo.com/pelicula20'
    },
  ];

  // Acción al hacer clic en "Ver más" para mostrar el grid
  showMoreTendenciasButton.addEventListener('click', function () {
    // Ocultamos las secciones y los sliders
    bannerSection.classList.add('d-none');
    popularesSection.classList.add('d-none');
    proximamenteSection.classList.add('d-none');
    categoryGridSection.classList.add('d-none');
    movieSliders.forEach(slider => slider.classList.add('d-none'));

    // Mostramos el grid de tendencias
    gridTendenciasSection.classList.remove('d-none');

    // Llenamos el grid con las 20 películas dinámicamente
    const moviesContainer = gridTendenciasSection.querySelector('.movies-container');
    moviesContainer.innerHTML = ''; // Limpiar cualquier contenido anterior

    gridTendencias.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card-grid'); // Aplicamos la clase movie-card-grid
      movieCard.innerHTML = `
        <img src="${movie.imagen}" alt="${movie.titulo}">
        <h5>${movie.titulo}</h5>
        <a href="${movie.enlace}" target="_blank">Ver más</a>
      `;
      moviesContainer.appendChild(movieCard);
    });

    // Mostramos el botón de "Volver"
    showLessTendenciasButton.classList.remove('d-none');
  });

  // Acción al hacer clic en "Volver" para ocultar el grid y mostrar las secciones nuevamente
  showLessTendenciasButton.addEventListener('click', function () {
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
  });
});
