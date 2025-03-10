const cursor = document.querySelector(".cursor-container");
let xDest = 0;
let yDest = 0;
window.addEventListener("mousemove", function(event) {
    xDest = event.clientX;
    yDest = event.clientY;
    lerp(true);
});

let loop = false;
function lerp(init) {
    if(init && !loop) {
        // first time loop is being called - set the interval
        loop = setInterval(lerp, 20);
    }
    if(init && loop) {
        // loop being called again from mousemove event
        return;
    }
 

    const pos = cursor.getClientRects()[0];
    let currentX = pos.left;
    let currentY = pos.top;
    const xDiff = (xDest - currentX) * 0.1;
    const yDiff = (yDest - currentY) * 0.1;
    currentX += xDiff;
    currentY += yDiff;
    if(xDiff <= 0.01 && yDiff <= 0.01) {
        console.log("clear");
        clearInterval(loop);
        loop = false;
        currentX = xDest;
        currentY = yDest;
    }
    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;
}