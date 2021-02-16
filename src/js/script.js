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
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="results__item">
                 <div class="results__item-image">
                  <img class='results__item-img' src=${movie.image}>
                 </div> 
                    <div class="results__item-title">${movie.title}</div>
                    <div class="results__item-type"><b>Тип:</b> ${movie.type}</div>
                    <div class="results__item-year"><b>Год:</b> ${movie.year}</div>
                    <div class="results__item-genres"><b>Жанры:</b> ${movie.genres}</div>
                    <div class="results__item-releaseDate"><b>Дата выпуска:</b> ${movie.releaseDate}</div>
                    <div class="results__item-plot"><b>Описание:</b> ${movie.plot}</div>
                    <div class="results__item-directors"><b>Режисеры:</b> ${movie.directors}</div>
                    <div class="results__item-writers"><b>Сценаристы:</b> ${movie.writers}</div>
                    <div class="results__item-stars"><b>Актеры:</b> ${movie.stars}</div>
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