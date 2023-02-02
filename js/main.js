$(function() {

    const URL = "https://fantastic-fortune-syrup.glitch.me/movies";

    function getMovies() {
        $.ajax(
            {
                url: URL,
                type: "GET",
                dataType: "json",
                success: (data) => {
                    console.log(data);
                    //$("#insertProducts").html(productRows);
                    //comment
                },
                error: function (error) {
                    console.log(error);
                }
            }
        )
    }

    getMovies();

});