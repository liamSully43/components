let lerpAnimationFrame = null;
const lerpValues = [];
function lerp(current, target, callback, id) {
    if(!id) {
        console.error("missing unique identifier, lerp function will not be used");
        return;
    }

    // check if lerp value should be added or updated
    let matchingValue = null;
    for(let value of lerpValues) {
        if(value.id == id) {
            matchingValue = value;
            break;
        }
    }

    // update value
    if(matchingValue !== null) {
        const valueIndex = lerpValues.indexOf(matchingValue);
        if(valueIndex > -1) {
            lerpValues[valueIndex].target = target;
        }
    }
    // add value
    else {
        const value = {
            current: (isNaN(current)) ? 0 : current,
            target,
            id,
            callback
        }
        lerpValues.push(value);

        // start animation frame if not already running
        if(lerpAnimationFrame == null) {
            lerpAnimationFrame = requestAnimationFrame(lerpLoop);
        }
    }
}

function lerpLoop() {
    for(let value of lerpValues) {
        const currentVal = value.current;
        const targetVal = (value.target == 0) ? 0.001 : value.target;
        const lerpFormula = (1 - 0.1) * currentVal + 0.1 * targetVal;
        value.current = lerpFormula;

        const distance = (currentVal < targetVal) ? targetVal - currentVal : currentVal - targetVal;
        if(distance < 0.1) {
            value.current = value.target;
            const valueIndex = lerpValues.indexOf(value);
            if(valueIndex > -1) {
                lerpValues.splice(valueIndex, 1);
            }
            value.callback(value.target);
        }
        else {
            value.callback(value.current);
        }
    }
    if(lerpValues.length < 1) {
        cancelAnimationFrame(lerpAnimationFrame);
        lerpAnimationFrame = null;
    }
    else {
        requestAnimationFrame(lerpLoop);
    }
}