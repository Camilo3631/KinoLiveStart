
  // Obtenemos las secciones y botones
  const showMoreTendenciasButton = document.getElementById('show-more-tendencias');
  const showLessTendenciasButton = document.getElementById('show-less-tendencias');
  const bannerSection = document.getElementById('banner');
  const popularesSection = document.getElementById('populares');
  const proximamenteSection = document.getElementById('proximamente');
  const categoryGridSection = document.getElementById('category-grid-container');
  const gridTendenciasSection = document.getElementById('grid-tendencias');
  const movieSliders = document.querySelectorAll('.movie-slider'); // Selección de los sliders


  const generarGridMoviesTendencias = () => {
    // URL base de la API de TMDb
    const apiUrlEs = 'https://api.themoviedb.org/3/trending/movie/week?api_key=030eada77e494e280d243a5356401f1a&language=es';
    const apiUrlEn = 'https://api.themoviedb.org/3/trending/movie/week?api_key=030eada77e494e280d243a5356401f1a&language=en-US';
    
    // Acción al hacer clic en "Ver más" para mostrar el grid
    showMoreTendenciasButton.addEventListener('click', async function () {
      // Ocultamos las secciones y los sliders
      bannerSection.classList.add('d-none');
      popularesSection.classList.add('d-none');
      proximamenteSection.classList.add('d-none');
      categoryGridSection.classList.add('d-none');
      movieSliders.forEach(slider => slider.classList.add('d-none'));
  
      // Mostramos el grid de tendencias
      gridTendenciasSection.classList.remove('d-none');
  
      // Limpiamos el contenedor antes de llenarlo
      const moviesContainer = gridTendenciasSection.querySelector('.movies-container');
      moviesContainer.innerHTML = ''; // Limpiar cualquier contenido anterior
  
      try {
        let response = await fetch(apiUrlEs);
        let data = await response.json();
  
        // Si no se obtienen resultados en español, intentamos obtenerlos en inglés
        if (!data.results || data.results.length === 0) {
          response = await fetch(apiUrlEn);
          data = await response.json();
        }
  
        // Verificamos si la respuesta contiene películas
        if (data.results && data.results.length > 0) {
          data.results.slice(0, 20).forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card'); // Aplicamos la clase movie-card-grid
            movieCard.innerHTML = `
              <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
              <h4>${movie.title}</h4>
            `;
            moviesContainer.appendChild(movieCard);
          });
        }
      } catch (error) {
        console.error('Error al obtener las películas:', error);
      }
  
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
  };
  
  generarGridMoviesTendencias();
  