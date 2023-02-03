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
            card += `<div class="card pt-3" id="${value.id}">`;
            card += `<img src="${value.Poster}" class="card-img-top" alt="${value.Title}">`;
            card += `<div class="card-body">`;
            card += `<h6 class="card-title fw-bold">${value.Title}</h6>`;
            card += `<p class="card-text fs-6">${value.Genre}</p>`;
            card += `<div class="d-flex flex-row justify-content-around w-80">
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
    //open modal and prefill
    $('#movie-content').on("click", "button.edit-btn", function(e) {
        let card = $(e.currentTarget).parent().parent().parent();
        //link
        let postLink = card.children('img').attr('src');
        $("#editPoster").val(postLink);
        //title
        let title = card.children().first().next().children().first().text();
        $("#editTitle").val(title);
        //genres
        let genres = card.children().first().next().children().first().next().text();
        $("#editGenre").val(genres);
        //rating
        let rating = card.children().first().next().children().first().next().next().children().first().text();
        $("#editImdbRating").val(rating);
        let id = $(this).parent().parent().parent().attr('id');
        $("#editId").val(id);

    });

    //disable edit submit button while ajax is running
    $(document).ajaxStart(function () {
        $("#submitEdit").attr("disabled", true);
    });
    $(document).ajaxComplete(function () {
        $("#submitEdit").attr("disabled", false);
    });


    $('#submitEdit').click(function() {
        let title = document.getElementById("editTitle").value;
        let rating = document.getElementById("editImdbRating").value;
        let genre = document.getElementById("editGenre").value;
        let poster = document.getElementById("editPoster").value;
        let id = document.getElementById("editId").value;
        console.log(title);

        const editMovie = {
            Title: title,
            imdbRating: rating,
            Genre: genre,
            Poster: poster,
            id: id
        };
        console.log(editMovie);

        //under submit for edit
        console.log(MOVIES_URL + "/" + id);
        $.ajax({
            url: MOVIES_URL + "/" + id,
            type: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(editMovie)
        }).done(function(){
            console.log("Movie edited")
            getMovies();
            /*let element = $("#editLabel");
            element.text(element.text().replace("Edit A Movie", "Movie Has Been Edited"));*/
        });

    });

    //disable add button while ajax is running
    $(document).ajaxStart(function () {
        $("#submitAdd").attr("disabled", true);
    });
    $(document).ajaxComplete(function () {
        $("#submitAdd").attr("disabled", false);
    });


    //add a movie
    $('#submitAdd').click(function() {
        let title = document.getElementById("addTitle").value;
        let rating = document.getElementById("addImdbRating").value;
        let genre = document.getElementById("addGenre").value;
        let poster = document.getElementById("addPoster").value;
        console.log(title);

        const newMovie = {
            Title: title,
            imdbRating: rating,
            Genre: genre,
            Poster: poster,
        };
        console.log(newMovie);
        $.ajax({
            url: MOVIES_URL,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(newMovie)
        }).done(function(){
            console.log("Movie ADDED")
            getMovies();
        });


    });



    //search omdb
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