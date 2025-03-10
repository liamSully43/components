const items = document.querySelectorAll(".item");

window.addEventListener("scroll", function() {
    for(let item of items) {
        const pos = item.getClientRects()[0];
        const itemBreakpoint = pos.bottom;
        if(itemBreakpoint < window.innerHeight) {
            item.classList.add("active");
        }
    }
})