
//VARIABLES
const apiKey = '5de7cfe50c166403acf5dd4f68334d90';

const searchInput = document.querySelector('#search');
const searchSubmit = document.querySelector('#submit');
const randomBtn = document.querySelector('#RandomMovie');
const resultHeading = document.querySelector('#result-heading');
const movieElm = document.querySelector('#movies');
const singleMovieElm = document.querySelector('#single-movie');
const modal = document.querySelector('#single-movie-modal');
const modalCloseBtn = document.querySelector('#ModalClose');
const navMenu = document.querySelector('.nav-icon');

//CLASSES
const ui = new UI();
const movie = new Movie();

//EVENT LISTENERS
searchSubmit.addEventListener('submit', searchMovie);
movieElm.addEventListener('click', selectMovie);
navMenu.addEventListener('click', triggerNavMenu);
randomBtn.addEventListener('click', openRandomMovie);

//FUNCTIONS

function triggerNavMenu(){
    if(document.getElementsByClassName('nav-list')[0].style.display === "" || document.getElementsByClassName('nav-list')[0].style.display === "none"){
        document.getElementsByClassName('nav-list')[0].style.display = "flex"
    }
    else{
        document.getElementsByClassName('nav-list')[0].style.display = "none"
    }
}

async function searchMovies(searchTerm){
    const movieResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`);
    const movies = await movieResponse.json();

    return movies
}

//search movie and fetch from API
function searchMovie(e){
    e.preventDefault();

    //Clear single movie
    singleMovieElm.innerHTML = '';

    //Get Search term
    const term = searchInput.value;

    //Check for emput input
    if(term.trim()){
        searchMovies(term)
        .then(movies => {
            //Reduce size of area around search box
            ui.minimizeSearchArea();

            //Check for movie results
            if(movies.total_results === 0){
                //Show error in heading
                ui.updateResultHeading('error', term);
            }
            else{
                //Update result heading
                ui.updateResultHeading('',term);

                //Create new movie for each response in movies
                movies.results.forEach(mov => {
                    movie.getMoviePreview(mov);
                });   
            }
        });

        //Clear UI
        ui.clearUI();
    }
    else{
        //TODO: Convert to an on page alert
        alert('Please enter a search term');
    }
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

        movie.getMovieFull(movieID)
        .then(movie => {
            ui.openMovieModal(movie);
        })
    }
}

function openRandomMovie(){
    const randomID = movie.getRandomMovie()
    .then(randomID => {

    movie.getMovieFull(randomID)
    .then(movie => {
        ui.openMovieModal(movie);
    })
    })
}
