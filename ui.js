
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
    createResultCards(title, poster, date, movieID){
        movieElm.innerHTML += `
        <div class="movie">
            <img src=${poster} alt="${title} Poster">
            <div class="movie-info" data-movieID="${movieID}">
                <h3 class="color-white">${title}</h3>
                <p class="color-white">${date}</p>
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
                <div class="singleMovieInfo">
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
                    <a href="${movie.trailer}" target="_blank"><button class="button button-yellow">Watch Trailer</button></a>
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

        //Prevent scroll on body while modal is open
        document.body.style.overflow ='hidden';

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