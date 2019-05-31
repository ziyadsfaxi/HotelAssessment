const Room = require('./Room');

const {
    MAX_NUMBER_OF_CHILDREN_AND_ADULTS_PER_BOOKING,
    MAX_NUMBER_OF_ROOMS_PER_BOOKING,
    MAX_NUMBER_OF_ADULTS,
    MAX_NUMBER_OF_INFINTS,
    MAX_NUMBER_OF_CHILDREN
} = require('./config');

class Booking {

    constructor(numberOfChildren, numberOfInfints, numberOfAdults) {
        this.numberOfChildren = numberOfChildren;
        this.numberOfInfints = numberOfInfints;
        this.numberOfAdults = numberOfAdults;
        this.rooms = [];

        
        const numberOfRoomsBasedOnInfintsAndChildren = this.calcuclateNumberOfRoomsBasedOnInfintsAndChildren();
        if(numberOfRoomsBasedOnInfintsAndChildren > MAX_NUMBER_OF_ROOMS_PER_BOOKING)
            throw new Error('Beyond max number of rooms');

        if(numberOfRoomsBasedOnInfintsAndChildren > this.numberOfAdults)
            throw new Error('No enough adults');
        
        const adultInRoom = this.calculateAdultsInRoom(numberOfRoomsBasedOnInfintsAndChildren);
        this.calc(adultInRoom);
    }

    calc(adultPerRoom) {
        while(this.numberOfPeople() > 0) {
            const room = new Room();
            let adults = 0;
            if( adultPerRoom >= this.numberOfAdults) {
                adults = this.numberOfAdults;
            } else {
                adults = adultPerRoom;
            }

            room.addAdults(adults);
            this.numberOfAdults -= adults;


            const childeren = this.calculateMaxPersonToAdd(this.numberOfChildren, MAX_NUMBER_OF_CHILDREN);
            room.addChildren(childeren);
            this.numberOfChildren -= childeren;
            
            const infints = this.calculateMaxPersonToAdd(this.numberOfInfints, MAX_NUMBER_OF_INFINTS)
            room.addInfints(infints);
            this.numberOfInfints -= infints;

            this.rooms.push(room);
        }

        console.log(this.rooms);
    }

    calculateAdultsInRoom(numberOfRooms){
        const result = Math.ceil(this.numberOfAdults / numberOfRooms);
        
        if (result == Infinity) {
            return this.calculateEstemetatedNumberOfRooms(this.numberOfAdults, MAX_NUMBER_OF_ADULTS);
        }
        return result;
    }

    calculateEstemetatedNumberOfRooms(numberOfPeople, maxNumberOfPeople) {
        return Math.ceil(numberOfPeople / maxNumberOfPeople);
    }

    calcuclateNumberOfRoomsBasedOnInfintsAndChildren() {
        const childeren = this.calculateEstemetatedNumberOfRooms(this.numberOfChildren, MAX_NUMBER_OF_CHILDREN);
        const infints = this.calculateEstemetatedNumberOfRooms(this.numberOfInfints, MAX_NUMBER_OF_INFINTS);
        const adults = this.calculateEstemetatedNumberOfRooms(this.numberOfAdults, MAX_NUMBER_OF_ADULTS);

        return Math.max(childeren, infints, adults);
    }

    calculateMaxPersonToAdd(number, max) {
        return (number > max) ? max: number;
    }


    numberOfPeople() {
        return this.numberOfChildren + this.numberOfInfints + this.numberOfAdults;
    }

    verify() {
        if(this.numberOfChildren + this.numberOfAdults > MAX_NUMBER_OF_CHILDREN_AND_ADULTS_PER_BOOKING) 
            throw new Error('Number of childeren and adults should not be more than 7 for one bookin');

        if(
            this.numberOfAdults > (MAX_NUMBER_OF_ADULTS * MAX_NUMBER_OF_ROOMS_PER_BOOKING) ||
            this.numberOfChildren > (MAX_NUMBER_OF_CHILDREN * MAX_NUMBER_OF_ROOMS_PER_BOOKING) ||
            this.numberOfInfints > (MAX_NUMBER_OF_INFINTS * MAX_NUMBER_OF_ROOMS_PER_BOOKING) 
        )
            throw new Error(`Cannot fit in ${MAX_NUMBER_OF_ROOMS_PER_BOOKING} Room(s).`);
    }

    verifyNumberOfRooms() {
        return this.rooms.length <= MAX_NUMBER_OF_ROOMS_PER_BOOKING;
    }

    getNumberOfRooms() {
        return this.rooms.length;
    }
}

module.exports = Booking;