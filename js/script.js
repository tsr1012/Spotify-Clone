let currentSong = new Audio
let data;
let songsObject = {}
let queue = []
let likedSongs = []
let repeatSongs = []
let rewindSongs = []
let currSongVol = 0
let currSongIndex;
let settings = {}
let musicList;
let playlistsContainer;
let repeatFlag = "no-repeat"
let shuffleFlag = false
let displayedPl = allSongCard;
let currPl = allSongCard;
let prevPl = dummy;
let currTrack = dummy;
let prevTrack;
let useless = dummy;
let abc = allSongCard;
let displayedQueue = []

function setTrack(trackId) {
  songsObject.songs.forEach(song => {
    if (song.id == trackId) {
      currentSong.src = song.src
      currentSong.dataset.id = song.id
      let currentSongCard = document.querySelector("#currentSongCard")
      // display now playing card with info
      currentSongCard.querySelector("h3").innerText = song.trackName
      currentSongCard.querySelector("span").innerText = song.artist
      currentSongCard.querySelector("img").src = song.cover
    }
  });

  // change the song title color of current song in the music list
  if (queue.length > 0 && musicList.innerHTML != "" && abc == displayedPl) {
    useless.classList.remove("now-playing")
    useless.querySelector(".album-art").classList.remove("img-play-svg")
    prevTrack = currTrack
    currTrack = document.querySelector(`.music-list .song[data-id="${trackId}"]`)
    if (currTrack) {
      prevTrack ? (prevTrack.classList.remove("now-playing"),
        prevTrack.querySelector(".album-art").classList.remove("img-play-gif"),
        prevTrack.querySelector(".album-art").classList.remove("img-play-svg")) : ""
      currTrack.classList.add("now-playing")
      currTrack.querySelector(".album-art").classList.add("img-play-svg")
    }
  }

  // enable song nav buttons upon playing a music
  seekBar.disabled = false
  play_pause.disabled = false
  shuffle.disabled = false
  repeat.disabled = false
  next.disabled = false
  prev.disabled = false
  likeBtn.disabled = false
  likeBtn.classList.remove("btn-like-animation1")
  likeBtn.classList.remove("btn-like-animation2")

  if (likedSongs.includes(parseInt(currentSong.dataset.id))) {
    defaultLikeIcon.style.display = "none"
    fillLikeIcon.style.display = "block"
  }
  else {
    defaultLikeIcon.style.display = "block"
    fillLikeIcon.style.display = "none"
  }
  marqueeAnimation()
}

async function loadSettings() {
  let dataStr = localStorage.getItem("settings")
  // get list of all the songs
  songsObject = await getSongsData()
  // if saved data found then set the settings
  if (dataStr) {
    data = JSON.parse(dataStr)
    likedSongs = data.likedSongsList
    rewindSongs = data.rewindSongsList
    currentSong.volume = data.volume
    repeatFlag = data.repeat
    shuffleFlag = data.shuffle
    volumeBar.value = currentSong.volume * 100
    volumeBar.style.setProperty("--volume-lvl", `${volumeBar.value}%`)
    if (currentSong.volume == 0) {
      muteSong()
    }

    // set player controls property
    if (screen.width < 676) {
      document.querySelector(".player-container").style.display = "flex"
      document.querySelector(".container").style.setProperty("--cont-height", "62px")
      document.querySelector(".menu").style.setProperty("--menu-height", "78px")
      currentSong.volume = 1
    }

    // set repeat icon property
    if (repeatFlag == "all-song") {
      document.documentElement.style.setProperty("--repeat-btn", "var(--sp-green-inactive)")
      document.documentElement.style.setProperty("--repeat-btn-hov", "var(--sp-green)")
      repeat.style.setProperty("--repeat-dot", "block")
    }
    else if (repeatFlag == "single-song") {
      document.documentElement.style.setProperty("--repeat-btn", "var(--sp-green-inactive)")
      document.documentElement.style.setProperty("--repeat-btn-hov", "var(--sp-green)")
      repeat.style.setProperty("--repeat-dot", "block")
      defaultRepeatIcon.style.display = "none"
      singleRepeatIcon.style.display = "block"
    }
    else {
      document.documentElement.style.setProperty("--repeat-btn", "var(--btn-inactive)")
      document.documentElement.style.setProperty("--repeat-btn-hov", "var(--white)")
      repeat.style.setProperty("--repeat-dot", "none")
      defaultRepeatIcon.style.display = "block"
      singleRepeatIcon.style.display = "none"
    }

    setTrack(parseInt(data.songId))

    // set shuffle icon property
    if (shuffleFlag) {
      document.documentElement.style.setProperty("--shuffle-btn", "var(--sp-green-inactive)")
      document.documentElement.style.setProperty("--shuffle-btn-hov", "var(--sp-green)")
      shuffle.style.setProperty("--shuffle-dot", "block")
    }
    else {
      document.documentElement.style.setProperty("--shuffle-btn", "var(--btn-inactive)")
      document.documentElement.style.setProperty("--shuffle-btn-hov", "var(--white)")
      shuffle.style.setProperty("--shuffle-dot", "none")
    }

  }
  else {
    currentSong.volume = volumeBar.value / 100
  }
}


