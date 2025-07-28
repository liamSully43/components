const carousels = $(".carousel");
carousels.each((i, carousel) => {
    // unique id
    const id = $(carousel).attr("id");

    // Center active slide
    if($(carousel).hasClass("center")) {
        const slides = $(`#${id} .carousel-container .slide`);
        const activeSlide = slides.filter(".active");
        const slideIndex = slides.index(activeSlide);
        let distance = getWidth() * slideIndex;
        if(distance < 0) distance = 0;
        slides.map((i, slide) => {
            const newVW = (distance / window.innerWidth) * 100;
            $(slide).css("transform", `translateX(calc((50vw - 50%) - ${newVW}vw))`);
        });

        // add active class to dots
        if($(`#${id} .carousel-dots .dot`).length > 0) {
            const dotIndex = slideIndex + 1;
            $(`#${id} .carousel-dots .dot:nth-of-type(${dotIndex})`).addClass("active");
        }
    }
    else {
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
        
        // slide slides
        const width = getWidth();
        const slides = $(`#${id} .carousel-container .slide`);

        const slidesContainer = $(`#${id} .carousel-container`);
        const containerPos = slidesContainer[0].getClientRects()[0];
        const rightBoundary = (containerPos.right < window.innerWidth) ? containerPos.right : window.innerWidth;

        setTimeout(() => {
            slides.map((i, slide) => {
                // current slide position
                let left = parseFloat($(slide).css("translate"));
                if(isNaN(left)) left = 0; // if translate is not used on element yet, Safair will return NaN

                // adjust position if slides are offscreen
                const slidePos = slide.getClientRects()[0];
                if(slidePos.left >= rightBoundary) {
                    // remove transition/animation
                    const transitionProp = $(slide).css("transition");
                    $(slide).css("transition", "unset");

                    // update new position
                    left -= (width * slides.length);
                    const newVW = (left / window.innerWidth) * 100;
                    $(slide).css("translate", `${newVW}vw 0px`);
                    
                    // re-add transition/animation
                    setTimeout(() => {
                        $(slide).css("transition", transitionProp);
                    }, 15); // delay needed in order to move the slide without animating/transitioning 
                }

                // slide the slides
                setTimeout(() => {
                    const newPos = left + width;
                    const newVW = (newPos / window.innerWidth) * 100;
                    $(slide).css("translate", `${newVW}vw 0px`);
                }, 16); // delay is needed for all slides so that off screen slides won't be out of sync due to the delay used when re-adding the transition
            });
        }, 15);

        // reset autoswipe
        autoSwipe();

        // update classes
        slideClassesPrev();
    }
    
    function slideNext() {
        const sliding = checkIfSliding(true);
        if(sliding) return;

        // slide slides
        const width = getWidth();
        const slides = $(`#${id} .carousel-container .slide`);

        const slidesContainer = $(`#${id} .carousel-container`);
        const containerPos = slidesContainer[0].getClientRects()[0];
        const leftBoundary = (containerPos.left > 0) ? containerPos.left : 0;

        setTimeout(() => {
            slides.map((i, slide) => {
                // current slide position
                let left = parseFloat($(slide).css("translate"));
                if(isNaN(left)) left = 0; // if translate is not used on element yet, Safair will return NaN

                // adjust position if slides are offscreen
                const slidePos = slide.getClientRects()[0];
                if(slidePos.right <= leftBoundary) {
                   // remove transition/animation
                    const transitionProp = $(slide).css("transition");
                    $(slide).css("transition", "unset");

                    // update new position
                    left += (width * slides.length);
                    const newVW = (left / window.innerWidth) * 100;
                    $(slide).css("translate", `${newVW}vw 0px`);
                    
                    // re-add transition/animation
                    setTimeout(() => {
                        $(slide).css("transition", transitionProp);
                    }, 15); // delay needed in order to move the slide without animating/transitioning 
                }

                // slide the slides
                setTimeout(() => {  
                    const newPos = left - width;
                    const newVW = (newPos / window.innerWidth) * 100;
                    $(slide).css("translate", `${newVW}vw 0px`);
                }, 16); // delay is needed for all slides so that off screen slides won't be out of sync due to the delay used when re-adding the transition
            });
        }, 15);

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
        const c = $(carousel);
        const slide = c.find(".slide");
        const width = parseFloat(slide.css("width"));
        const gap = parseFloat(c.find(".carousel-container").css("gap"));
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
        $(`#${id} .dot.active`).removeClass("active");
        $(dots[index]).addClass("active");

        // move slides into position
        const difference = currentIndex - index; // number of slides to slide
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