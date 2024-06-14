import { data } from './data.js'

document.addEventListener("DOMContentLoaded", function() {
    initialize();
});

let queuePosition = 0;
const first = window.location.href.split("=")[1] || Math.floor(Math.random()*data.length);
const queue = [first];

function initialize() {
    const forward = document.getElementById("forward");
    const backward = document.getElementById("backward");
    
    forward.addEventListener("click", forwardAction);
    backward.addEventListener("click", backwardAction);

    function keyHandler(event) {
        let keyCode = event.keyCode || event.which;
        if (keyCode === 39) {
            forwardAction();
        } else if (keyCode === 37) {
            backwardAction();
        }
    }

    window.addEventListener("keydown", keyHandler);
    window.addEventListener("resize", adjustImageHeight);

    display(queue, queuePosition);
    tentimes();
}

function forwardAction() {
    queuePosition += 1
    display(queue, queuePosition);
}
function backwardAction() {
    if (queuePosition) {queuePosition += -1}
    display(queue, queuePosition);
}

function display(queue, queuePosition) {
    let item = data[queue[queuePosition]];
    document.getElementById("caption").innerHTML = item[0];
    document.getElementById("image").setAttribute("src", item[1]);
    tentimes();
    document.getElementById("credit").innerHTML = item[2];

    if (queuePosition === 0) {
        document.getElementById("backward").style.opacity = 0.2;
    } else {
        document.getElementById("backward").style.opacity = 1;
    }
    while (queuePosition >= queue.length - 10) {
        queue.push(Math.floor(Math.random()*data.length));
    }
    window.history.pushState("", "", "?id=" + queue[queuePosition]);
    for (let i = 1; i <= 10; i++) {
        preload(queue[queuePosition + i]);
    }
}

function preload(itemNumber) {
    let photo = data[itemNumber][1];
    let preload = new Image();
    preload.src = photo;
}

function adjustImageHeight() {
    const image = document.getElementById('image');
    const stuff = document.getElementById('otherStuff');
  
    const stuffHeight = stuff.clientHeight;
    const availableHeight = window.innerHeight - stuffHeight - 50;

    if (window.innerWidth < 500) {
        image.style.width = window.innerWidth;
    } else {
        image.style.maxHeight = `${availableHeight}px`;
        if (parseInt(image.clientHeight) < parseInt(image.style.maxHeight) && parseInt(image.clientWidth) < window.innerWidth) {
            let ratioa = parseInt(image.style.maxHeight) / parseInt(image.clientHeight);
            let ratiob = window.innerWidth / parseInt(image.clientWidth);
            let ratio = Math.min(ratioa, ratiob);
            image.style.height = `${image.clientHeight * ratio}px`;
        } else if (parseInt(image.clientWidth) == window.innerWidth) {
            image.style.height = `auto`;
        }
    }
    stuff.style.maxWidth = `${image.clientWidth}px`;
  }

function tentimes() {
    let x = 10;
    let interval = 100;
    for (let i = 0; i < x; i++) {
        setTimeout(function () {
            adjustImageHeight();
        }, i * interval)
    }
}

let touchstartX = 0
let touchendX = 0
    
function checkDirection() {
  if (touchendX + 50 < touchstartX) forwardAction();
  if (touchendX > touchstartX + 50) backwardAction();
}

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
})

document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  checkDirection();
})