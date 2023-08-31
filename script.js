import { data } from './data.js'

document.addEventListener("DOMContentLoaded", function() {
    initialize();
});

function initialize() {
    const first = window.location.href.split("=")[1] || Math.floor(Math.random()*data.length);
    const queue = [first];
    var queuePosition = 0;

    const forward = document.getElementById("forward");
    const backward = document.getElementById("backward");

    function forwardAction() {
        queuePosition += 1
        display(queue, queuePosition);
    }
    function backwardAction() {
        queuePosition += -1
        display(queue, queuePosition);
    }
    
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

    display(queue, queuePosition);
}

function display(queue, queuePosition) {
    let item = data[queue[queuePosition]];
    document.getElementById("caption").innerHTML = item[0];
    document.getElementById("image").setAttribute("src", item[1]);
    document.getElementById("credit").innerHTML = item[2];

    if (queuePosition === 0) {
        document.getElementById("backward").style.opacity = 0.2;
    } else {
        document.getElementById("backward").style.opacity = 1;
    }
    if (queuePosition === queue.length - 1) {
        queue.push(Math.floor(Math.random()*data.length))
    }

    window.history.pushState("", "", "?id=" + queue[queuePosition]);
    preload(queue[queuePosition + 1]);
}

function preload(itemNumber) {
    let photo = data[itemNumber][1];
    let preload = new Image();
    preload.src = photo;
}