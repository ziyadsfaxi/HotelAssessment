const Room = require('./Room');

const {
    MAX_NUMBER_OF_CHILDREN_AND_ADULTS_PER_BOOKING,
    MAX_NUMBER_OF_ROOMS_PER_BOOKING,
    MAX_NUMBER_OF_ADULTS,
    MAX_NUMBER_OF_INFANTS,
    MAX_NUMBER_OF_CHILDREN
} = require('./config');

class Booking {

    constructor({numberOfChildren, numberOfInfants, numberOfAdults}) {
        this._numberOfChildren = numberOfChildren;
        this._numberOfInfants = numberOfInfants;
        this._numberOfAdults = numberOfAdults;
        this.rooms = [];

        this.verifyBookingRules();
        
        const numberOfRoomsBasedOnInfantsAndChildren = this.calcuclateNumberOfRoomsBasedOnInfantsAndChildren();
        if(numberOfRoomsBasedOnInfantsAndChildren > MAX_NUMBER_OF_ROOMS_PER_BOOKING)
            throw new Error('Number of rooms exceeded, please make a seperate booking.');

        if(numberOfRoomsBasedOnInfantsAndChildren > this._numberOfAdults)
            throw new Error(`Every room must have at least one adult.
            Rooms Required: ${numberOfRoomsBasedOnInfantsAndChildren}, Adults Provided: ${this._numberOfAdults}`);
        
        const adultsInRoom = this.calculateAdultsInRoom(numberOfRoomsBasedOnInfantsAndChildren);
        this.calc(adultsInRoom);
    }

    calc(adultPerRoom) {
        while(this.numberOfPeople() > 0) {
            const room = new Room();
            let adults = 0;
            if( adultPerRoom >= this._numberOfAdults) {
                adults = this._numberOfAdults;
            } else {
                adults = adultPerRoom;
            }

            room.addAdults(adults);
            this._numberOfAdults -= adults;


            const childeren = this.calculateMaxPersonToAdd(this._numberOfChildren, MAX_NUMBER_OF_CHILDREN);
            room.addChildren(childeren);
            this._numberOfChildren -= childeren;
            
            const infants = this.calculateMaxPersonToAdd(this._numberOfInfants, MAX_NUMBER_OF_INFANTS)
            room.addInfints(infants);
            this._numberOfInfants -= infants;

            this.rooms.push(room);
        }

        console.log(this.rooms);
    }

    calculateAdultsInRoom(numberOfRooms){
        const result = Math.ceil(this._numberOfAdults / numberOfRooms);
        
        if (result == Infinity) {
            return this.calculateEstemetatedNumberOfRooms(this._numberOfAdults, MAX_NUMBER_OF_ADULTS);
        }
        return result;
    }

    calculateEstemetatedNumberOfRooms(numberOfPeople, maxNumberOfPeople) {
        return Math.ceil(numberOfPeople / maxNumberOfPeople);
    }

    calcuclateNumberOfRoomsBasedOnInfantsAndChildren() {
        const childeren = this.calculateEstemetatedNumberOfRooms(this._numberOfChildren, MAX_NUMBER_OF_CHILDREN);
        const infints = this.calculateEstemetatedNumberOfRooms(this._numberOfInfants, MAX_NUMBER_OF_INFANTS);
        const adults = this.calculateEstemetatedNumberOfRooms(this._numberOfAdults, MAX_NUMBER_OF_ADULTS);

        return Math.max(childeren, infints, adults);
    }

    calculateMaxPersonToAdd(number, max) {
        return (number > max) ? max: number;
    }


    numberOfPeople() {
        return this._numberOfChildren + this._numberOfInfants + this._numberOfAdults;
    }

    verifyBookingRules() {
        const numberOfGuests = this._numberOfChildren + this._numberOfAdults;
        if(numberOfGuests > MAX_NUMBER_OF_CHILDREN_AND_ADULTS_PER_BOOKING) 
            throw new Error(
                `Max number of guests allowed is ${MAX_NUMBER_OF_CHILDREN_AND_ADULTS_PER_BOOKING} (excluding infants).
                ${numberOfGuests} is provided.`
            );

        if(
            this._numberOfAdults > (MAX_NUMBER_OF_ADULTS * MAX_NUMBER_OF_ROOMS_PER_BOOKING) ||
            this._numberOfChildren > (MAX_NUMBER_OF_CHILDREN * MAX_NUMBER_OF_ROOMS_PER_BOOKING) ||
            this._numberOfInfants > (MAX_NUMBER_OF_INFANTS * MAX_NUMBER_OF_ROOMS_PER_BOOKING) 
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