function saveSettings() {
  settings.volume = volumeBar.value / 100
  settings.songId = currentSong.dataset.id
  settings.likedSongsList = likedSongs
  settings.rewindSongsList = rewindSongs
  settings.repeat = repeatFlag
  settings.shuffle = shuffleFlag
  localStorage.setItem("settings", JSON.stringify(settings));
}


function muteSong() {
  vol100.style.display = "none"
  muted.style.display = "block"
  // store volume in a variable before muting
  currSongVol = volumeBar.value / 100
  volumeBar.value = 0
  currentSong.volume = 0
  volumeBar.style.setProperty("--volume-lvl", `0%`)
}


function unmuteSong() {
  vol100.style.display = "block"
  muted.style.display = "none"
  currSongVol == 0 ? currSongVol = 0.01 : null
  currentSong.volume = currSongVol
  volumeBar.value = currSongVol * 100
  volumeBar.style.setProperty("--volume-lvl", `${volumeBar.value}%`)
}


function playTrack() {
  currentSong.play()
  currTrack.querySelector(".album-art").classList.add("img-play-gif")
  useless.querySelector(".album-art").classList.add("img-play-gif")
  play_pause.querySelector(".playing").style.display = "block"
  play_pause.querySelector(".paused").style.display = "none"
  currPl.querySelector(".playing").style.display = "block"
  currPl.querySelector(".paused").style.display = "none"
  prevPl.querySelector(".playing").style.display = "none"
  prevPl.querySelector(".paused").style.display = "block"
  marqueeAnimation()
  saveSettings()
}


function pauseTrack() {
  currentSong.pause()
  currTrack.querySelector(".album-art").classList.remove("img-play-gif")
  useless.querySelector(".album-art").classList.remove("img-play-gif")
  play_pause.querySelector(".playing").style.display = "none"
  play_pause.querySelector(".paused").style.display = "block"
  currPl.querySelector(".playing").style.display = "none"
  currPl.querySelector(".paused").style.display = "block"
  document.querySelector(".current-song-details h3").classList.remove("marquee")
}


function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes);
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}


function marqueeAnimation() {
  // animation to move text within its container
  let e = document.querySelector(".current-song-details h3")
  if (e.scrollWidth > e.clientWidth && !currentSong.paused) {
    e.style.setProperty("--marquee-width", `-${e.scrollWidth - e.clientWidth}px`)
    e.classList.add("marquee")
  }
}


function songShuffle(array, index) {
  // Move the specified element to the first position
  [array[0], array[index]] = [array[index], array[0]]

  for (let i = array.length - 1; i > 2; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i - 1)) + 1;
    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}


function sortSongsByName(array) {
  return array.toSorted((a, b) => {
    const nameA = a.trackName.toUpperCase(); // ignore upper and lowercase
    const nameB = b.trackName.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1; //nameA comes first
    }
    if (nameA > nameB) {
      return 1; // nameB comes first
    }
    return 0; // names must be equal
  });
}


