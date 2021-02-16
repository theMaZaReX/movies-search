const result = $('.results');


const outputMovies = function (data) {


    if (data) {
        result.append(`
        <div class="container-fluid p-0">
            <div class="row"> 
            </div>
        </div>
`)
        const row = $('.results .row');
        const movies = JSON.parse(data);
        movies.forEach(function (movie) {
            row.append(`
            <div class="col-lg-4 col-md-6 col-md-12">
                <div class="results__item">
                 <div class="results__item-image">
                  <img class='results__item-img' src=${movie.image}>
                 </div> 
                    <span class="results__item-title">${movie.title}</span>
                    <div class="results__item-type">${movie.type}</div>
                    <div class="results__item-year">${movie.year}</div>
                    <div class="results__item-genres">${movie.genres}</div>
                    <div class="results__item-releaseDate">${movie.releaseDate}</div>
                    <div class="results__item-plot">${movie.plot}</div>
                    <div class="results__item-directors">${movie.directors}</div>
                    <div class="results__item-writers">${movie.writers}</div>
                    <div class="results__item-stars">${movie.stars}</div>
                </div>
                </div>
            `)
        })
    }
}


$(document).ready(function () {

    $('.search__form').submit(function (e) {
        const searchRequest = $('.search__form-input').val();
        e.preventDefault();
        if (searchRequest.length >= 3) {
            $.ajax({
                type: "GET",
                url: './src/php/search.php',
                data: {title: searchRequest},
                success: outputMovies,
            })
        }
        else{
           alert('В поисковой строке должно быть хотя бы 3 символа');

        }
    })

})