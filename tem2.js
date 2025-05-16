/ Variable para mostrar peliculas ya mostrada proximamente
  let peliculasMostradasProximamente = [];
  let paginaActualProximamente = 2;
  const maxPaginasProximamente = 5;
  let cargandoPeliculasProximamente = false;
  
  let totalPeliculasMostradasProximamente = 0;
  const limitePeliculasProximamente = 80;


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


  // Cargar películas Proximamente
const cargarPeliculasProximamente = async () => {
  if (paginaActualProximamente > maxPaginasProximamente || totalPeliculasMostradasProximamente >= limitePeliculasProximamente || cargandoPeliculasProximamente) return;

 

  cargandoPeliculasProximamente = true;
   mostrarSkeletonsproximamnete();

  try {
    // Hacemos la petición de películas 
    let response = await api('/movie/upcoming', { params: { language: 'es', page: paginaActualProximamente } });

    // Si no hay resultados en español, intentamos obetnerlos en inglés
    if (!response.data.results || response.data.results.length === 0) {
      response = await api('/movie/upcoming', { params: { language: 'en-US', page: paginaActualProximamente } });
    }

    if (response.data.results && response.data.results.length > 0) {
      const peliculasNuevasProximamente = response.data.results.filter(movie => !peliculasMostradasProximamente.includes(movie.id));

      const moviesContainer = gridProximamenteSection.querySelector('.movies-grid-container-proximamente');

      for (const movie of peliculasNuevasProximamente) {
        if (totalPeliculasMostradasProximamente >= limitePeliculasProximamente) break;

        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
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
      console.warn('No se encontraron películas populares para mostrar.');
    }
  } catch (error) {
    console.error('Error al obtener películas populares:', error);
  }

  ocultarSkeletonproximamente();
  createObserver();
  cargandoPeliculasProximamente = false;
};

// Scroll infinito para populares
const scrollHandlerProximamente = () => {
  if (cargandoPeliculasProximamente) return;

  const scrollY = window.scrollY;
  const altura = document.documentElement.scrollHeight - window.innerHeight; // Altura del scroll

  if (scrollY >= altura - 10) { // Altura del scroll
    cargarPeliculasProximamente();
  }
};


// Función para generar el grid de película
const generarGridMovieProximamente = () => {
  showMoreProximamneteButton.addEventListener('click', () => {
    mostrarGridProximamente();

     // Resetear datos para una nueva carga
     paginaActualProximamente = 2;
     peliculasMostradasProximamente = [];
     totalPeliculasMostradasProximamente = 0;
     gridProximamenteSection.querySelector('.movies-grid-container-proximamente');

    cargarPeliculasProximamente();
    window.addEventListener('scroll', scrollHandlerProximamente);
  });

  showlessproximamenteButton.addEventListener('click', () => {
    ocultarProximamente();


    // Limpiar scroll listener y estado
    window.removeEventListener('scroll', scrollHandlerProximamente);
    paginaActualProximamente = 2;
    peliculasMostradasProximamente = [];
    totalPeliculasMostradasProximamente = 0;
    gridProximamente.querySelector('.movies-grid-container-proximamente');
  });
};

generarGridMovieProximamente();





