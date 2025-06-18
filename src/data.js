export const API_KEY = 'AIzaSyA7qC76VHQ97NaNMJ_vu4T0InkihsXC7-M';

export const value_converter = (value) => {
    if (value >= 1000000) {
        return Math.floor(value/1000000)+"M";
    }
    else if (value>1000) {
        return Math.floor(value/1000)+"K";
    } else {
        return value;
    }
}