function likedSongsPlaylistFunction() {
  trackCount.innerText = ""
  musicList.innerHTML = ""
  currentPl.innerText = "Liked Songs"
  if (likedSongs.length > 0) {
    let likedSongsData = likedSongs.map(songId => songsObject.songs.find(song => song.id === songId)).filter(song => song !== undefined)
    displaySongList(likedSongsData)
  }
}


function displaySongList(list) {
  // displays the songs in the musicList area
  abc == displayedPl ? queue = [] : ""
  displayedQueue = []
  // set the library name
  trackCount.innerText = ` • ${list.length} songs`
  // loop through each song
  list.forEach(song => {
    // create a list of all the songs
    abc == displayedPl ? queue.push(song.id) : ""
    displayedQueue.push(song.id)
    // queue.push(song.id)
    musicList.innerHTML += `
      <li>
        <a href="#" class="song flex pointer" tabindex="-1" data-id="${song.id}">
          <div class="album-art ${song.cover ? "img-play-btn" : ""}">
            <img src="${song.cover}" alt="">
          </div>
          <div class="song-details lib-collapse">
            <h3>${song.trackName}</h3>
            <span>${song.artist} • ${song.album}</span>
          </div>
        </a>
      </li>
    `
  });

  if (displayedPl == currPl && currentSong.src) {
    useless = document.querySelector(`.song[data-id="${queue.includes(parseInt(currentSong.dataset.id)) ? currentSong.dataset.id : queue[0]}"]`)
    useless ? (useless.classList.add("now-playing"), useless.querySelector(".album-art").classList.add(currentSong.paused ? "img-play-svg" : "img-play-gif")) : ""
  }

  if (shuffleFlag) {
    abc == displayedPl ? currSongIndex = 0 : currSongIndex = queue.indexOf(parseInt(currentSong.dataset.id))
    queue = songShuffle([...queue], currSongIndex)
  }

  //! add event listener to each song
  document.querySelectorAll(".song").forEach(e => {
    e.addEventListener("click", () => {
      let songId = e.dataset.id
      // update layout if song is played
      if (screen.width < 676) {
        document.querySelector(".player-container").style.display = "flex"
        document.querySelector(".container").style.setProperty("--cont-height", "62px")
        document.querySelector(".menu").style.setProperty("--menu-height", "78px")
        currentSong.volume = 1
      }
      shuffleFlag ? queue = songShuffle([...displayedQueue], 0) : queue = displayedQueue
      prevPl = currPl
      currPl = abc = displayedPl
      setTrack(parseInt(songId))
      playTrack()
    })
  })
}


async function getSongsData() {
  const response = await fetch("./data.json")
  const result = await response.json()
  return result
}


