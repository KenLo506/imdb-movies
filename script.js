const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const genre = document.getElementById("genre");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const leftZone = document.querySelector('.left-zone');
const rightZone = document.querySelector('.right-zone');

let page = 1; // Initialize page number
let selectedGenre = ""; // Initialize selected genre

getMovies(APIURL);

async function getMovies(url) {
    const resp = await fetch(`${url}&page=${page}${selectedGenre ? '&with_genres=' + selectedGenre : ''}`);
    const respData = await resp.json();
    console.log(respData);
    showMovies(respData.results);
}

function showMovies(movies) {
    main.innerHTML = "";

    movies.forEach((movie) => {
        const { poster_path, title, vote_average, overview, id } = movie;

        const movieEl = document.createElement("a"); 
        movieEl.href = `https://www.themoviedb.org/movie/${id}`; 
        movieEl.target = "_blank"; 
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
            />
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(
                    vote_average
                )}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                ${overview}
            </div>
        `;

        main.appendChild(movieEl);
    });

    // Enable/disable previous and next page buttons based on current page
    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = movies.length < 20;
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre = genre.value; // Update selected genre

    if (searchTerm && !selectedGenre) {
        getMovies(SEARCHAPI + searchTerm);
    } else if (selectedGenre) {
        getMovies(APIURL);
    } else {
        getMovies(APIURL);
    }

    search.value = "";
});

// Modify the genre change event listener to update the selected genre
genre.addEventListener("change", () => {
    page = 1; // Reset page number
    selectedGenre = genre.value;

    if (selectedGenre) {
        getMovies(APIURL);
    } else {
        getMovies(APIURL);
    }
});

// Previous page button functionality
prevPageBtn.addEventListener("click", () => {
    if (page > 1) {
        page--;
        getMovies(APIURL);
    }
});

// Next page button functionality
nextPageBtn.addEventListener("click", () => {
    page++;
    getMovies(APIURL);
});

leftZone.addEventListener('click', () => {
    if (page > 1) {
        page--;
        getMovies(APIURL);
    }
});

// Event listener for clicking on the right zone (acts as "Next" button)
rightZone.addEventListener('click', () => {
    page++;
    getMovies(APIURL);
});


document.getElementById('header-title').textContent = 'Top Features';