// burger menu
const burgerMenus = document.querySelectorAll(".burger-menu");
for(let burgerMenu of burgerMenus) {
    burgerMenu.addEventListener("click", () => {
        burgerMenu.classList.toggle("active");

        const ref = burgerMenu.dataset.ref;
        document.querySelector(`#${ref}`).classList.toggle("active");
    })
}

// sticky menu
const stickyHeader = document.querySelector(".sticky-header");
if(stickyHeader) {
    const breakpoint = parseFloat(stickyHeader.getClientRects()[0].height) * 2;
    let lastScrollPos = document.body.scrollHeight;
    window.addEventListener("scroll", function() {
        if(window.scrollY > breakpoint) {
            const scrollDistance = window.scrollY - lastScrollPos;
            lastScrollPos = window.scrollY;
            if(scrollDistance > 0) {
                stickyHeader.classList.add("scroll-down");
            }
            else {
                stickyHeader.classList.remove("scroll-down");
            }
        }
        else {
            stickyHeader.classList.remove("scroll-down");
        }
    });
}