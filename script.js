
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

//CLASSES
const ui = new UI(resultHeading);

//EVENT LISTENERS
searchSubmit.addEventListener('submit', searchMovie);
movieElm.addEventListener('click', selectMovie);

//FUNCTIONS
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
                movies.results.forEach(movie => {
                    console.log(movie);
                    const moviee = new Movie(movie);
                    moviee.getMoviePreview();
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
    //Fetch responses from API endpoints
    Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`),
        fetch(`https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${apiKey}`),
        fetch(`https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${apiKey}`)
    ]).then(responses => {
        return Promise.all(responses.map(response => {
            return response.json();
        }));
    }).then(data => {
        const movie = data[0];
        const title = movie.original_title;
        const date = movie.release_date;
        const runtime = movie.runtime;
        const overview = movie.overview;
        const budget = movie.budget;
        
        let poster;
        if(movie.poster_path != null){
            poster = `https://image.tmdb.org/t/p/w342/${movie.poster_path}`;
        }
        else{
            poster = "assets/images/not-found.jpg";
        }

        let language 
        if(movie.spoken_languages.length < 0){
            language = movie.spoken_languages[0].name;
        };

        const genres = [];
        movie.genres.forEach(movie => {
            genres.push(movie.name);
        });

        //Get director from credits api endpoint
        let director;
        data[1].crew.forEach(crew => {
            if(crew.job === "Director"){
                director = crew.name;
            }
        });

        //Get trailers from videos api endpoint
        let trailer;
        if(data[2].results.length < 0){
            switch(data[2].results[0].site){
                case "YouTube":
                    trailer = `https://www.youtube.com/watch?v=${data[2].results[0].key}`;
                    break;
                case "Vimeo":
                    trailer = `https://vimeo.com/${data[2].results[0].key}`;
                    break;
                default:
                    tailer = '#';
            }
        }

        addMovieToPage(title, poster, date, runtime, overview, director, budget, language, genres,trailer);
    });
}

//Add the movie to the web page
function addMovieToPage(title, poster, date, runtime, overview, director, budget, language, genres,trailer){
    
    //Show Modal Overlay
    const modal = document.querySelector('#single-movie-modal');
    modal.style.display = 'flex';

    //Populate Modal with Movie info
    singleMovieElm.innerHTML = `
        <div class="singleMovieImg">
            <img src="${poster}">
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
                <p>${director}</p>
                <h4>Language</h4>
                <p>${language}</p>
                <h4>Production Budget</h4>
                <p>$${budget}</p>
                <a href="${trailer}" target="_blank"><button class="button button-yellow">Watch Trailer</button></a>
            </div>
            <button class="button modal-close" id="ModalClose" onClick="closeModal()">X</button>
        </div> 
    `;

    //Create a tag for each genre
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