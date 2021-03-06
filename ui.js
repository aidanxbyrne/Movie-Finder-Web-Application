
class UI{

    constructor(){
        this.mainSearch = document.querySelector('.main-search');
    }


    minimizeSearchArea(){
        this.mainSearch.classList.add('height-transition')
    }


    updateResultHeading(type, searchTerm){
        if(type === 'error'){
            resultHeading.innerHTML = `<h2 class="color-white text-center">There are no search results for '${searchTerm}'. Please try again.</h2>`;
        }
        else{
            resultHeading.innerHTML = `<h2 class="color-white text-center">Showing results for '${searchTerm}'</h2>`;
        }
    }

    //Create cards for search results that displays the poster, title and release date of each movie in the DOM
    createResultCards(title, poster, date, movieID, rating){
        movieElm.innerHTML += `
        <div class="movie">
            <img src=${poster} alt="${title} Poster">
            <div class="movie-info" data-movieID="${movieID}">
                <div class="movie-info-left">
                    <h3 class="color-white">${title}</h3>
                    <p class="color-white">${date}</p>
                </div>
                <div class="movie-info-right" style="border-color: ${this.getRatingColor(rating)};">
                    <h5 class="color-white">${rating}<h5>
                </div>
            </div>
        </div>
        `;
    }

    //Opens Modal that displays detailed information of a movie selected from the search results
    openMovieModal(movie){
         //Show Modal Overlay
        const modal = document.querySelector('#single-movie-modal');
        modal.style.display = 'flex';

        //Populate Modal with Movie info
        singleMovieElm.innerHTML = `
            <div class="singleMovieImg">
                <img src="${movie.poster}">
            </div>
            <div class="singleMovieContent">
                <div class="singleMovieInfo singleMovieHead">
                    <div>
                        <h2>${movie.title}</h2>
                        <p>${movie.date} | ${movie.runtime}mins</p>
                    </div>
                    <div class="singleMovieTags">

                    </div>
                </div>
                <div class="singleMovieInfo">
                    <h3>Overview</h3>
                    <p>${movie.overview}</p>
                </div>
                <div class="singleMovieInfo">
                    <h4>Director</h4>
                    <p>${movie.director}</p>
                    <h4>Language</h4>
                    <p>${movie.language}</p>
                    <h4>Production Budget</h4>
                    <p>$${movie.budget}</p>
                    <button class="button button-yellow" id="trailerButton" onClick="ui.openTrailer('${movie.trailer}')">Watch Trailer</button>
                </div>
            </div>
            <button class="button modal-close" id="ModalClose" onClick="ui.closeModal()">X</button> 
        `;

        //Create a tag for each genre
        movie.genres.forEach(genre => {
            const tag = document.createElement("small");
            tag.classList.add('movieTag');
            tag.innerHTML = genre.name;
            document.querySelector('.singleMovieTags').appendChild(tag);
        });

        //Remove trailer button if no trailer exists
        if(movie.trailer === null || movie.trailer === ''){
            document.getElementById('trailerButton').remove();
        }
        
        //Prevent scroll on body while modal is open
        document.body.style.overflow ='hidden';
    }

    //Return colour value between red and green depending on user rating percentage
    getRatingColor(rating){
        //Colour mapping to percentage taken from: https://stackoverflow.com/a/17267684
        let a = rating / 100,
        b = (120 - 0) * a,
        c = b + 0;
        return 'hsl('+c+', 100%, 50%)';
    }

    //Open Trailer in new tab
    openTrailer(trailer){
        window.open(trailer);
    }

    //Close selected Movie
    closeModal(){
        singleMovieElm.innerHTML = '';
        modal.style.display = 'none';

        //Enable scroll on body while modal is closed
        document.body.style.overflow ='auto';
    }

    clearUI(){
        //Clear Search Term
        searchInput.value = '';

        //Clear Previous Results
        if(movieElm.innerHTML !== ''){
            movieElm.innerHTML = '';
        }
    }
}