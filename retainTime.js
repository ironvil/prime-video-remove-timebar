function initiateOnVideoStart() {
    const interval = setInterval(() => {
        let video = getVideo();
        if (video !== undefined && !video.paused) {
            setTimeout(initiate, 500);
            clearInterval(interval)
        }
    }, 1000)
}

initiateOnVideoStart();


document.querySelectorAll('[data-testid=standard-carousel]').forEach((carousel)=> {
    if(carousel.querySelector("[data-testid=carousel-title]").textContent.toLowerCase().includes("upcoming")){
        carousel.style.display = "none"
    }
})

function initiate() {
    const title = document.querySelector('[data-automation-id="title"]').textContent;
    log(title)
    chrome.storage.local.get(() => {
        chrome.storage.local.get(["times"]).then((result) => {
            const times = result.times || {};
            log("initial times", times)
            const currentTime = times[title];
            if (currentTime) {
                setCurrentTime(currentTime)
            }
            updateTimesOnInterval(times, title)
        })
    })
}

function getVideo(){
    return document.querySelectorAll("video")[0]
}

function getCurrentTime(){
    return getVideo().currentTime
}

function setCurrentTime(time){
    getVideo().currentTime = time
}

function getIsOnPlayScreen(){
    return getComputedStyle(document.querySelector('[id=dv-web-player]')).display !== "none"
}

function updateTimesOnInterval(times, title){
    const updatedTimes = times ? times : {}
    let lastUpdateTime = getCurrentTime();
    const interval = setInterval(()=> {
        if(getIsOnPlayScreen()){
            updatedTimes[title] = getCurrentTime();
            if(Math.abs(getCurrentTime() - lastUpdateTime ) > 5) {
                log("setting times", updatedTimes[title])
                lastUpdateTime = getCurrentTime();
            }
            chrome.storage.local.set({"times": updatedTimes})
        } else {
            log("video closed, returning to initial state")
            clearInterval(interval)
            initiateOnVideoStart()
        }
    }, 500)
}

function log(...messages){
    console.log("[remove-timebar]:", ...messages)
}