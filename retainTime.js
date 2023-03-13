
const interval = setInterval(()=> {
    let video = getVideo();
    if(video !== undefined && !video.paused){
        initiate();
        clearInterval(interval)
    }
}, 1000)


function initiate() {
    const title = document.querySelector('[data-automation-id="title"]').textContent;
    console.log(title)
    chrome.storage.local.get(() => {
        chrome.storage.local.get(["times"]).then((result) => {
            const times = result.times || {};
            console.log("initial times", times)
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
    return document.querySelectorAll("video")[0].currentTime
}

function setCurrentTime(time){
    document.querySelectorAll("video")[0].currentTime = time
}

function updateTimesOnInterval(times, title){
    const updatedTimes = times ? times : {}
    setInterval(()=> {
        updatedTimes[title] = getCurrentTime();
        console.log("setting times", JSON.stringify(updatedTimes))
        chrome.storage.local.set({"times": updatedTimes})
    }, 5000)
}