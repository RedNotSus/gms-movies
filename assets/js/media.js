function fetchTmdbId() {
  let search = document.getElementById("searchbar").value;
  let link;
  let poster;
  let encodedSearch = encodeURIComponent(search);
  let url =
    "https://api.themoviedb.org/3/search/multi?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US&query=" +
    encodedSearch +
    "&page=1&include_adult=false";
  const gameContainer = document.getElementById("game-container");
  gameContainer.innerHTML = "";

  try {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const results = data.results;
        results.forEach(function (movie) {
          let poster;
          if (movie.poster_path === null || !movie.poster_path) {
            return;
          } else {
            poster = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
          }

          let gameHtml;
          let rating = Math.round(movie.vote_average * 10) / 10;
          let year = movie.release_date
            ? movie.release_date.slice(0, 4)
            : "N/A";
          if (movie.media_type === "tv") {
            year = movie.first_air_date
              ? movie.first_air_date.slice(0, 4)
              : "N/A";
            gameHtml = `<div class="card" style="padding-top: 5px">
              <a href='watch/tv?id=${movie.id}'"> 
              <div class="rating">★ ${rating}</div>
              <div class="year">${year}</div>
                <div class="image-container">
                  <img loading="eager" src="${poster}" style="border-radius: 25px">
                  <div class="play-button"></div>
                  <p class="item-name">${movie.name || movie.title}</p> 
                </div>
              </a>
            </div>`;
          } else if (movie.media_type === "movie") {
            gameHtml = `<div class="card" style="padding-top: 5px">
              <div class="rating">★ ${rating}</div>
              <div class="year">${year}</div>
              <a href="watch/movie?id=${movie.id}"> 
                <div class="image-container">
                  <img loading="eager" src="${poster}" style="border-radius: 25px">
                  <div class="play-button"></div>
                  <p class="item-name">${movie.name || movie.title}</p> 
                </div>
              </a>
            </div>`;
          }
          gameContainer.insertAdjacentHTML("beforeend", gameHtml);
        });
      });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
