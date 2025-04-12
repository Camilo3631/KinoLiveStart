// Invocamos la función y llamamos al evento
window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);


// Funcion para cuando carge el nevador y llame el has
function navigator() {
     // Imprimimos en la consola el objeto location 
     console.log( {location} );

          // Preguntamos si el hash está en la sección de trends
       if (location.hash.startsWith('#trends')) {
          trendsPage();
     
          // Preguntamos si el hash está en la sección de búsqueda
       } else if (location.hash.startsWith('#search=')) {
         searchPage();
 
           // Preguntamos si el hash empieza con #movie= (detalles de una película)
       }  else if (location.hash.startsWith('#movie=')) {
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
     getCategoriesPreview();
     getTredingMovies();

 };

 // Generamos un arrow function para categoriesPage
 const categoriesPage = () => {
    console.log('Categories!!');

 }


// Generamos un arrow function para movieDetailsPage
const movieDetailsPage = () => {
    console.log('Movie!!');
  };

  
// Generamos un arrow function para searchPage
const searchPage = () => {
    console.log('Search!!');
  };


// Generamos un arrow function para trendsPage
const trendsPage = () => {
    console.log('TRENDS!!');
  };
  



