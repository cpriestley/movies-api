import {OMDB_API_KEY} from "./keys.js";

$(function() {

   /* $('#loading-image').bind('ajaxStart', function(){
        $(this).show();
    }).bind('ajaxStop', function(){
        $(this).hide();
    });*/


    const MOVIES_URL = "https://fantastic-fortune-syrup.glitch.me/movies/";
    const OMDB_URL = "http://www.omdbapi.com/";

    function getMovies() {
        $.ajax(
            {
                url: MOVIES_URL,
                type: "GET",
                dataType: "json",
                success: (data) => {
                    popCards(data);
                    setTimeout( () => {
                        $('#movie-content').removeClass("d-none");
                        $('#loading-image').remove();
                    }, 1200)

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
            card += `<li className="card">`
            card += `<div class="card" id="${value.id}" style="width: 15rem; ">`;
            card += `<img src="${value.Poster}" class="card-img-top" alt="${value.Title}">`;
            card += `<div class="card-body">`;
            card += `<h6 class="card-title">${value.Title}</h6>`;
            card += `<p class="card-text">${value.Genre}</p>`;
            card += `<div class="d-flex flex-row justify-content-around">
            <p class="rating d-flex flex-row">${value.imdbRating}</p>
            <button type="button" class="edit-btn btn btn-dark" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa-solid fa-pencil"></i></button>
            <button class="delete-btn btn btn-dark" type="submit"><i class="fa-solid fa-trash-can"></i></button>
            </div>`;
            card += `</div>`;
            card += `</div>`;
            card += `</li>`;

        });

        $('#movie-content').html(card);

    }

    //delete movies
    $('#movie-content').on("click", "button.delete-btn", function(e) {
        let id = $(this).parent().parent().parent().attr('id');
        console.log(MOVIES_URL + "/" + id);
        $.ajax({
            url: MOVIES_URL + "/" + id,
            type: 'DELETE',
            success: function() {
                // Do something with the result
                console.log("Movie deleted")
                $('#' + id).parent().remove();
            }
        });
    });

    //edit movies
    /*$('#edit-btn').on("click", "button.edit-btn", function(e) {

    });*/


    //under submit for edit
    /*let id = $(this).parent().parent().attr('id');
    console.log(MOVIES_URL + "/" + id);
    $.ajax({
        url: MOVIES_URL + "/" + id,
        type: 'PATCH',
        success: function() {
            // Do something with the result
            console.log("Movie deleted")
            $('#' + id).remove();
        }
    });*/


    //add a movie
    $('#submitAdd').click(function() {
        let title = document.getElementById("addTitle").value;
        let rating = document.getElementById("addImdbRating").value;
        let genre = document.getElementById("addGenre").value;
        let poster = document.getElementById("addPoster").value;
        console.log(title);

        const reviewObj = {
            Title: title,
            imdbRating: rating,
            Genre: genre,
            Poster: poster,
        };
        console.log(reviewObj);
        $.ajax({
            url: MOVIES_URL,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(reviewObj)
        }).done(function(){
            console.log("Movie ADDED")
            getMovies();
        });


    });




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