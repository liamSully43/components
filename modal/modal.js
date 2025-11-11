$(window).on("load", function() {
    $(".modal-link").each((i, link) => {
        $(link).on("click", function() {
            // show modal
            const ref = $(link).attr("data-ref");
            if(ref) {
                $(`#${ref}`).addClass("active");
            }

            // update youtube video iframe, if button has a YouTube ID
            const ytID = $(link).attr("data-yt");
            if(ytID) {
                const src = `https://www.youtube-nocookie.com/embed/${ytID}?controls=0&autoplay=1`;
                $(`#${ref} iframe`).attr("src", src);
            }
        });
    })

    $(".close").each((i, bttn) => {
        $(bttn).on("click", function() {
            $(bttn).parents(".modal").removeClass("active");

            // reset iframe if iframe exists
            if($(bttn).parents(".modal").find("iframe").length > 0) {
                $(bttn).parents(".modal").find("iframe").attr("src", "");
            }
        })
    })
})