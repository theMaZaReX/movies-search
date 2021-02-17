const result = $('.results .container-fluid');
const order = { //порядок добавления нужных полей для каждого фильма
    image: '',
    title: '',
    type: 'Тип',
    year: 'Год',
    genres: 'Жанры',
    releaseDate: 'Дата выхода',
    plot: 'Описание',
    directors: 'Режисеры',
    writers: 'Сценаристы',
    stars: 'Звезды'
}
const orderKeys = Object.keys(order);

const outputMovies = function (data) {

    if (result.children().length > 0) {
        result.empty();
    }

    $('.loader').removeClass('show-loader');

    if (data) {
        result.append(`<div class="row justify-content-center p-4"></div>`);

        const row = $('.results .row');
        const resultItem = `<div class="col-lg-3 col-md-6 col-sm-12">
                                <div class="results__item"></div>
                            </div>`;
        const movies = JSON.parse(data);

        movies.forEach(function (movie) {
            $('.results .row').append(resultItem);
            orderKeys.forEach(function (field) {
                if (movie.hasOwnProperty(field)) {
                    if (field == 'image') {
                        const fieldElem = `<div class="results__item-${field}"><img src="${movie[field]}"></div>`;
                        $('.results__item').last().append(fieldElem);
                    } else {
                        const fieldElem = `<div class="results__item-${field}"><b>${field != 'title' ? order[field] + ':' : ''}</b> ${movie[field]}</div>`;
                        $('.results__item').last().append(fieldElem);
                    }
                }
            })
        })
    } else {
        alert('Ошибка на стороне сервера');
    }

}

$(document).ready(function () {

    $('.search__form').submit(function (e) {

        const searchRequest = $('.search__form-input').val().trim();
        e.preventDefault();
        if (searchRequest.length >= 3) {
            $('.loader').addClass('show-loader');
            $.ajax({
                type: "GET",
                url: './src/php/search.php',
                data: {title: searchRequest},
                success: outputMovies,
            })
        } else {
            alert('В поисковой строке должно быть хотя бы 3 символа');
        }
    })

})