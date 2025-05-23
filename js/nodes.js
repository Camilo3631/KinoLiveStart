const movieDetailSection = document.getElementById('movieDetail');
const movieBackground = document.getElementById('movie-background');
const moviePoster = document.getElementById('movie-poster');
const movieTitle = document.getElementById('movie-title');
const movieDescription = document.getElementById('movie-description');
const movieReleaseDate = document.getElementById('movie-release-date');
const goBackButton = document.getElementById('go-back');

// Secciones para mostrar y ocultar (grids y sliders)
const bannerSection = document.getElementById('banner');
const gridTendenciasSection = document.getElementById('grid-tendencias');
const gridPopularesSection = document.getElementById('grid-populares');
const gridProximamenteSection = document.getElementById('grid-proximamente');
const searchSection = document.getElementById('search-section');
const movieSliders = document.querySelectorAll('.movie-slider');
const movieContainer = document.querySelector('.movies-container');

// Obtén las secciones y botones de manera global
const showMoreTendenciasButton = document.getElementById('show-more-tendencias');
const showLessTendenciasButton = document.getElementById('show-less-tendencias');
const showlesspopulareButton = document.getElementById('show-less-populares');
const showmorepopularButton = document.getElementById('show-more-populares');
const showlessproximamenteButton = document.getElementById('show-less-proximamente');
const showMoreProximamneteButton = document.getElementById('show-more-proximamente');
const tendenciasSection = document.getElementById('tendencias');
const popularesSection = document.getElementById('populares');
const proximamenteSection = document.getElementById('proximamente');
const likedSection = document.getElementById('liked');
const categoryGridSection = document.getElementById('category-grid-container');

const botones = document.querySelectorAll('.btn-polish-white-ms-3');
const categoryTitle = document.querySelector('.grid-category-title');



// === Formulario de búsqueda ===
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-btn');
