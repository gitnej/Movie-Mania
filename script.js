const API_KEY = 'ec332d19e6fed067df0160ce34067cc4';
const trendingMoviesContainer = document.getElementById('trending-movies');
const watchlistMoviesContainer = document.getElementById('watchlist-movies');
const searchInput = document.getElementById('search');
const suggestionsContainer = document.getElementById('suggestions');
const movieDetailsModal = document.getElementById('movie-details');
const movieTitle = document.getElementById('movie-title');
const movieSynopsis = document.getElementById('movie-synopsis');
const movieGallery = document.getElementById('movie-gallery');
const closeModal = document.querySelector('.close');
const addToWatchlistButton = document.getElementById('add-to-watchlist');

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Fetch trending movies
async function fetchTrendingMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`);
    const data = await response.json();
    displayMovies(data.results, trendingMoviesContainer);
}

// Display movies in a container
function displayMovies(movies, container) {
    container.innerHTML = '';
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="showMovieDetails(${movie.id})">View Details</button>
        `;
        container.appendChild(movieElement);
    });
}

// Show detailed information for a selected movie
async function showMovieDetails(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await response.json();
    movieTitle.textContent = movie.title;
    movieSynopsis.textContent = movie.overview;
    movieGallery.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">`;
    movieDetailsModal.style.display = 'flex';
    addToWatchlistButton.onclick = () => addToWatchlist(movie);
}

// Add movie to the watchlist
function addToWatchlist(movie) {
    if (!watchlist.some(w => w.id === movie.id)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        displayWatchlist();
    }
}

// Display movies in the watchlist
function displayWatchlist() {
    watchlistMoviesContainer.innerHTML = '';
    watchlist.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="removeFromWatchlist(${movie.id})">Remove</button>
        `;
        watchlistMoviesContainer.appendChild(movieElement);
    });
}

// Remove a movie from the watchlist
function removeFromWatchlist(movieId) {
    watchlist = watchlist.filter(movie => movie.id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist();
}

// Search for movies as the user types
searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    if (query.length > 2) {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}`);
        const data = await response.json();
        displayMovies(data.results, trendingMoviesContainer);
    }
});

// Close the modal
closeModal.onclick = () => {
    movieDetailsModal.style.display = 'none';
};

// Initialize app
fetchTrendingMovies();
displayWatchlist();
