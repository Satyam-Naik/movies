const apiKey = 'cf6bbf13';
let searchQuery = '';
let page = 1;
let movies = [];

const fetchMovies = async () => {
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${searchQuery}&page=${page}&apikey=${apiKey}`);
        const data = await response.json();
        if (data.Response == "True") {
            return data.Search; // Array of movies
        } else {
            alert("No movies found!");
            return [];
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
};

const displayMovies = (movies) => {
    const moviesContainer = document.getElementById('movies-container');
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        movieCard.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title} Poster" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p><strong>Year:</strong> ${movie.Year}</p>
                <button class="view-more-btn" data-movie-id="${movie.imdbID}">View More</button>
            </div>
        `;

        moviesContainer.appendChild(movieCard);
    });

    // Add event listeners to View More buttons
    document.querySelectorAll('.view-more-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const movieId = event.target.dataset.movieId;
            viewMoreDetails(movieId);
        });
    });
};

const searchMovies = (query) => {
    const filteredMovies = movies.filter(movie => movie.Title.toLowerCase().includes(query.toLowerCase()));
    document.getElementById('movies-container').innerHTML = ''; // Clear previous movies
    displayMovies(filteredMovies);
};

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent page reload
        searchQuery = document.querySelector('#name').value;
        if (searchQuery.trim()) {
            page = 1; // Reset page number for new search
            document.getElementById('movies-container').innerHTML = ''; // Clear previous results
            movies = await fetchMovies(); // Await the fetchMovies result
            // movies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year))
            if (movies.length) {
                displayMovies(movies);
            }
        } else {
            alert("Please enter a movie name!");
        }
    });

    document.getElementById('load-more-btn').addEventListener('click', async function() {
        page++; // Increment the page number
        const moreMovies = await fetchMovies();
        movies = movies.concat(moreMovies);
        // movies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year))
        document.getElementById('movies-container').innerHTML = '';
        if (movies.length) {
            displayMovies(movies);
        } else {
            alert("No more movies found!");
        }
    });

    document.getElementById('close-btn').addEventListener('click', function() {
        const sidePanel = document.getElementById('side-panel');
        sidePanel.style.display = 'none'; // Hide the side panel
    });

    document.getElementById('name').addEventListener('input', (event) => {
        searchMovies(event.target.value);
    });
});

const viewMoreDetails = async (movieId) => {
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=${apiKey}`);
        const data = await response.json();

        const iframe = document.getElementById('movie-details-iframe');
        iframe.srcdoc = `
            <h2>${data.Title} (${data.Year})</h2>
            <p><strong>Rated:</strong> ${data.Rated}</p>
            <p><strong>Released:</strong> ${data.Released}</p>
            <p><strong>Runtime:</strong> ${data.Runtime}</p>
            <p><strong>Genre:</strong> ${data.Genre}</p>
            <p><strong>Director:</strong> ${data.Director}</p>
            <p><strong>Actors:</strong> ${data.Actors}</p>
            <p><strong>Plot:</strong> ${data.Plot}</p>
            <p><strong>Languages:</strong> ${data.Language}</p>
            <h3>Ratings:</h3>
            <ul>
                ${data.Ratings.map(rating => `<li>${rating.Source}: ${rating.Value}</li>`).join('')}
            </ul>
        `;

        const sidePanel = document.getElementById('side-panel');
        sidePanel.style.display = 'block';
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
};