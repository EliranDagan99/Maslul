'use strict'

const tovalDB = "maslul";
const susDB = "maslulSus";

module.exports.getDB = (mador) => {
    return (mador === 85 ? tovalDB : tovalDB);
};