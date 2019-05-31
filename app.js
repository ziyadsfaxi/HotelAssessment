const Booking = require('./Booking');

(async() => {

    try {
        const options = {
            numberOfChildren: 1,
            numberOfInfants: 9, 
            numberOfAdults: 6,
        };
        new Booking(options);
    } catch (err) {
        console.log(err.message);
    }

})();