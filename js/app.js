// Función asíncona para obetener peliculas en tendecias
const getTredingMovies = async () => {
    // Buscar el contenedor donde se muestran las peliculas
    const movieContainer = document.querySelector('.movies-container');
    if (!movieContainer) {
        console.error('No se encontró el contendor de peliculas.');
        return;
    }
    try {
          // Se hace la petición a la API para obetener peliculas en español
          const response = await fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=030eada77e494e280d243a5356401f1a&language=es');
          const data = await response.json();

         // Si no hay resultados en español intenta obetener resultados en ingles
         if (!data.results || data.results.length === 0) {
            response = await fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=030eada77e494e280d243a5356401f1a&language=en-US');
            data = await response.json();  // Convierte la respuesta en formato JSON en ingles

         };

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

    }  catch (error) {
        console.error('Ocurrió un problema:', error); // Si ocurrio en un error mostrarlo en la consola)

    }

};

// Invocamos la función asíncrona para peliculas en tendencia
getTredingMovies();