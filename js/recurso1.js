
// Función para favourties
const likedMoviesList = () => {
    const item =   JSON.parse(localStorage.getItem('likedMovie'));

    let movies;


    if (item) {
      movies = item;

    }  else {
        movies = {};
    }

    
   return movies;



}


// Función para guardar en localStorage
const  likedMovie = (movie) => {

  const likedMovies = likedMoviesList();

  if (likedMovies[movie.id]) { 
      likedMovies[movie.id] = undefined; // Esto elimina la películ
  } else {
      likedMovies[movie.id] = movie; // Esto agrega la pelicula
  }  


  


  /*
  if (likedMovies[movie.id]) {
      console.log('la pelicula ya estaba en LocalStorage, deberiamos eliminarla')
      ;
      // removerla de LocalStorage();   
  }  else {
      console.log('la pelicula no estaba en localStorage, deberiamos agregarla')
      ;
      // Agregar la pelicula a LocalStorage();
  }  

  */



localStorage.setItem('likedMovie', JSON.stringify(likedMovies));


}












