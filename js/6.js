

const languageSwitch = document.getElementById('languageSwitch');
const langLabels = ['es', 'en-US', 'pl' ,'fr']; // Códigos de idomas
let currentIndex = 0;

// leer idoma guardado o usado  por defecto
const savedIdioma = localStorage.getItem('idioma');
if (savedIdioma) {
  currentIndex = langLabels.indexOf(savedIdioma);
  if (currentIndex === -1) currentIndex = 0; // fallback
}

// Actualizar estilos de las etiquetas al idioma activo
const updateLabel = () =>  {
  const spans = document.querySelectorAll('#languageSwitch + label span')
  
  spans.forEach((span, i) => {
    if (i === currentIndex) {
      span.style.fontWeight = 'bold';
      span.style.color = 'gray';
    } else {
      span.style.fontWeight = 'normal';
      span.style.color = 'white';
    }
  })
}

// Llama a las funciones que cargan películas en el idioma actual
const actualizarPeliculas = () => {
  const idioma = langLabels[currentIndex];
  localStorage.setItem('idioma', idioma);

   // Aquí llamas tus funciones de carga pasando el idioma
   getTredingMovies(idioma);
   getMoviesProximmamente(idioma);
   getPopularMovies(idioma);




}

// Al hacer click en el switch, cambiar idioma y recargar películas
languageSwitch.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % langLabels.length;
  updateLabel()
  actualizarPeliculas();




})

// Al iniciar, actualizar labels y cargar películas en idioma guardado o por defecto
updateLabel();
actualizarPeliculas();


const traducciones = {
  es: {
    tendencias: 'Películas en Tendencia',
    populares: 'Películas Populares',
    proximamente: 'Películas Próximamente'
  },
  en: {
    tendencias: 'Trending Movies',
    populares: 'Popular Movies',
    proximamente: 'Upcoming Movies'
  },
  pl: {
    tendencias: 'Filmy na czasie',
    populares: 'Popularne filmy',
    proximamente: 'Nadchodzące filmy'
  },
  fr: {
    tendencias: 'Films Tendance',
    populares: 'Films Populaires',
    proximamente: 'Films à Venir'
  }
};



function cambiarIdiomaTextos(idioma) {
  const textos = traducciones[idioma];

  if (!textos) {
    console.warn(`Idioma no soportado: ${idioma}`);
    return;
  }

  document.querySelector('.grid-tendencias-title').textContent = textos.tendencias;
  document.querySelector('.grid-populares-title').textContent = textos.populares;
  document.querySelector('.grid-proximamente-title').textContent = textos.proximamente;
}








