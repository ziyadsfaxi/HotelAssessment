const readline = require('readline');
const utils = require('./utils');

const Booking = require('./Booking');
   
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

(async() => {
    try {

        const options = {
            numberOfChildren: 0,
            numberOfInfants: 0, 
            numberOfAdults: 0,
        };

        /*  Start taking user's input  */
        await new Promise((resolve, reject) => {            
            rl.question('Please Enter the Number of Adults?: ', answer => {
                const numberOfAdults = parseInt(answer);

                if (!utils.isNumber(numberOfAdults)) {
                    reject(new Error(`${answer} is not a valid number`));
                }

                options['numberOfAdults'] = numberOfAdults;
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            rl.question('Please Enter the Number of Children?: ', answer => {
                const numberOfChildren = parseInt(answer);

                if (!utils.isNumber(numberOfChildren)) {
                    reject(new Error(`${answer} is not a valid number`));
                }
                options['numberOfChildren'] = numberOfChildren;
                resolve();
            });
        });
        
        await new Promise((resolve, reject) => {
            rl.question('Please Enter the Number of Infants?: ', answer => {
                const numberOfInfants = parseInt(answer);

                if (!utils.isNumber(numberOfInfants)) {
                    reject(new Error(`${answer} is not a valid number`));
                }
                options['numberOfInfants'] = parseInt(answer);
                resolve();
            });
        });
        /* End taking user's input */

        /* 
            Booking details either be inserted in the constructor
            or through the book() method.
        */
        const booking = new Booking();
        await booking.book(options);

        console.log(JSON.stringify(booking.getRooms(), null, 4));

        process.exit();

    } catch (err) {
        console.log('------------------');
        console.log(utils.singleLineString`REJECTED: ${err.message}`);
        console.log('------------------');
        process.exit();
    }

})();