const elem = document.querySelector("#a2");
const options = {
    screenTriggers: [0.9, 0.1],
    elemTriggers: [0, 1],
    offsets: [0, 0],
    reverse: false,
    reverseBuffer: 200, // if between 0 & 1 use as a percentage of screen height, otherwise use as a flat pixel value (0.3 || 200)
    timing: "ease in out"

    /*
    scroll timing function, i.e. linear, ease in, ease out, ease in out, custom
    */
}
scroll(elem, options, function(values) {
    document.querySelector("#counter").innerHTML = `${values.percentage}%`;
});

const start = (window.innerHeight * options.screenTriggers[0]) + options.offsets[0];
const end = (window.innerHeight * options.screenTriggers[1]) + (0 - options.offsets[1]);
document.querySelector("#start").style.top = `${start}px`;
document.querySelector("#end").style.top = `${end}px`;

document.querySelector("#elemStart").style.top = `${options.elemTriggers[0] * 100}%`;
document.querySelector("#elemEnd").style.top = `${options.elemTriggers[1] * 100}%`;