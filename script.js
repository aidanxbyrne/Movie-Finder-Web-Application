
//VARIABLES
const apiKey = '5de7cfe50c166403acf5dd4f68334d90';

const searchInput = document.querySelector('#search');
const searchSubmit = document.querySelector('#submit');
const randomBtn = document.querySelector('#RandomMovie');
const resultHeading = document.querySelector('#result-heading');
const movieElm = document.querySelector('#movies');
const singleMovieElm = document.querySelector('#single-movie');


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
        console.log(data);
    });
}