async function main() {
  await loadSettings()
  songsObject = await getSongsData();
  // get the music list container element
  musicList = document.querySelector(".music-list")
  displaySongList(sortSongsByName(songsObject.songs))

  // setTrack(parseInt(data.songId))

  // get the playlists container element
  playlistsContainer = document.querySelector("#cards-container-1")
  // loop through each playlist
  songsObject.playlists.forEach(playlist => {
    playlistsContainer.innerHTML += `
      <a href="#" class="pl-card dynamicPlaylist rounded pointer" data-category="${playlist.category}">
        <div class="relative pl-img-wrapper">
          <img class="rounded"
            src="${playlist.albumArt}"
            alt="${playlist.playlistName}">
          <button class="play-btn unset absolute flex justify-center item-center pointer">
            <svg class="paused" viewBox="0 0 24 24">
              <path
                d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
              </path>
            </svg>
            <svg class="playing" viewBox="0 0 24 24">
              <path
                d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z">
              </path>
            </svg>
          </button>
        </div>
        <div>
          <h4>${playlist.playlistName}</h4>
          <p>${playlist.desc}</p>
        </div>
      </a>
    `
  })

  document.querySelectorAll(".dynamicPlaylist").forEach(pl => {
    let filteredSongs = songsObject.songs.filter(e => e.tags.includes(pl.dataset.category))

    //! event listener for loading selected playlist
    pl.addEventListener("click", () => {
      displayedPl = pl
      musicList.innerHTML = ""
      trackCount.innerText = ""
      currentPl.innerText = pl.querySelector("h4").innerText
      if (filteredSongs.length > 0) {
        displaySongList(filteredSongs)
      }
    })

    //! event listener for playing selected playlist
    pl.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation()
      displayedPl = pl
      abc = pl
      musicList.innerHTML = ""
      trackCount.innerText = ""
      currentPl.innerText = pl.querySelector("h4").innerText
      if (filteredSongs.length > 0) {
        displaySongList(filteredSongs)
        if (currPl != pl) {  // check if this is new playlist
          prevPl = currPl
          currPl = pl
          setTrack(queue[0])
        }
        if (currentSong.paused) {
          playTrack()
        }
        else {
          pauseTrack()
        }
      }
    })
  })

  //! This eventlistener disables the right click context menu
  document.addEventListener('contextmenu', e => e.preventDefault());

  //! event listener for playing and pausing the track
  play_pause.addEventListener("click", () => {
    if (currentSong.paused) {
      playTrack()
    }
    else {
      pauseTrack()
    }
  })

  //! event handler for checking if the song has ended
  currentSong.addEventListener("ended", () => {
    seekBar.value = 0
    seekBar.style.setProperty("--seekBar-pos", `0%`)
    play_pause.querySelector(".playing").style.display = "none"
    play_pause.querySelector(".paused").style.display = "block"
    currPl.querySelector(".playing").style.display = "none"
    currPl.querySelector(".paused").style.display = "block"
    currSongIndex = queue.indexOf(parseInt(currentSong.dataset.id))
    if (currSongIndex < queue.length - 1) {
      setTrack(queue[currSongIndex + 1])
      playTrack()
    }

    else if (repeatFlag == "all-song") {
      setTrack(queue[0])
      playTrack()
    }
    else {
      setTrack(queue[0])
      saveSettings()
    }
    seekBar.value = 0
  })

  let seek = true
  //! event handler for playback time and seekbar update
  currentSong.addEventListener("timeupdate", () => {
    if (seek) {
      currentTime.innerText = secondsToMinutes(currentSong.currentTime)
      duration.innerText = secondsToMinutes(currentSong.duration)
      songTimePercent = (currentSong.currentTime / currentSong.duration) * 100

      // add to repeatSongs if listened to full song
      if (songTimePercent > 98) {
        if (!repeatSongs.includes(parseInt(currentSong.dataset.id))) {
          repeatSongs.unshift(parseInt(currentSong.dataset.id))
        }
        if (!rewindSongs.includes(parseInt(currentSong.dataset.id))) {
          rewindSongs.unshift(parseInt(currentSong.dataset.id))
          rewindSongs = rewindSongs.slice(0, 10)
          saveSettings()
        }
      }
      // move seekbar
      seekBar.style.setProperty("--seekBar-pos", `${songTimePercent}%`)
      seekBar.value = songTimePercent * 10
    }
  })

  let clickedPos = 0
  //! add seekbar event listener to seek songs
  seekBar.addEventListener("input", (e) => {
    seek = false
    if (currentSong.src) {
      clickedPos = e.target.value / 10
      seekBar.style.setProperty("--seekBar-pos", `${clickedPos}%`)
      // update timestamp in real time
      currentTime.innerText = secondsToMinutes((clickedPos / 100) * currentSong.duration)
    }
  })

  //! update song time when finished seeking
  seekBar.addEventListener("mouseup", () => {
    seek = true
    currentSong.currentTime = (currentSong.duration * clickedPos) / 100
  })

  //! update song time when finished seeking
  seekBar.addEventListener("keyup", (e) => {
    e.preventDefault()
    if (e.key != "Tab") {
      seek = true
      clickedPos = e.target.value / 10
      currentSong.currentTime = (currentSong.duration * clickedPos) / 100
    }
  })

  //! update song time when finished seeking
  seekBar.addEventListener("touchend", () => {
    seek = true
    currentSong.currentTime = (currentSong.duration * clickedPos) / 100
  })

  //! add event listener for hamburger button
  hamburger.addEventListener("click", () => {
    menu.style.left = "8px"
    document.querySelector(".content-container").style.filter = "blur(3px)"
  })

  //! add event listener for hamburger collapse button
  hamCollapse.addEventListener("click", () => {
    menu.style.left = "-500px"
    document.querySelector(".content-container").style.filter = "blur(0)"
  })

  //! add event listener for volume button
  volumeBar.addEventListener("input", (e) => {
    volumeBar.style.setProperty("--volume-lvl", `${e.target.value}%`)
    if (e.target.value > 0) {
      vol100.style.display = "block"
      muted.style.display = "none"
    }
    else {
      vol100.style.display = "none"
      muted.style.display = "block"
    }
    currSongVol = volumeBar.value / 100
    if (currentSong.src) {
      currentSong.volume = e.target.value / 100
    }
    saveSettings()
  })

  //! event listener for volume icon
  volIcon.addEventListener("click", () => {
    if (volumeBar.value > 0) {
      muteSong()
    }
    else {
      unmuteSong()
    }
    saveSettings()
  })

  //! update layout according to screen size
  addEventListener("resize", () => {
    marqueeAnimation()
    if (screen.width < 676 && currentSong.src) {
      document.querySelector(".player-container").style.display = "flex"
      document.querySelector(".container").style.setProperty("--cont-height", "62px")
      document.querySelector(".menu").style.setProperty("--menu-height", "78px")
      currentSong.volume = 1
    }
    else if (screen.width < 676) {
      document.querySelector(".container").style.setProperty("--cont-height", "0px")
      document.querySelector(".menu").style.setProperty("--menu-height", "16px")
    }
    else if (screen.width > 676) {
      document.querySelector(".menu").style.setProperty("--menu-height", "91px")
      document.querySelector(".container").style.setProperty("--cont-height", "75px")
      currentSong.volume = volumeBar.value / 100
    }

    if (screen.width < 769 && libCollapsed) {
      libCollapsed = !libCollapsed
      library.querySelector(".defaultLib").style.display = "block"
      library.querySelector(".collapsedLib").style.display = "none"
      document.querySelector(".menu").style.minWidth = "420px"
      document.querySelector(".menu").style.width = "auto"
      document.querySelectorAll(".lib-collapse").forEach(e => e.style.display = "block")
    }
  })

  //! event listener for previous song button
  prev.addEventListener("click", () => {
    prev.disabled = true
    currSongIndex = queue.indexOf(parseInt(currentSong.dataset.id))
    if (currSongIndex > 0) {
      setTrack(queue[currSongIndex - 1])
      playTrack()
    }
    else {
      setTrack(queue[queue.length - 1])
      playTrack()
    }
  })

  //! event listener for next song button
  next.addEventListener("click", () => {
    next.disabled = true
    currSongIndex = queue.indexOf(parseInt(currentSong.dataset.id))
    if (currSongIndex < queue.length - 1) {
      setTrack(queue[currSongIndex + 1])
      playTrack()
    }
    else {
      setTrack(queue[0])
      playTrack()
    }
  })

  //! event listener for shuffle button
  shuffle.addEventListener("click", () => {
    if (!shuffleFlag) {
      currSongIndex = queue.indexOf(parseInt(currentSong.dataset.id))
      queue = songShuffle([...queue], currSongIndex)
      document.documentElement.style.setProperty("--shuffle-btn", "var(--sp-green-inactive)")
      document.documentElement.style.setProperty("--shuffle-btn-hov", "var(--sp-green)")
      shuffle.style.setProperty("--shuffle-dot", "block")
    }
    else {
      queue = queue.sort((a, b) => a - b)
      document.documentElement.style.setProperty("--shuffle-btn", "var(--btn-inactive)")
      document.documentElement.style.setProperty("--shuffle-btn-hov", "var(--white)")
      shuffle.style.setProperty("--shuffle-dot", "none")
    }
    shuffleFlag = !shuffleFlag
    saveSettings()
  })

  //! event listener for repeat button
  repeat.addEventListener("click", () => {
    if (repeatFlag == "no-repeat") {
      repeatFlag = "all-song"
      document.documentElement.style.setProperty("--repeat-btn", "var(--sp-green-inactive)")
      document.documentElement.style.setProperty("--repeat-btn-hov", "var(--sp-green)")
      repeat.style.setProperty("--repeat-dot", "block")
    }
    else if (repeatFlag == "all-song") {
      currentSong.loop = true
      repeatFlag = "single-song"
      defaultRepeatIcon.style.display = "none"
      singleRepeatIcon.style.display = "block"
    }
    else {
      currentSong.loop = false
      repeatFlag = "no-repeat"
      document.documentElement.style.setProperty("--repeat-btn", "var(--btn-inactive)")
      document.documentElement.style.setProperty("--repeat-btn-hov", "var(--white)")
      repeat.style.setProperty("--repeat-dot", "none")
      defaultRepeatIcon.style.display = "block"
      singleRepeatIcon.style.display = "none"
    }
    saveSettings()
  })

  let cards = document.querySelectorAll(".music-list .song")
  //!  navigate list using arrow keys
  musicList.addEventListener("keydown", (e) => {
    let focusedElement = document.activeElement;
    let index = Array.from(cards).indexOf(focusedElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault(); // Prevent scrolling
      if (index < cards.length - 1) {
        cards[index + 1].focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); // Prevent scrolling
      if (index > 0) {
        cards[index - 1].focus();
      }
    }
  })

  //! event listener for like button
  likeBtn.addEventListener("click", () => {
    if (likedSongs.includes(parseInt(currentSong.dataset.id))) {
      likedSongs = likedSongs.filter(e => e != parseInt(currentSong.dataset.id))
      likeBtn.classList.remove("btn-like-animation1")
      likeBtn.classList.add("btn-like-animation2")
      defaultLikeIcon.style.display = "block"
      fillLikeIcon.style.display = "none"
      saveSettings()
    }
    else {
      likedSongs.unshift(parseInt(currentSong.dataset.id))
      likeBtn.classList.add("btn-like-animation1")
      likeBtn.classList.remove("btn-like-animation2")
      defaultLikeIcon.style.display = "none"
      fillLikeIcon.style.display = "block"
      saveSettings()
    }
    likedSongCard.querySelector("span").innerText = likedSongs.length;
  });

  // display no of liked songs in the liked songs card
  likedSongCard.querySelector("span").innerText = likedSongs.length;

  //! event listener for loading liked songs playlist
  document.querySelectorAll(".liked-song-card").forEach((card) => {
    card.addEventListener("click", () => {
      displayedPl = likedSongCard
      likedSongsPlaylistFunction()
    })

  });

  //! event listener for playing liked songs playlist
  document.querySelectorAll(".liked-song-card").forEach((card) => {
    card.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation()
      displayedPl = likedSongCard
      abc = likedSongCard
      likedSongsPlaylistFunction()
      if (likedSongs.length > 0) {
        if (currPl != likedSongCard) {
          prevPl = currPl
          currPl = likedSongCard
          setTrack(queue[0])
        }
        if (currentSong.paused) {
          playTrack()
        }
        else {
          pauseTrack()
        }
      }
    })
  });

  //! event listener for loading all songs
  document.querySelectorAll(".all-song-card").forEach((card) => {
    card.addEventListener("click", () => {
      displayedPl = allSongCard
      musicList.innerHTML = ""
      trackCount.innerText = ""
      currentPl.innerText = "All Songs"
      displaySongList(sortSongsByName(songsObject.songs))
    });
  });

  //! event listener for playing all songs
  document.querySelectorAll(".all-song-card").forEach((card) => {
    card.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation()
      displayedPl = allSongCard
      abc = allSongCard
      musicList.innerHTML = ""
      trackCount.innerText = ""
      currentPl.innerText = "All Songs"
      displaySongList(sortSongsByName(songsObject.songs))
      if (currPl != allSongCard) {
        prevPl = currPl
        currPl = allSongCard
        setTrack(queue[0])
      }
      if (currentSong.paused) {
        playTrack()
      }
      else {
        pauseTrack()
      }
    });
  });

  //! event listener for loading on-repeat songs
  document.querySelectorAll(".repeat-song-card").forEach((card) => {
    card.addEventListener("click", () => {
      displayedPl = repeatSongCard
      musicList.innerHTML = ""
      trackCount.innerText = ""
      currentPl.innerText = "On Repeat"
      if (repeatSongs.length > 0) {
        let repeatSongsData = repeatSongs.map(songId => songsObject.songs.find(song => song.id === songId)).filter(song => song !== undefined)
        displaySongList(repeatSongsData)
      }
    })

  });

  //! event listener for playing on-repeat songs
  document.querySelectorAll(".repeat-song-card").forEach((card) => {
    card.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation()
      displayedPl = repeatSongCard
      abc = repeatSongCard
      musicList.innerHTML = ""
      trackCount.innerText = ""
      currentPl.innerText = "On Repeat"
      if (repeatSongs.length > 0) {
        let repeatSongsData = repeatSongs.map(songId => songsObject.songs.find(song => song.id === songId)).filter(song => song !== undefined)
        displaySongList(repeatSongsData)
        if (currPl != repeatSongCard) {  // check if this is new playlist
          prevPl = currPl
          currPl = repeatSongCard
          setTrack(queue[0])
        }
        if (currentSong.paused) {
          playTrack()
        }
        else {
          pauseTrack()
        }
      }
    })

  });

  //! event listener for loading repeat-rewind songs
  document.querySelectorAll(".rewind-song-card").forEach((card) => {
    card.addEventListener("click", () => {
      displayedPl = rewindSongCard
      musicList.innerHTML = ""
      trackCount.innerText = ""
      currentPl.innerText = "Repeat Rewind"
      if (rewindSongs.length > 0) {
        let rewindSongsData = rewindSongs.map(songId => songsObject.songs.find(song => song.id === songId)).filter(song => song !== undefined)
        displaySongList(rewindSongsData)
      }
    })

  });

  //! event listener for playing repeat-rewind songs
  document.querySelectorAll(".rewind-song-card").forEach((card) => {
    card.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation()
      displayedPl = rewindSongCard
      abc = rewindSongCard
      musicList.innerHTML = ""
      trackCount.innerText = ""
      currentPl.innerText = "Repeat Rewind"
      if (rewindSongs.length > 0) {
        let rewindSongsData = rewindSongs.map(songId => songsObject.songs.find(song => song.id === songId)).filter(song => song !== undefined)
        displaySongList(rewindSongsData)
        if (currPl != rewindSongCard) {  // check if this is new playlist
          prevPl = currPl
          currPl = rewindSongCard
          setTrack(queue[0])
        }
        if (currentSong.paused) {
          playTrack()
        }
        else {
          pauseTrack()
        }
      }
    })

  });

  //! add event listener for home button
  home.addEventListener("click", () => {
    document.querySelectorAll(".on-home").forEach(e => e.style.display = "block")
    document.querySelectorAll(".on-search").forEach(e => e.style.display = "none")
    home.style.color = "var(--white)"
    home.querySelectorAll("svg").forEach(e => e.style.fill = "var(--white)")
    search.style.color = "var(--inactive)"
    search.querySelectorAll("svg").forEach(e => e.style.fill = "var(--inactive)")

    // hide search input field
    document.querySelector(".search-input-wrapper").style.display = "none"
    // hide search result element
    document.querySelector(".search-results-wrapper").style.display = "none"

    document.querySelector(".quick-links").classList.remove("hidden")
    document.title = "Spotify - Web Player: Music for everyone"
  });

  //! add event listener for search button
  search.addEventListener("click", () => {
    document.querySelectorAll(".on-home").forEach(e => e.style.display = "none")
    document.querySelectorAll(".on-search").forEach(e => e.style.display = "block")
    search.style.color = "var(--white)"
    search.querySelectorAll("svg").forEach(e => e.style.fill = "var(--white)")
    home.style.color = "var(--inactive)"
    home.querySelectorAll("svg").forEach(e => e.style.fill = "var(--inactive)")

    // show search input field
    document.querySelector(".search-input-wrapper").style.display = "block"

    document.title = "Spotify - Search"

    if (screen.width < 769) {
      menu.style.left = "-500px"
      document.querySelector(".content-container").style.filter = "blur(0)"
    }

    document.querySelector(".quick-links").classList.add("hidden")

    searchInput.value = ""
    searchInput.focus()
  });

  //! event listener for inputs
  searchInput.addEventListener("input", (e) => {
    if (!e.target.value) {
      // if the value is none, exit the function
      return
    }
    let filteredList = songsObject.songs.filter(obj => obj.trackName.toLowerCase().startsWith(e.target.value.toLowerCase()))
    filteredList = sortSongsByName(filteredList)

    let filteredArtists = songsObject.songs.filter(obj => obj.artist.toLowerCase().startsWith(e.target.value.toLowerCase()))
    filteredArtists = sortSongsByName(filteredArtists)

    let filteredAlbums = songsObject.songs.filter(obj => obj.album.toLowerCase().startsWith(e.target.value.toLowerCase()))
    filteredAlbums = sortSongsByName(filteredAlbums)

    filteredList = filteredList.concat(filteredArtists, filteredAlbums).slice(0, 4)
    filteredList = filteredList.filter((item, index) => filteredList.indexOf(item) === index);

    if (filteredList.length == 0) {
      // if the filteredList array is empty then exit the function
      document.querySelector(".search-results-wrapper").style.display = "none"
      return
    }

    // show search result element
    document.querySelector(".search-results-wrapper").style.display = "block"

    topResCard.dataset.id = filteredList[0].id
    topResCard.querySelector("img").src = filteredList[0].cover
    topResCard.querySelector("p").innerText = filteredList[0].trackName
    topResCard.querySelector("span:nth-child(1)").innerText = filteredList[0].artist
    topResCard.querySelector("span:nth-child(2)").innerText = ` • ${filteredList[0].album}`

    resultList.innerHTML = ""
    filteredList.forEach((obj) => {
      resultList.innerHTML += `
        <li>
          <a href="#" class="song-result flex pointer item-center justify-between" data-id="${obj.id}">
            <div class="song-details flex item-center">
              <div class="album-art ${obj.cover ? "img-play-btn" : ""}">
                <img src="${obj.cover}" alt="">
              </div>
              <div class="song-details">
                <h4>${obj.trackName}</h4>
                <p>${obj.artist} • ${obj.album}</p>
              </div>
            </div>
            <div class="duration">
              <span>0:00</span>
            </div>
          </a>
        </li>
      `
    });

    // set event listener to song results
    document.querySelectorAll(".song-result").forEach(e => {
      e.addEventListener("click", () => {
        currTrack.classList.remove("now-playing")
        currTrack.querySelector(".album-art").classList.remove("img-play-svg")
        useless.classList.remove("now-playing")
        useless.querySelector(".album-art").classList.remove("img-play-svg")
        queue = []
        setTrack(parseInt(e.dataset.id))
        playTrack()
      })
    })

    // set event listener to top result play button
    topResCard.querySelector(".play-btn").addEventListener("click", () => {
      currTrack.classList.remove("now-playing")
      currTrack.querySelector(".album-art").classList.remove("img-play-svg")
      useless.classList.remove("now-playing")
      useless.querySelector(".album-art").classList.remove("img-play-svg")
      queue = []
      setTrack(parseInt(topResCard.dataset.id))
      playTrack()
    });

  });

  //! event listener for input clear button
  document.querySelector(".cross-ico").addEventListener("click", () => {
    searchInput.value = ""
  });

  let libCollapsed = false
  //! add event listener to collapse library
  library.addEventListener("click", () => {
    if (screen.width < 769) {
      return
    }

    if (libCollapsed) {
      library.querySelector(".defaultLib").style.display = "block"
      library.querySelector(".collapsedLib").style.display = "none"
      document.querySelector(".music-list").style.padding = "4px 8px"
      document.querySelector(".menu").style.minWidth = "420px"
      document.querySelector(".menu").style.width = "auto"
      document.querySelectorAll(".lib-collapse").forEach(e => e.style.display = "block")
    }

    else {
      library.querySelector(".defaultLib").style.display = "none"
      library.querySelector(".collapsedLib").style.display = "block"
      document.querySelector(".music-list").style.padding = "4px 0px 4px 4px"
      document.querySelector(".menu").style.minWidth = "auto"
      document.querySelector(".menu").style.width = "72px"
      document.querySelectorAll(".lib-collapse").forEach(e => e.style.display = "none")
    }

    libCollapsed = !libCollapsed
  });

}

main()
