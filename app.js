const Booking = require('./Booking');

(async() => {

    try {
        new Booking(2, 9, 6);
    } catch (err) {
        console.log(err.message);
    }

})();