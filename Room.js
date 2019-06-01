const {
    MAX_NUMBER_OF_ADULTS,
    MAX_NUMBER_OF_CHILDREN,
    MAX_NUMBER_OF_INFANTS
} = require('./config');

class Room {
    constructor() {
        this.numberOfChildren = 0;
        this.numberOfInfants = 0;
        this.numberOfAdults = 0;
    }

    addAdults(numberOfAdults) {
        if((this.numberOfAdults + numberOfAdults) > MAX_NUMBER_OF_ADULTS)
            throw new Error(`
                Number of adults exceeded the Max number.
                Max number: ${MAX_NUMBER_OF_ADULTS}.
                Provided: ${this.numberOfAdults + numberOfAdults}
            `);

        this.numberOfAdults += numberOfAdults;
    }

    
    addChildren(numberOfChildren) {
        if((this.numberOfChildren + numberOfChildren) > MAX_NUMBER_OF_CHILDREN)
            throw new Error(`
                Number of children exceeded the Max number.
                Max number: ${MAX_NUMBER_OF_CHILDREN}.
                Provided: ${this.numberOfChildren + numberOfChildren}
            `);
        
        this.numberOfChildren += numberOfChildren;
    }

    addInfants(numberOfInfants) {
        if((this.numberOfInfants + numberOfInfants) > MAX_NUMBER_OF_INFANTS)
            throw new Error(`
                Number of infants exceeded the Max number.
                Max number: ${MAX_NUMBER_OF_INFANTS}.
                Provided: ${this.numberOfInfants + numberOfInfants}
            `);
        
        this.numberOfInfants += numberOfInfants;
    }

}

module.exports = Room;