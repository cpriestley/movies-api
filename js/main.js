import {OMDB_API_KEY} from "./keys.js";

$(function() {

    const MOVIES_URL = "https://fantastic-fortune-syrup.glitch.me/movies";
    const OMDB_URL = "http://www.omdbapi.com/";

    function getMovies() {
        $.ajax(
            {
                url: MOVIES_URL,
                type: "GET",
                dataType: "json",
                success: (data) => {
                    popCards(data);
                    //$("#insertProducts").html(productRows);
                },
                error: function (error) {
                    console.log(error);
                }
            }
        )
    }

    getMovies();

    function popCards(data) {
        console.log(data);
        let card = '';

        data.forEach(function (value) {
            card += `<div class="card" style="width: 18rem;">`;
            card += `<img src="${value.Poster}" class="card-img-top" alt="${value.Title}">`;
            card += `<div class="card-body">`;
            card += `<h5 class="card-title">${value.Title}</h5>`;
            card += `<p class="card-text">${value.imdbRating}</p>`;
            card += `<p class="card-text">${value.Plot}</p>`;
            card += `<a href="#" class="btn btn-primary"><i class="fa-solid fa-pencil"></i></a>`;
            card += `<a href="#" class="btn btn-primary"><i class="fa-solid fa-trash-can"></i></a>`;
            card += `</div>`;
            card += `</div>`;

        });

        $('#movie-content').html(card);

    }
    let data = {
        "i": "tt3896198",
        "apikey": OMDB_API_KEY
    }

    function searchMovie(movieTitle) {
        data.t = movieTitle;
        $.ajax(
            {
                url: OMDB_URL,
                type: "GET",
                data: data,
                dataType: "json",
                success: (data) => {
                    console.log(data);
                },
                error: function (error) {
                    console.log(error);
                }
            }
        )
    }

    searchMovie("goonies");
});