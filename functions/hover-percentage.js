function hoverPercentage(selector, callback) {
    const element = document.querySelector(selector);
    element.addEventListener("mousemove", function(event) {
        const elemPos = element.getClientRects()[0];
        const maxX = elemPos.width;
        const maxY = elemPos.height;

        const mouseX = event.clientX - elemPos.left;
        const mouseY = event.clientY - elemPos.top;

        const percentageX = (mouseX / maxX) * 100;
        const percentageY = (mouseY / maxY) * 100;
        
        const roundedX = Math.round(percentageX * 100) / 100;
        const roundedY = Math.round(percentageY * 100) / 100;

        callback(roundedX, roundedY);
    })
}

///////////
// Demos //
///////////

// Update button text to percentage //
hoverPercentage(".hover-percentage", function(x, y) {
    let smaller = (x < y) ? x : y;
    document.querySelector(".hover-percentage").innerHTML = `${smaller}%`;
});

// Move background gradient element //
hoverPercentage(".background", function(x, y) {
    document.querySelector(".cursor").style.left = `${x}%`;
    document.querySelector(".cursor").style.top = `${y}%`;
});