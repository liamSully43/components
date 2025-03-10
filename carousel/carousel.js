const carousels = $(".carousel");
carousels.each(i => {
    // unique id
    const id = $(carousels[i]).attr("id");

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
        $(carousels[i]).on("touchstart", function(event) {
            touchStart = event.touches[0].clientX;
        });
        $(carousels[i]).on("touchend", function(event) {
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
        if(!$(carousels[i]).hasClass("auto-swipe")) return;
        
        // clear interval if already triggered
        if(autoInterval) {
            clearInterval(autoInterval);
        }

        // get swipe duration
        const dataDuration = $(carousels[i]).data("duration");
        const duration = (dataDuration) ? parseInt(dataDuration) : 5000;
        
        // interval
        autoInterval = setInterval(() => {
            slideNext();
        }, duration);
    }
    autoSwipe();
    
    // Slide left/right
    function slidePrev() {
        const updated = updateActiveClass(false);
        if(!updated) return;
        
        const width = getWidth();
        const slides = $(`#${id} .carousel-container .slide`);
        slides.map(slide => {
            slide = slides[slide];
            const left = parseFloat($(slide).css("translate"));
            const newPos = left + width;
            $(slide).css("translate", `${newPos}px 0px`);
        });

        // reset autoswipe
        autoSwipe();
    }
    
    function slideNext() {
        const updated = updateActiveClass(true);
        if(!updated) return;

        const width = getWidth();
        const slides = $(`#${id} .carousel-container .slide`);
        setTimeout(() => {
            slides.map(slide => {
                slide = slides[slide];
                let left = parseFloat($(slide).css("translate"));
                if(isNaN(left)) left = 0; // if translate is not used on element yet, Safair will return NaN
                const newPos = left - width;
                $(slide).css("translate", `${newPos}px 0px`);
            });
        }, 10);

        // reset autoswipe
        autoSwipe();
    }
    
    let sliding = false;
    function updateActiveClass(forward) {
        // check if currently sliding - prevents spam clicks from breaking carousel
        if(sliding) {
            return false;
        }
        else {
            sliding = true;
            setTimeout(() => {sliding = false}, 550);
        }

        const active = $(`#${id} .carousel-container .slide.active`);
        if(forward) {
            if(active.next().length < 1) {
                // if currently on the last slide, restart
                const slides = $(`#${id} .carousel-container .slide`);
                setTimeout(() => {
                    // restart
                    slides.map(slide => {
                        slide = slides[slide];
                        $(slide).css("translate", "0px 0px");
                    });

                    // update classes
                    slideClassesNext();

                    // update dots
                    if($(`#${id} .carousel-dots .dot`).length > 0) {
                        const activeDot = $(`#${id} .carousel-dots .dot.active`);
                        activeDot.removeClass("active");
                        $(`#${id} .carousel-dots .dot:first-of-type`).addClass("active");
                    }
                }, 10);

                return false;
            }
            else {
                // update classes
                slideClassesNext();
            }

            // update dots
            if($(`#${id} .carousel-dots .dot`).length > 0) {
                const activeDot = $(`#${id} .carousel-dots .dot.active`);
                activeDot.removeClass("active");
                activeDot.next().addClass("active");
            }
        }
        else {
            if(active.prev().length < 1) {
                const slides = $(`#${id} .carousel-container .slide`);

                // move slides
                const width = getWidth() * (slides.length - 1);
                setTimeout(() => {
                    slides.map(slide => {
                        slide = slides[slide];
                        let left = parseFloat($(slide).css("translate"));
                        if(isNaN(left)) left = 0; // if translate is not used on element yet, Safair will return NaN
                        const newPos = left - width;
                        $(slide).css("translate", `${newPos}px 0px`);
                    });
                }, 10);

                // update classes
                slideClassesPrev()

                // update dots
                if($(`#${id} .carousel-dots .dot`).length > 0) {
                    const activeDot = $(`#${id} .carousel-dots .dot.active`);
                    activeDot.removeClass("active");
                    $(`#${id} .carousel-dots .dot:last-of-type`).addClass("active");
                }

                return false;
            }
            else {
                // update classes
                slideClassesPrev();
            }

            // update dots
            if($(`#${id} .carousel-dots .dot`).length > 0) {
                const activeDot = $(`#${id} .carousel-dots .dot.active`);
                activeDot.removeClass("active");
                activeDot.prev().addClass("active");
            }
        }
        setTimeout(() => active.removeClass("active"), 10); // add small delay otherwise the active class is updated incorrectly on mobile
        return true;
    }

    function slideClassesNext() {
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
    }

    function slideClassesPrev() {
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
        dots.each(i => {
            if($(dots[i]).hasClass("active")) currentIndex = i;
        });
        const difference = currentIndex - index; // number of slides to slide
        $(`#${id} .dot.active`).removeClass("active");
        $(dots[index]).addClass("active");

        // move slides
        const width = getWidth() * difference;
        setTimeout(() => {
            slides.map(slide => {
                slide = slides[slide];
                let left = parseFloat($(slide).css("translate"));
                if(isNaN(left)) left = 0; // if translate is not used on element yet, Safair will return NaN
                const newPos = left + width;
                $(slide).css("translate", `${newPos}px 0px`);
            });
        }, 10);

        // reset auto swipe
        autoSwipe();
    }
    if($(carousels[i]).find(".carousel-dots").length > 0) {
        const dots = $(`#${id} .dot`);
        dots.each(j => {
            const dot = dots[j];
            $(dot).on("click", () => selectSlide(j, dots));
        })
    }
})