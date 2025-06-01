require('dotenv').config();
console.log("TMDB_API_KEY cargada:", process.env.TMDB_API_KEY);

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Middleware para loguear peticiones (opcional)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    params: {
        api_key: process.env.TMDB_API_KEY,
    }
});

// Helper para parsear page
function parsePage(page) {
    const p = parseInt(page);
    return (isNaN(p) || p < 1) ? 1 : p;
}

// Endpoint para películas próximas
app.get('/api/movies/upcoming', async (req, res) => {
    try {
        const language = req.query.language || 'es-ES';
        const page = parsePage(req.query.page);
        const response = await api.get('movie/upcoming', { params: { language, page } });
        res.json(response.data);
    } catch (error) {
        console.error('Error en /api/movies/upcoming:', error.message);
        res.status(500).json({ error: 'Error al obtener películas próximas' });
    }
});

// Endpoint para películas populares
app.get('/api/movies/popular', async (req, res) => {
    try {
        const language = req.query.language || 'es-ES';
        const page = parsePage(req.query.page);
        const response = await api.get('movie/popular', { params: { language, page } });
        res.json(response.data);
    } catch (error) {
        console.error('Error en /api/movies/popular:', error.message);
        res.status(500).json({ error: 'Error al obtener películas populares' });
    }
});

app.get('/api/movies/trending', async (req, res) => {
    try {
      const language = req.query.language || 'es-ES';
      const time_window = ['day', 'week'].includes(req.query.time_window) ? req.query.time_window : 'week';
      const page = parseInt(req.query.page) || 1;
  
      const response = await api.get(`trending/movie/${time_window}`, {
        params: { language, page },
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error en /api/movies/trending:', error.message);
      res.status(500).json({ error: 'Error al obtener películas trending' });
    }
  });
  
  
  
  

// Endpoint para categorías de películas
app.get('/api/genres', async (req, res) => {
    try {
        const language = req.query.language || 'es-ES';
        const response = await api.get('genre/movie/list', { params: { language } });
        res.json(response.data);
    } catch (error) {
        console.error('Error en /api/genres:', error.message);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
});

// Endpoint para búsquedas
app.get('/api/movies/search', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ error: 'El parámetro "query" es obligatorio' });
        }

        const language = req.query.language || 'es-ES';
        const page = parsePage(req.query.page);

        const response = await api.get('search/movie', {
            params: { query, language, page }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error en /api/movies/search:', error.message);
        res.status(500).json({ error: 'Error al buscar películas' });
    }
});

// Endpoint para películas por categoría
app.get('/api/movies/category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const language = req.query.language || 'es-ES';
        const page = parsePage(req.query.page);

        const response = await api.get('discover/movie', {
            params: {
                with_genres: categoryId,
                language,
                page,
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error en /api/movies/category/:id:', error.message);
        res.status(500).json({ error: 'Error al obtener películas por categoría' });
    }
});

// Detalles de una película (corregido aquí)
app.get('/api/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const language = req.query.language || 'es-ES';

        const response = await api.get(`movie/${id}`, { params: { language } });
        res.json(response.data);
    } catch (error) {
        console.error('Error en /api/movies/:id:', error.message);
        res.status(500).json({ error: 'Error al obtener detalles de la película' });
    }
});

// Películas recomendadas por ID
app.get('/api/movies/:id/recommendations', async (req, res) => {
    try {
        const { id } = req.params;
        const language = req.query.language || 'es-ES';

        const response = await api.get(`movie/${id}/recommendations`, { params: { language } });
        res.json(response.data);
    } catch (error) {
        console.error('Error en /api/movies/:id/recommendations:', error.message);
        res.status(500).json({ error: 'Error al obtener películas recomendadas' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
