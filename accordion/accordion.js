window.addEventListener("load", function() {
    const accordions = document.querySelectorAll(".accordion");
    for(let accordion of accordions) {
        const items = accordion.querySelectorAll(".accordion-item");
        for(let item of items) {
            const title = item.querySelector(".accordion-title");
            const body = item.querySelector(".accordion-body");
            title.addEventListener("click", function() {
                item.classList.toggle("active");
                title.classList.toggle("active");
                body.classList.toggle("active");
                if(body.classList.contains("active")) {
                    // check if all other items should be closed
                    if(accordion.classList.contains("auto-close")) {
                        closeAll(accordion, item);
                    }
                    
                    /* timeouts are used to make sure transiton properties are updated before heights are changes */
                    // remove transition
                    body.style.transition = "all 0s !important";

                    setTimeout(() => {
                        // get default height
                        body.style.height = "auto";
                        const height = body.getClientRects()[0].height;
                        // reset height
                        body.style.height = "0px";
                        // remove set transition (resets to whatever is set in CSS)
                        body.style.transition = "";

                        setTimeout(() => {
                            // set height
                            body.style.height = `${height}px`;
                        }, 20);
                    }, 20);
                }
                else {
                    body.style.height = "0px";
                }
            });
        }
    }
});

function closeAll(accordion, activeItem) {
    const items = accordion.querySelectorAll(".accordion-item");
    for(let item of items) {
        if(item == activeItem) continue;
        
        const title = item.querySelector(".accordion-title");
        const body = item.querySelector(".accordion-body");
        item.classList.remove("active");
        title.classList.remove("active");
        body.classList.remove("active");

        body.style.height = "0px";
    }
}