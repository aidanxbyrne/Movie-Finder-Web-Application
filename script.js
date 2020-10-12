
//VARIABLES
const apiKey = '5de7cfe50c166403acf5dd4f68334d90';

const searchInput = document.querySelector('#search');
const searchSubmit = document.querySelector('#submit');
const randomBtn = document.querySelector('#RandomMovie');
const resultHeading = document.querySelector('#result-heading');
const movieElm = document.querySelector('#movies');
const singleMovieElm = document.querySelector('#single-movie');
const modal = document.querySelector('#single-movie-modal');
const modalCloseBtn = document.querySelector('#ModalClose')


//EVENT LISTENERS
searchSubmit.addEventListener('submit', searchMovie);
movieElm.addEventListener('click', selectMovie);

//FUNCTIONS

//search movie and fetch from API
function searchMovie(e){
    e.preventDefault();

    //Clear single movie
    singleMovieElm.innerHTML = '';

    //Get Search term
    const term = searchInput.value;

    //Check for emput input
    if(term.trim()){
        //Fetch results from API
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${term}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            minimizeSearchArea();

            resultHeading.innerHTML = `<h2 class="color-white text-center">Search results for '${term}'</h2>`;

            //If there is no results
            if(data.total_results === 0){
                resultHeading.innerHTML = `<p class="color-white text-center">There are no search results for '${term}'. Please try again.</p>`;
            }
            else{
                data.results.forEach(movie => {
                    const movieTitle = movie.original_title;
                    const movieOverview = movie.overview;
                    const movieID = movie.id;

                    //Set Moview Poster
                    let moviePoster;
                    if(movie.poster_path != null){
                        moviePoster = `https://image.tmdb.org/t/p/w342/${movie.poster_path}`;
                    }
                    else{
                        moviePoster = "/assets/images/not-found.jpg";
                    }

                    //Convert Release Date to Irish Format
                    let movieDate = movie.release_date;
                    let releaseDay = movieDate.substring(8,10);
                    let releaseMonth = movieDate.substring(5, 7);
                    let releaseYear = movieDate.substring(0, 4);
                    movieDate = `${releaseDay}/${releaseMonth}/${releaseYear}`;

                    //Add movie to the page
                    movieElm.innerHTML += `
                        <div class="movie">
                            <img src=${moviePoster} alt="${movieTitle} Poster">
                            <div class="movie-info" data-movieID="${movieID}">
                                <h3 class="color-white">${movieTitle}</h3>
                                <p class="color-white">${movieDate}</p>
                            </div>
                        </div>
                    `;
                });
            }
        });

        //Clear Search Term
        searchInput.value = '';

        //Clear Previous Results
        if(movieElm.innerHTML !== ''){
            movieElm.innerHTML = '';
        }
    }
    else{
        //TODO: Convert to an on page alert
        alert('Please enter a search term');
    }

    console.log(term);
}


//Select Movie from Search
function selectMovie(e){
    //Check if user has clicked on a movie and pull the ID of the target
    let movieInfo;

    if(e.target.classList.contains('movie-info')){
        movieInfo = e.target;
    }
    else if(e.target.parentElement.classList.contains('movie-info')){
        movieInfo = e.target.parentElement;
    }
    else if(e.target.nextElementSibling.classList.contains('movie-info')){
        movieInfo = e.target.nextElementSibling;
    }
    else{
        movieInfo = false;
    }

    if(movieInfo){
        const movieID = movieInfo.getAttribute('data-movieid');

        getMovieByID(movieID);
    }
}

//Get Movie By ID
function getMovieByID(movieID){
    fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        const movie = data;

        const title = movie.original_title;
        const poster = movie.poster_path;
        const date = movie.release_date;
        const runtime = movie.runtime;
        const overview = movie.overview;
        const budget = movie.budget;
        const language = movie.spoken_languages[0];

        const genres = [];
        movie.genres.forEach(movie => {
            genres.push(movie.name);
        });

        addMovieToPage(title, poster, date, runtime, overview, budget, language, genres);
    });
}

//Add the movie to the web page
function addMovieToPage(title, poster, date, runtime, overview, budget, language, genres){
    const modal = document.querySelector('#single-movie-modal');
    modal.style.display = 'flex';

    singleMovieElm.innerHTML = `
        <div class="singleMovieImg">
            <img src="https://image.tmdb.org/t/p/w342/${poster}">
        </div>
        <div class="singleMovieContent">
            <div class="singleMovieInfo">
                <div>
                    <h2>${title}</h2>
                    <p>${date} | ${runtime}mins</p>
                </div>
                <div class="singleMovieTags">

                </div>
            </div>
            <div class="singleMovieInfo">
                <h3>Overview</h3>
                <p>${overview}</p>
            </div>
            <div class="singleMovieInfo">
                <h4>Director</h4>
                <p>Guy Ritchie</p>
                <h4>Language</h4>
                <p>${language}</p>
                <h4>Production Budget</h4>
                <p>$${budget}</p>
                <button class="button button-yellow">Watch Trailer</button>
            </div>
            <button class="button modal-close" id="ModalClose" onClick="closeModal()">X</button>
        </div> 
    `;

    genres.forEach(genre => {
        const tag = document.createElement("small");
        tag.classList.add('movieTag');
        tag.innerHTML = genre;
        document.querySelector('.singleMovieTags').appendChild(tag);
    });
}

//Close selected Movie
function closeModal(){
    singleMovieElm.innerHTML = '';
    modal.style.display = 'none';
}