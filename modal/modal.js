window.onload = function() {
    // open modals
    const modalLinks = document.querySelectorAll(".modal-link");
    for(let modalLink of modalLinks) {
        modalLink.addEventListener("click", function() {
            const ref = modalLink.dataset.ref;
            if(ref) {
                document.querySelector(`#${ref}`).classList.add("active");
            }
        });
    }

    // close modals
    const closeBttns = document.querySelectorAll(".close");
    for(let close of closeBttns) {
        close.addEventListener("click", function() {
            if(close.parentElement.classList.contains("modal")) {
                // direct parent
                close.parentElement.classList.remove("active");
            }
            else if(close.parentElement.parentElement.classList.contains("modal")) {
                // close button placed inside .content
                close.parentElement.parentElement.classList.remove("active");
            }
        })
    }
}