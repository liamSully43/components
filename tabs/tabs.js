$(".tabs").each((i, tab) => {
    $(tab).find(".button-container .tab-button").each((j, bttn) => {
        $(bttn).on("click", function(event) {
            event.preventDefault();
            $(tab).find(".button-container .tab-button").removeClass("active");
            $(bttn).addClass("active");

            const ref = $(bttn).attr("data-ref");
            if(ref) {
                $(tab).find(".tabs-container .tab").removeClass("active");
                $(tab).find(`.tabs-container .tab[data-ref="${ref}"]`).addClass("active");
            }
        })
    })
})