let wrapper = document.querySelector(".wrapper");
let musicImg = document.querySelector(".img");
let musicName = document.querySelector(".song_name");
let artisteName = document.querySelector(".artiste_name");
let mainAudio = document.querySelector("#main_audio");
let playPause = document.querySelector(".play-pause");
let prevBtn = document.querySelector(".fa-step-backward");
let nextBtn = document.querySelector(".fa-step-forward");
let progressBar = document.querySelector(".progress_bar");
let progressArea = document.querySelector(".progress_area");
let repeat = document.querySelector(".fa-random");


var index = 0;

window.addEventListener("load", () => {
    loadMusic(index);
    playingNow();
    
})

function loadMusic(indexNumb) {
    musicImg.src = musicList[indexNumb].img;
    musicName.innerText = musicList[indexNumb].name;
    artisteName.innerText = musicList[indexNumb].artiste;
    mainAudio.src = musicList[indexNumb].src;

}

// Play Music

playPause.addEventListener("click", function () {
    const checkPlay = wrapper.classList.contains("play");
    if (checkPlay == false) {
        playMusic();
    } else {
        pauseMusic();
    }
});




function playMusic() {
    wrapper.classList.add("play");
    mainAudio.play()
    playPause.querySelector("i").setAttribute("class", "fa-solid fa-circle-pause fa-2x")
    musicImg.classList.add("popping");
}
function pauseMusic() {
    wrapper.classList.remove("play");
    mainAudio.pause();
    playPause.querySelector("i").setAttribute("class", "fa-solid fa-circle-play fa-2x")
    musicImg.classList.remove("popping");
}





// Next and Previous Music Buttons
nextBtn.addEventListener("click", nextMusic)
prevBtn.addEventListener("click", prevMusic)

function nextMusic() {
    if (index > musicList.length - 1) {
        index = 0
        loadMusic(index)
        playMusic()
        playingNow()
    } else {
        index++
        loadMusic(index)
        playMusic();
        playingNow()
    }
}

function prevMusic() {
    if (index < 0) {
        index = musicList.length - 1;
        loadMusic(index)
        mainAudio.play();
        wrapper.classList.add("play");
        playPause.querySelector("i").setAttribute("class", "fa-solid fa-circle-pause fa-2x")
        playingNow()
    } else {
        index--
        loadMusic(index);
        mainAudio.play();
        wrapper.classList.add("play");
        playPause.querySelector("i").setAttribute("class", "fa-solid fa-circle-pause fa-2x")
        playingNow()

    }
}

mainAudio.addEventListener("ended", () => {
    let getClass = repeat.getAttribute("class");
    switch (getClass) {
        case "fa fa-repeat fa-2x":
            mainAudio.currentTime = 0;
            loadMusic(index);
            playMusic();

            break;
        case "fa fa-random fa-2x":
            let randomIndex = Math.floor(Math.random() * musicList.length);
            do {
                randomIndex = Math.floor(Math.random() * musicList.length);
            } while (index == randomIndex);
            {
                index = randomIndex;
                loadMusic(index);
                playMusic();
                break;
            }
        case "fa fa-exchange fa-2x":
            loadMusic(index);
            nextMusic()
            playMusic();
            break;
    }
})

mainAudio.addEventListener("timeupdate", function (e) {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`


    let musicCurrentTime = document.querySelector(".current");
    let musicDuration = document.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        let audioDuration = mainAudio.duration;
        let totalMinute = Math.floor(audioDuration / 60);
        let totalSeconds = Math.floor(audioDuration % 60);

        if (totalSeconds < 10) {
            totalSeconds = `0${totalSeconds}`;

        }
        musicDuration.innerText = `${totalMinute}:${totalSeconds}`;


    })
    let audioCurrentTime = mainAudio.currentTime;
    let currentMinute = Math.floor(audioCurrentTime / 60);
    let currentSeconds = Math.floor(audioCurrentTime % 60);

    if (currentSeconds < 10) {
        currentSeconds = `0${currentSeconds}`;
    }
    musicCurrentTime.innerText = `${currentMinute}:${currentSeconds}`;
})


repeat.addEventListener("click", () => {
    let getClass = repeat.getAttribute("class");
    switch (getClass) {
        case "fa fa-repeat fa-2x":
            repeat.setAttribute("class", "fa fa-random fa-2x");
            break;
        case "fa fa-random fa-2x":
            repeat.setAttribute("class", "fa fa-exchange fa-2x");
            break;
        case "fa fa-exchange fa-2x":
            repeat.setAttribute("class", "fa fa-repeat fa-2x");
            break;

    }

})


progressArea.addEventListener("click", function (e) {
    let progressWidthValue = progressArea.clientWidth;
    let clickOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickOffsetX / progressWidthValue) * songDuration;
})

let hiddenMusicList = document.querySelector(".music_list");
let showMoreBtn = document.querySelector(".fa-music");
let hideMoreBtn = document.querySelector(".close")

showMoreBtn.addEventListener("click", () => {
    hiddenMusicList.classList.toggle("show")
})

hideMoreBtn.addEventListener("click", () => {
    showMoreBtn.click();
})


const ulTag = document.querySelector("ul");


for (let i = 0; i < musicList.length; i++) {
    let liTags = `
                        <li li-index= "${i}">
                            <div class="hidden_song_details">
                                <h1>${musicList[i].name}</h1>
                                <p>${musicList[i].artiste}</p>
                                <audio class="${musicList[i].unique}" src="${musicList[i].src}"></audio>
                            </div>
                            <p class="hidden_song_duration" id="${musicList[i].unique}"></p>      
                        </li>
                        <hr>
                        
                `

    ulTag.insertAdjacentHTML("beforeend", liTags);

    let hiddenAudioTag = ulTag.querySelector(`.${musicList[i].unique}`);
    let hiddenAudioDuration = ulTag.querySelector (`#${musicList[i].unique}`);

    hiddenAudioTag.addEventListener("loadeddata", function () {
        let audioDuration = hiddenAudioTag.duration;
        let totalMinute = Math.floor(audioDuration / 60);
        let totalSeconds = Math.floor(audioDuration % 60);

        if (totalSeconds < 10) {
            totalSeconds = `0${totalSeconds}`;
        }
        hiddenAudioDuration.innerText = `${totalMinute}:${totalSeconds}`;
        hiddenAudioDuration.setAttribute("t-duration", `${totalMinute}:${totalSeconds}`);
    });
};


const allLiTags = ulTag.querySelectorAll("li");

function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioLiTags = allLiTags[j].querySelector(".hidden_song_duration");
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            let audioDuration = audioLiTags.getAttribute("t-duration");
            audioLiTags.innerText = audioDuration;
        }
        if (allLiTags[j].getAttribute("li-index") == index) {
            allLiTags[j].classList.add("playing");
            audioLiTags.innerText = "Playing";
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)")

    }
}

function clicked(element){
    let getIndex = element.getAttribute("li-index");
    index = getIndex;
    loadMusic(index);
    playMusic();
    playingNow();
}