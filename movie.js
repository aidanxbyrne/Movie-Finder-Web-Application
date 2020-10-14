
class Movie{

    constructor(movie){
        this.title = movie.original_title;
        this.movieID = movie.id;
        this.poster = this.setMoviePoster(movie.poster_path);
        this.date = this.convertDateFormat(movie.release_date);
    }

    setMoviePoster(path){
        //Set Moview Poster
        if(path != null){
            return `https://image.tmdb.org/t/p/w342/${path}`;
        }
        else{
            return "/assets/images/not-found.jpg";
        }
    }

    convertDateFormat(date){
        if(date === null || date === ""){
            return "";
        }
        else{
            let releaseDay = date.substring(8,10);
            let releaseMonth = date.substring(5, 7);
            let releaseYear = date.substring(0, 4);
            return `${releaseDay}/${releaseMonth}/${releaseYear}`;
        }
    }

    getMoviePreview(){
        //Add movie to the page
        movieElm.innerHTML += `
            <div class="movie">
                <img src=${this.poster} alt="${this.title} Poster">
                <div class="movie-info" data-movieID="${this.movieID}">
                    <h3 class="color-white">${this.title}</h3>
                    <p class="color-white">${this.date}</p>
                </div>
            </div>
        `;
    }

    getMovieFull(){

    }
}