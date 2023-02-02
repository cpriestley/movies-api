// $(document).ready(function() {

    const URL = "https://fantastic-fortune-syrup.glitch.me/movies";

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const server = {
        fetchMovies: async function() {
            return $.ajax({
                url: URL,
                type: "GET",
                success: function (response) {
                    return response;
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    }

    server.fetchMovies().then(data => console.log(JSON.stringify(data)))

    /*fetch(URL, options)
        .then((data) => console.log(JSON.stringify(data)))
        .catch((error) => console.log(error));*/
// });

