
class UI{

    constructor(resultHeading){
        this.mainSearch = document.querySelector('.main-search');
        this.resultHeading = resultHeading;
    }

    minimizeSearchArea(){
        this.mainSearch.classList.add('height-transition')
    }

    updateResultHeading(type, searchTerm){
        if(type === 'error'){
            this.resultHeading.innerHTML = `<h2 class="color-white text-center">There are no search results for '${searchTerm}'. Please try again.</h2>`;
        }
        else{
            this.resultHeading.innerHTML = `<h2 class="color-white text-center">Showing results for '${searchTerm}'</h2>`;
        }
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