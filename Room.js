const {
    MAX_NUMBER_OF_ADULTS,
    MAX_NUMBER_OF_CHILDREN,
    MAX_NUMBER_OF_INFINTS
} = require('./config');

class Room {
    constructor() {
        this.numberOfChildren = 0;
        this.numberOfInfints = 0;
        this.numberOfAdults = 0;
    }

    addAdults(numberOfAdults) {
        if((this.numberOfAdults + numberOfAdults) > MAX_NUMBER_OF_ADULTS)
            throw new Error('Adults in room should not acceed 3.');

        this.numberOfAdults += numberOfAdults;
    }

    
    addChildren(numberOfChildren) {
        if((this.numberOfChildren + numberOfChildren) > MAX_NUMBER_OF_CHILDREN)
            throw new Error('Children in room should not excceed 3.');
        
        this.numberOfChildren += numberOfChildren;
    }

    addInfints(numberOfInfints) {
        if((this.numberOfInfints + numberOfInfints) > MAX_NUMBER_OF_INFINTS)
            throw new Error("Infints in room should not excceed 3.");
        
        this.numberOfInfints += numberOfInfints;
    }

    verifyNumberOfAdults() {
        return this.numberOfAdults >= MAX_NUMBER_OF_INFINTS;
    }


}

module.exports = Room;