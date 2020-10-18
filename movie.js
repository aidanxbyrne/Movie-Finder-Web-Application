
class Movie{

    constructor(){

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

    checkForLanguage(movie){
        if(movie.spoken_languages.length > 0){
           return movie.spoken_languages[0].name
        }
        else{
            return 'Unknown'
        }
    }

    getDirector(credits){
        let director;

        credits.crew.forEach(crew => {
            if(crew.job === "Director"){
                director = crew.name;
            }
        });

        return director
    }

    getTrailer(video){
        const videoResults = video.results
        let trailer;

        if(videoResults.length > 0){
            switch(video.results[0].site){
                case "YouTube":
                    trailer = `https://www.youtube.com/watch?v=${videoResults[0].key}`;
                    break;
                case "Vimeo":
                    trailer = `https://vimeo.com/${videoResults[0].key}`;
                    break;
                default:
                    tailer = '#';
            }
        }
        else{
            trailer = '#';
        }

        return trailer
    }

    getMoviePreview(movie){
        const  title = movie.original_title,
            movieID = movie.id,
            poster = this.setMoviePoster(movie.poster_path),
            date = this.convertDateFormat(movie.release_date);

        ui.createResultCards(title, poster, date, movieID);
    }

    async getMovieFull(id){
        const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
        const creditResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`);
        const videoResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`);

        const movie = await movieResponse.json();
        const credit = await creditResponse.json();
        const video = await videoResponse.json();

        return{
            title: movie.original_title,
            poster: this.setMoviePoster(movie.poster_path),
            date: this.convertDateFormat(movie.release_date),
            runtime: movie.runtime,
            overview: movie.overview,
            budget: movie.budget,
            language: this.checkForLanguage(movie),
            genres: movie.genres,
            director: this.getDirector(credit),
            trailer: this.getTrailer(video)
        }
    }

    async getRandomMovie(){
        //Get ID of most recent movie in database
        const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/latest?api_key=${apiKey}`);
        const latest = await movieResponse.json();
        const latestID = latest.id; 

        //Find random ID between 1 and ID of most recent movie
        const randomID = Math.floor(Math.random() * `${latestID}`) + 1;

        return randomID;
    }
    
}