// Importamos la api_key desde secrests.js 
import { api_key } from './secrets.js';     // Asegúrate de que la ruta sea correcta
// Imprimimos la URL con la API key concatenada
console.log(`https://api.themoviedb.org/3/movie/550?api_key=${api_key}`);