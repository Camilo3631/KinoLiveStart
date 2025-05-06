
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
  showlesspopulareButton.classList.remove('d-none');

};

// Función para mostrar los skeletons antes de cargar las películas
const mostrarSkeletonspopulares = () => {
  const moviesContainer = gridPopularesSection.querySelector('.movies-grid-container');
  for (let i = 0; i < 20; i++) {
    const skeleton = document.createElement('div');
    skeleton.classList.add('loading-card-grid');
    moviesContainer.appendChild(skeleton);
  }

};

// Función para ocultar los skeleton después de que las películas cargen 
const ocultarSkeletonspopulares = () => {
  const moviesContainer = gridPopularesSection.querySelector('.movies-grid-container');
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
            const moviesContainer = gridTendenciasSection.querySelectorall('.movies-grid-container');
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



const moviesContainer = gridPopularesSection.querySelector('.movies-grid-container-popular');
  const skeletons = moviesContainer.querySelectorAll('.loading-card-grid');
  skeletons.forEach(skeleton => skeleton.remove());




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

  // Mostrar gridPorximamente
  gridProximamenteSection.classList.remove('d-none');

  // Mostramos el botón de "Volver"
  showlessproximamenteButton.classList.remove('d-none');

};

// Ocultar gridProximamente
const ocultarProximamente = () => {
  // Volvemos a mostrar las secciones
  bannerSection.classList.remove('d-none');
  tendenciasSection.classList.remove('d-none');
  popularesSection.classList.remove('d-none');
  categoryGridSection.classList.add('d-none');

  // Volvemos a mostrar todos los sliders de películas
  movieSliders.forEach(slider => slider.classList.remove('d-none'));

  // Ocultamos el grid de Proximamente 
  gridProximamenteSection.classList.remove('d-none');

  // Ocultamos el botón de "Volver"
  showlessproximamenteButton.classList.remove('d-none');

};

// Función para mostrar los skeletons antes de cargar las películas
const mostrarSkeletonsproximamnete = () => {
  const moviesContainer = gridProximamenteSection.querySelector('.movies-grid-container-proximamente');
  for (let i = 0; i < 20; i++) { 
    const skeleton = document.createElement('div');
    skeleton.classList.add('loading-card-grid');
    moviesContainer.appendChild(skeleton)
  }

};

// Función para ocultar los skeleton después de que las películas cargen 
const ocultarSkeletonproximamente = () => {
  const moviesContainer = gridProximamenteSection.querySelector('.movies-grid-container');
  const skeleton = moviesContainer.querySelectorAll('.loading-card-grid');
  skeleton.forEach(skeleton => skeleton.remove());
  
};


// Función para generar el grid de películas
const generarGridMovieProximamente = () => {
    // Añadir el evento solo una vez
    if (showMoreProximamneteButton.dataset.eventAdded) {
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
                const movieCard = document.createComment('div');
                movieCard.classList.add('movie-card');

                movieCard.innerHTML = ` 
                    <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
                 <h5>${movie.title}</h5>
                `;

                 // Evita el scroll automático al cambiar el hash
                 movieCard.addEventListener('click', () => {
                    history.pushState(null, '',  '#movie' + movie.id)
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
          }  catch (error) {
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



