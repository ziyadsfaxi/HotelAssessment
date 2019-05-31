const Booking = require('./Booking');

(async() => {

    try {
        new Booking(9, 9, 10);
    } catch (err) {
        console.log(err.message);
    }

})();