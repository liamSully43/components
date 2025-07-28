window.addEventListener("mousemove", function(event) {
    let mouseX = parseFloat(document.querySelector(".cursor").style.left);
    lerp(mouseX, event.clientX, value => {
        document.querySelector(".cursor").style.left = `${value}px`;
    }, 1);

    let mouseY = parseFloat(document.querySelector(".cursor").style.top);
    lerp(mouseY, event.clientY, value => {
        document.querySelector(".cursor").style.top = `${value}px`;
    }, 2);
})