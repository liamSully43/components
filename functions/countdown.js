const endTimestampp = 1111111111;
function calcRemainingTime() {
    const vals = {
        days: 0,   
        hours: 0,   
        minutes: 0,   
        seconds: 0,   
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    let remainingTime = endTimestampp - currentTimestamp;

    vals.remainingTime = remainingTime;
    vals.currentTime = Date.now();
    vals.currentSeconds = (Date.now() / 1000);
    
    vals.days = Math.floor(((remainingTime / 60) / 60) / 24);
    let remainingDays = ((remainingTime / 60) / 60) % 24;

    vals.hours = Math.floor(remainingDays);
    let remainingHours = ((remainingTime / 60) % 60);

    vals.minutes = Math.floor(remainingHours);
    let remainingMinutes = (remainingTime % 60);

    vals.seconds = Math.floor(remainingMinutes);

    return vals;
}