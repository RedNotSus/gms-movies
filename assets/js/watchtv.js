async function getTVShowData() {
  const ID = new URLSearchParams(window.location.search).get("id");
  if (!ID) {
    window.location.href = "/";
    return;
  }

  const url = `https://api.themoviedb.org/3/tv/${ID}?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US`;
  try {
    const response = await fetch(url);
    const show = await response.json();

    const filteredSeasons = show.seasons.filter(
      (season) => season.name !== "Specials"
    );
    populateSeasonSelector(filteredSeasons);
  } catch (error) {
    console.error("Error fetching TV show data:", error);
  }
  iframe = document.getElementById("iframe");
  iframe.src = `https://vidlink.pro/tv/${ID}/1/1?nextbutton=true&autoplay=false`;
}

function populateSeasonSelector(seasons) {
  const seasonSelector = document.getElementById("seasonSelector");
  seasonSelector.innerHTML = "";
  seasons.forEach((season) => {
    const option = document.createElement("option");
    option.value = season.season_number;
    option.textContent = season.name;
    seasonSelector.appendChild(option);
  });

  seasonSelector.addEventListener("change", () => {
    const seasonNumber = seasonSelector.value;
    getEpisodes(seasonNumber);
  });

  if (seasons.length > 0) {
    getEpisodes(seasons[0].season_number);
  }
}

async function getEpisodes(seasonNumber) {
  const ID = new URLSearchParams(window.location.search).get("id");
  const url = `https://api.themoviedb.org/3/tv/${ID}/season/${seasonNumber}?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US`;

  try {
    const response = await fetch(url);
    const season = await response.json();
    displayEpisodes(season.episodes, ID, seasonNumber);
  } catch (error) {
    console.error("Error fetching season data:", error);
  }
}

function displayEpisodes(episodes, tmdbId, seasonNumber) {
  const episodeList = document.getElementById("episodeList");
  episodeList.innerHTML = "";

  episodes.forEach((episode, index) => {
    const episodeItem = document.createElement("div");
    episodeItem.classList.add("episode-item");
    episodeItem.textContent = `Episode ${episode.episode_number}: ${episode.name}`;

    episodeItem.addEventListener("click", () => {
      const iframe = document.getElementById("iframe");
      iframe.src = `https://vidlink.pro/tv/${tmdbId}/${seasonNumber}/${episode.episode_number}?nextbutton=true&autoplay=false`;

      document.querySelectorAll(".episode-item").forEach((item) => {
        item.classList.remove("active");
      });

      episodeItem.classList.add("active");
    });

    if (index === 0 && seasonNumber === 1) {
      episodeItem.classList.add("active");
    }

    episodeList.appendChild(episodeItem);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  getTVShowData();
});
