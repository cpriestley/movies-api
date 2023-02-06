import {OMDB_API_KEY} from "./keys.js";

$(function () {

    const MOVIES_URL = "https://fantastic-fortune-syrup.glitch.me/movies/";
    const OMDB_URL = "http://www.omdbapi.com/";

    const movieContent = $("#movie-content");

    let genres = new Set();
    let fields = new Set();
    let titles = new Set();
    let omdbMovieResult;

    function getMovies() {
        return $.ajax(
            {
                url: MOVIES_URL,
                type: "GET",
                dataType: "json",
                success: (data) => {
                    return data;
                },
                error: function (error) {
                    console.log(error);
                }
            }
        )
    }

    $("#genre-sort").click(sortByGenre);
    $("#title-sort").click(sortByTitle);
    $("#rating-sort").click(sortByRating);
    $("#rebuild").click(rebuildMovieDatabase);

    function sortByGenre() {
        let lis = movieContent.children();
        console.log("movieContent Length: " + lis.length);
        lis.sort(function (a, b) {
            return $(a).find(".card-text").text().localeCompare($(b).find(".card-text").text());
        });
        $.each(movieContent.children(), function (idx, itm) {
            itm.remove();
        });
        $.each(lis, function(idx, itm) { movieContent.append(itm); });
    }

    function sortByTitle() {
        let lis = movieContent.children();
        console.log("movieContent Length: " + lis.length);
        lis.sort(function (a, b) {
            return $(a).find(".card-title").text().localeCompare($(b).find(".card-title").text());
        });
        $.each(movieContent.children(), function (idx, itm) {
            itm.remove();
        });
        $.each(lis, function(idx, itm) { movieContent.append(itm); });
    }

    function sortByRating() {
        let lis = movieContent.children();
        console.log("movieContent Length: " + lis.length);
        lis.sort(function (a, b) {
            return $(a).find(".rating").text().localeCompare($(b).find(".rating").text());
        });
        $.each(movieContent.children(), function (idx, itm) {
            itm.remove();
        });
        $.each(lis, function(idx, itm) { movieContent.append(itm); });

    }

    function popCards(movies) {
        let card = '';

        movies.forEach(function (movie) {
            titles.add(movie.Title);
            movie.Genre.split(', ').forEach(function (genre) {
                genres.add(genre)
            });
            Object.keys(movie).forEach(function (field) {
                fields.add(field)
            });

            card += `<li>
                        <div class="card" id="${movie.id}">
                            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                            <div class="card-body w-100">
                                <h6 class="card-title fw-bold">${movie.Title}</h6>
                                <p class="card-text fs-6">${movie.Genre}</p>
                                <div class="d-flex flex-row justify-content-around w-80">
                                    <p class="rating align-middle d-flex flex-row">${movie.imdbRating}</p>
                                    <button type="button" class="edit-btn btn btn-dark" data-bs-toggle="modal" data-bs-target="#editModal">
                                        <i class="fa-solid fa-pencil"></i>
                                    </button>
                                    <button class="delete-btn btn btn-dark" type="submit">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>`;

        });

        $('#movie-content').html(card);

    }

    //delete movies
    movieContent.on("click", "button.delete-btn", function () {
        let id = $(this).parent().parent().parent().attr('id');
        console.log(MOVIES_URL + "/" + id);
        $.ajax({
            url: MOVIES_URL + "/" + id,
            type: 'DELETE',
            success: function () {
                // Do something with the result
                console.log("Movie deleted")
                $('#' + id).parent().remove();
            }
        });
    });

    //edit movies
    //open modal and prefill
    movieContent.on("click", "button.edit-btn", function (e) {
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


    $('#submitEdit').click(function () {
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
        }).done(function () {
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
    $('#submitAdd').click(function () {
        let title = document.getElementById("addTitle").value;
        let rating = document.getElementById("addImdbRating").value;
        let genre = document.getElementById("addGenre").value;
        let poster = document.getElementById("addPoster").value;
        console.log(title);

        let newMovie;

        if (toString.call(omdbMovieResult) === "[object Object]") {
            newMovie = omdbMovieResult;
        } else {
            newMovie = {
                Title: title,
                imdbRating: rating,
                Genre: genre,
                Poster: poster,
            };
        }

        console.log(newMovie);
        $.ajax({
            url: MOVIES_URL,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(newMovie)
        }).done(function () {
            console.log(`${newMovie.Title} ADDED to database`)
            omdbMovieResult = null;
            getMovies();
        });


    });

    //search database
    function searchDb() {
        return $.ajax(
            {
                url: MOVIES_URL,
                type: "GET",
                dataType: "json",
                success: (data) => {
                    return data;
                },
                error: function (error) {
                    console.log(error);
                }
            })
    }

    $("#searchOMDB").click(function () {
        omdbMovieResult = searchMovie($("#OMDB-input").val())
            .then(movie => {
                $("#addTitle").val(movie.Title);
                $("#addImdbRating").val(movie.imdbRating);
                $("#addGenre").val(movie.Genre);
                $("#addPoster").val(movie.Poster);
            })
    });

    $("#db-search-btn").click(function () {
        let movieTitle = $("#search-input").val();
        console.log(movieTitle);
        searchDb()
            .then((data) => {
                return data.filter((movie) => movie.Title.toLowerCase().includes(movieTitle.toLowerCase()))
            })
            .then((movie) => {
                let target = $(`#${movie[0].id}`);
                $(target).addClass("hot-card");
                $(target).parent().remove();
                $("#movie-content").prepend($(target).parent());
                $(target).parent().parent().scrollLeft(0);
            });
    });



    //search omdb
    let data = {
        "i": "tt3896198",
        "apikey": OMDB_API_KEY
    }

    function searchMovie(movieTitle) {
        data.t = movieTitle;
        return $.ajax(
            {
                url: OMDB_URL,
                type: "GET",
                data: data,
                dataType: "json",
                success: (movie) => {
                    return movie;
                },
                error: function (error) {
                    console.log(error);
                }
            }
        )
    }


    // This will add 257 movies to the database
    // { "movies": [] }
    function rebuildMovieDatabase() {
        fetch("/data/movie.json")
            .then(response => response.json())
            .then(response => {
                    //response.movies.forEach(movie => { postMovie(movie)})
                    for (let i = 10; i < response.movies.length; i++) {
                        //if(movieNotInDatabase) {
                            postMovie(response.movies[i]);
                        //}
                    }
                }
            );
    }

    function postMovie(movie) {
        const url = 'https://fantastic-fortune-syrup.glitch.me/movies';

        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie),
        };

        fetch(url, options)
            .then(response => response.json())
            .then(movie => console.log(`${movie.Title} successfully posted`))
            .catch(error => console.error(error));

    }

    function buildCarousel(movies) {
        popCards(movies);
        setTimeout(() => {
            $(".navbar").removeClass("d-none");
            $(".ticker").removeClass("d-none");
            $("#movie-content").removeClass("d-none");
            $("#loading-image").remove();
        }, 1200)
        // console.log(genres);
        // console.log(fields);
        $("#search-input").autocomplete({source: Array.from(titles)});
    }

    getMovies()
        .then((movies) => { buildCarousel(movies) });

});
