const carousels = $(".carousel");
carousels.each((i, carousel) => {
    // unique id
    const id = $(carousel).attr("id");

    // add classes if they don't already exist
    if($(`#${id} .carousel-container .slide.active`).length < 1) {
        $(`#${id} .carousel-container .slide:first-of-type`).addClass("active");
    }
    if($(`#${id} .carousel-container .slide.prev`).length < 1) {
        $(`#${id} .carousel-container .slide:last-of-type`).addClass("active");
    }
    if($(`#${id} .carousel-container .slide.next`).length < 1) {
        $(`#${id} .carousel-container .slide:nth-of-type(2)`).addClass("active");
    }
    if($(`#${id} .carousel-dots .dot:first-of-type`).length > 0) {
        $(`#${id} .carousel-dots .dot:first-of-type`).addClass("active");
    }

    // event handlers
    const s = $(`#${id} .slide`);
    if(s.length > 1) {
        // only add event handlers if there is more than 1 slide
        if($(`#${id} .prev`).length > 0) {
            $(`#${id} .prev`).on("click", slidePrev);
        }
        if($(`#${id} .next`).length > 0) {
            $(`#${id} .next`).on("click", slideNext);
        }
        
        let touchStart = 0;
        $(carousel).on("touchstart", function(event) {
            touchStart = event.touches[0].clientX;
        });
        $(carousel).on("touchend", function(event) {
            const touchend = event.changedTouches[0].clientX;
            const difference = touchStart - touchend;
            if(touchStart > touchend) {
                if(difference > 10) {
                    slideNext();
                }
            }
            else {
                if(difference < -10) {
                    slidePrev();
                }
            }
        })
    }
    else {
        // hide controls
        $(`#${id} .carousel-controls`).hide();
    }

    // Auto swipe
    let autoInterval = false;
    function autoSwipe() {
        // check if carousel has auto-swipe class
        if(!$(carousel).hasClass("auto-swipe")) return;
        
        // clear interval if already triggered
        if(autoInterval) {
            clearInterval(autoInterval);
        }

        // get swipe duration
        const dataDuration = $(carousel).data("duration");
        const duration = (dataDuration) ? parseInt(dataDuration) : 5000;
        
        // interval
        autoInterval = setInterval(() => {
            slideNext();
        }, duration);
    }
    autoSwipe();
    
    // Slide left/right
    function slidePrev() {
        const sliding = checkIfSliding(false);
        if(sliding) return;
        
        const width = getWidth();
        const slides = $(`#${id} .carousel-container .slide`);
        const firstSlide = $(`#${id} .carousel-container .slide:first-of-type`);
        if($(firstSlide).hasClass("active")) {
            const newPos = 0 - (width * (slides.length - 1));
            const newVW = (newPos / window.innerWidth) * 100;
            slides.map((i, slide) => {
                $(slide).css("translate", `${newVW}vw 0px`);
            });
        }
        else {
            // slide slides
            setTimeout(() => {
                slides.map((i, slide) => {
                    let left = parseFloat($(slide).css("translate"));
                    if(isNaN(left)) left = 0; // if translate is not used on element yet, Safair will return NaN
                    const newPos = left + width;
                    const newVW = (newPos / window.innerWidth) * 100;
                    $(slide).css("translate", `${newVW}vw 0px`);
                });
            }, 15);
        }

        // reset autoswipe
        autoSwipe();

        // update classes
        slideClassesPrev();
    }
    
    function slideNext() {
        const sliding = checkIfSliding(true);
        if(sliding) return;

        // reset position if last slide is active
        const slides = $(`#${id} .carousel-container .slide`);
        const lastSlide = $(`#${id} .carousel-container .slide:last-of-type`);
        if($(lastSlide).hasClass("active")) {
            slides.map((i, slide) => {
                $(slide).css("translate", "0px 0px");
            });
        }
        else {
            // slide slides
            const width = getWidth();
            setTimeout(() => {
                slides.map((i, slide) => {
                    let left = parseFloat($(slide).css("translate"));
                    if(isNaN(left)) left = 0; // if translate is not used on element yet, Safair will return NaN
                    const newPos = left - width;
                    const newVW = (newPos / window.innerWidth) * 100;
                    $(slide).css("translate", `${newVW}vw 0px`);
                });
            }, 15);
        }

        // reset autoswipe
        autoSwipe();

        // update classes
        slideClassesNext();
    }
    
    let sliding = false;
    function checkIfSliding() {
        // check if currently sliding - prevents spam clicks from breaking carousel
        if(sliding) {
            return true;
        }
        else {
            sliding = true;
            setTimeout(() => {sliding = false}, 550);
        }
    }

    function slideClassesNext() {
        // slide classes
        const classes = ["prev", "active", "next"];
        for(let className of classes) {
            const current = $(`#${id} .carousel-container .slide.${className}`);
            current.removeClass(className);
            if(current.next().length > 0) {
                current.next().addClass(className);
            }
            else {
                $(`#${id} .carousel-container .slide:first-of-type`).addClass(className);
            }
        }

        // dots classes
        if($(`#${id} .carousel-dots .dot`).length > 0) {
            const current = $(`#${id} .carousel-dots .dot.active`);
            $(current).removeClass("active");

            if($(current).next().length > 0) {
                $(current).next().addClass("active");
            }
            else {
                $(`#${id} .carousel-dots .dot:first-of-type`).addClass("active");
            }
        }
    }

    function slideClassesPrev() {
        // slide classes
        const classes = ["prev", "active", "next"];
        for(let className of classes) {
            const current = $(`#${id} .carousel-container .slide.${className}`);
            current.removeClass(className);
            if(current.prev().length > 0) {
                current.prev().addClass(className);
            }
            else {
                $(`#${id} .carousel-container .slide:last-of-type`).addClass(className);
            }
        }

        // dots classes
        if($(`#${id} .carousel-dots .dot`).length > 0) {
            const current = $(`#${id} .carousel-dots .dot.active`);
            $(current).removeClass("active");

            if($(current).prev().length > 0) {
                $(current).prev().addClass("active");
            }
            else {
                $(`#${id} .carousel-dots .dot:last-of-type`).addClass("active");
            }
        }
    }
    
    function getWidth() {
        const carousel = $(`#${id}`);
        const slide = carousel.find(".slide");
        const width = parseFloat(slide.css("width"));
        const gap = parseFloat(carousel.find(".carousel-container").css("gap"));
        return width + gap;
    }

    function selectSlide(index, dots) {
        // remove classes
        $(`#${id} .slide.active`).removeClass("active");
        $(`#${id} .slide.prev`).removeClass("prev");
        $(`#${id} .slide.next`).removeClass("next");

        // add active class
        const slides = $(`#${id} .slide`);
        $(slides[index]).addClass("active");

        // add prev class
        let prevIndex = null;
        if(index > 0) {
            prevIndex = index - 1;
        }
        else {
            prevIndex = slides.length - 1;
        }
        $(slides[prevIndex]).addClass("prev");

        // add next class
        let nextIndex = null;
        if(index == (dots.length - 1)) {
            nextIndex = 0;
        }
        else {
            nextIndex = index + 1;
        }
        $(slides[nextIndex]).addClass("next");

        // update dots
        let currentIndex = 0;
        dots.each((i, dot) => {
            if($(dot).hasClass("active")) currentIndex = i;
        });
        const difference = currentIndex - index; // number of slides to slide
        $(`#${id} .dot.active`).removeClass("active");
        $(dots[index]).addClass("active");

        // move slides
        const width = getWidth() * difference;
        setTimeout(() => {
            slides.map((i, slide) => {
                let left = parseFloat($(slide).css("translate"));
                if(isNaN(left)) left = 0; // if translate is not used on element yet, Safair will return NaN
                const newPos = left + width;
                const newVW = (newPos / window.innerWidth) * 100;
                $(slide).css("translate", `${newVW}vw 0px`);
            });
        }, 15);

        // reset auto swipe
        autoSwipe();
    }
    if($(carousel).find(".carousel-dots").length > 0) {
        const dots = $(`#${id} .dot`);
        dots.each((j, dot) => {
            $(dot).on("click", () => selectSlide(j, dots));
        })
    }
})