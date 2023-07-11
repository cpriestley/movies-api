# Movie Mojo
Movie Mojo is a single page movie application that displays the [IMDb Top 250 Movies](https://www.imdb.com/chart/top/?ref_=nv_mv_250) as of 26-Feb-2023.  
The movie details are pulled using the OMDb API and stored in a [Glitch](https://glitch.com/) server to act as our movie database.

[![Netlify Status](https://api.netlify.com/api/v1/badges/85edfaca-1ef2-4bc6-8e26-1d5101560cc0/deploy-status)](https://app.netlify.com/sites/movie-mojo-demo/deploys)
## Live Site
https://movie-mojo-demo.netlify.app/

## Installation:

Create an an account on [The Open Movie Database](https://www.themoviedb.org/) to request an api key for the The OMDb API.

Create js/**keys.js** file to hold the api key:

```JavaScript
export {OMDB_API_KEY}
OMDB_API_KEY = "YOUR_OMDB_API_KEY";
```

## Features :

App uses OMDb API to fetch details for The Top 250 movies.  

