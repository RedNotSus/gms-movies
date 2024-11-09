async function displayMovies(page) {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200&api_key=9a2954cb0084e80efa20b3729db69067`
  );
  const data = await response.json();
  const popular = data.results;

  const gameContainer = document.getElementById("game-container");
  popular.forEach(function (movie) {
    let poster;
    if (movie.poster_path === null || !movie.poster_path) {
      poster = "/img/no-media.svg";
    } else {
      poster = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
    }

    let gameHtml;
    let rating = Math.round(movie.vote_average * 10) / 10;
    let year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
    year = movie.first_air_date ? movie.first_air_date.slice(0, 4) : "N/A";
    gameHtml = `<div class="card" style="padding-top: 5px">
              <a onclick="promptForSeasonAndEpisode(${movie.id})"> 
              <div class="rating">★ ${rating}</div>
              <div class="year">${year}</div>
                <div class="image-container">
                  <img loading="eager" src="${poster}" style="border-radius: 25px">
                  <div class="play-button"></div>
                  <p class="item-name">${movie.name || movie.title}</p> 
                </div>
              </a>
            </div>`;
    gameContainer.insertAdjacentHTML("beforeend", gameHtml);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  let cooldown = false;
  let popularText = document.getElementById("popular");
  document
    .getElementById("searchbar")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        popularText.style.display = "none";
        if (cooldown) {
          document.getElementById("cooldownNotice").style.display = "block";
        } else {
          fetchTmdbId();
          document.getElementById("cooldownNotice").style.display = "none";
          cooldown = true;
          setTimeout(function () {
            cooldown = false;
            document.getElementById("cooldownNotice").style.display = "none";
          }, 2000);
        }
      }
    });
  for (let i = 1; i <= 5; i++) {
    displayMovies(i);
  }
});
