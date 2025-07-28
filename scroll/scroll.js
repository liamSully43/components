const scrollItems = [];
function scroll(elem, options, callback) {
    const obj = {
        elem,
        options,
        callback
    }
    scrollItems.push(obj);
}

window.addEventListener("scroll", function() {
    for(let item of scrollItems) {
        // default/backup values
        if(!item.options) item.options = {};
        if(!item.options.screenTriggers || item.options.screenTriggers.length < 1) item.options.screenTriggers = [1, 0];
        if(item.options.screenTriggers.length == 1) item.options.screenTriggers.push(0);

        if(!item.options.elemTriggers || item.options.elemTriggers.length < 1) item.options.elemTriggers = [0, 1];
        if(item.options.elemTriggers.length == 1) item.options.elemTriggers.push(1);
        
        if(!item.options.offsets || item.options.offsets.length < 1) item.options.offsets = [0, 0];
        if(item.options.offsets.length == 1) item.options.offsets.push(0);

        // value limits
        if(item.options.screenTriggers[0] > 1) item.options.screenTriggers[0] = 1;
        if(item.options.screenTriggers[0] < 0) item.options.screenTriggers[0] = 0;

        if(item.options.screenTriggers[1] > 1) item.options.screenTriggers[1] = 1;
        if(item.options.screenTriggers[1] < 0) item.options.screenTriggers[1] = 0;

        if(item.options.elemTriggers[0] > 1) item.options.elemTriggers[0] = 1;
        if(item.options.elemTriggers[0] < 0) item.options.elemTriggers[0] = 0;

        if(item.options.elemTriggers[1] > 1) item.options.elemTriggers[1] = 1;
        if(item.options.elemTriggers[1] < 0) item.options.elemTriggers[1] = 0;

        // current element's position
        const elemPos = item.elem.getClientRects()[0];

        // start & end positions for scroll
        //  offset for bottom of screen needs to be inverted in order to work
        const startOffset = (item.options.screenTriggers[0] > item.options.screenTriggers[1]) ? 0 - item.options.offsets[1] : item.options.offsets[0];
        const endOffset = (item.options.screenTriggers[1] > item.options.screenTriggers[0]) ? 0 - item.options.offsets[1] : item.options.offsets[0];
        
        const startPX = (window.innerHeight * item.options.screenTriggers[0]) + startOffset;
        const endPX = (window.innerHeight * item.options.screenTriggers[1]) + endOffset;

        // distance to scroll
        const maxScroll = (startPX - endPX) + (elemPos.height * (item.options.elemTriggers[1] - item.options.elemTriggers[0]));

        // current element's scroll position
        const currentPosition = startPX - (elemPos.top + (elemPos.height * item.options.elemTriggers[0]));

        // percentage
        let percentage = (currentPosition / maxScroll) * 100;
        if(percentage > 100) percentage = 100;
        if(percentage < 0) percentage = 0;
        
        // decimal
        let decimal = percentage / 100;

        // pixels
        let pixels = currentPosition;

        // reverse
        if(item.options.reverse) {
            if(!item.options.reverseBuffer) item.options.reverseBuffer = 0;
            let reverseBuffer = (item.options.reverseBuffer < 1) ? window.innerHeight * item.options.reverseBuffer : item.options.reverseBuffer;
            if(reverseBuffer < 0) reverseBuffer = 0;
            const scrollDistance = maxScroll - reverseBuffer;
            const percentageOfScroll = (scrollDistance / maxScroll) * 100;

            percentage = (percentage > 50) ? 100 - ((percentage - 50) * 2) : (percentage * 2);
            if(percentage > percentageOfScroll) percentage = percentageOfScroll;
            percentage = (percentage / percentageOfScroll) * 100;
            decimal = percentage / 100;
            pixels = (currentPosition > (maxScroll / 2)) ? maxScroll - ((currentPosition - (maxScroll / 2)) * 2) : (currentPosition * 2);
            const pixelsLimit = maxScroll - reverseBuffer; 
            if(pixels > pixelsLimit) pixels = pixelsLimit;
        }

        // timing
        if(item.options.timing == "ease in") {
            if(percentage < 50) {
                const multiplier = 1 - ((50 - percentage) / 100);
                percentage *= multiplier;
            }
        }
        else if(item.options.timing == "ease out") {
            if(percentage > 50) {
                const multiplier = 0 - ((50 - percentage) / 100);
                percentage = (percentage * multiplier) + 50;
            }
        }
        else if(item.options.timing == "ease in out") {
            if(percentage < 50) {
                const multiplier = 1 - ((50 - percentage) / 100);
                percentage *= multiplier;
            }
            else {
                const multiplier = 0 - ((50 - percentage) / 100);
                percentage = (percentage * multiplier) + 50;
            }
        }

        // callback
        if(item.callback) {   
            const returnObj = {
                percentage,
                decimal,
                pixels,
            }
            item.callback(returnObj);
        }
        // CSS variables
        else {
            item.elem.style.setProperty("--percentage", `${percentage}%`);
            item.elem.style.setProperty("--decimal", decimal);
            item.elem.style.setProperty("--pixels", `${pixels}px`);
        }
    }
})