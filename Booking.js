const Room = require('./Room');

const {
    MAX_NUMBER_OF_CHILDREN_AND_ADULTS_PER_BOOKING,
    MAX_NUMBER_OF_ROOMS_PER_BOOKING,
    MAX_NUMBER_OF_ADULTS,
    MAX_NUMBER_OF_INFANTS,
    MAX_NUMBER_OF_CHILDREN
} = require('./config');

class Booking {

    constructor({ numberOfChildren, numberOfInfants, numberOfAdults } = {}) {
        this._numberOfChildren = numberOfChildren || 0;
        this._numberOfInfants = numberOfInfants || 0;
        this._numberOfAdults = numberOfAdults || 0;
        this._rooms = [];
    }

    async book({ numberOfChildren, numberOfInfants, numberOfAdults } = {}) {

        this._numberOfChildren = numberOfChildren || this._numberOfChildren;
        this._numberOfInfants = numberOfInfants || this._numberOfInfants;
        this._numberOfAdults = numberOfAdults || this._numberOfAdults;

        this._verifyBookingRules(this._numberOfAdults, this._numberOfChildren, this._numberOfInfants);

        const numberOfRoomsBasedOnInfantsAndChildren = this._calcuclateNumberOfRoomsBasedOnGuestsAndInfants();
        if(numberOfRoomsBasedOnInfantsAndChildren > MAX_NUMBER_OF_ROOMS_PER_BOOKING)
            throw new Error('Number of rooms exceeded, please make a seperate booking.');

        if(numberOfRoomsBasedOnInfantsAndChildren > this._numberOfAdults) {
            throw new Error(`Every room must have at least one adult.
            Rooms Required: ${numberOfRoomsBasedOnInfantsAndChildren}, Adults Provided: ${this._numberOfAdults}`);
        }
        const adultsPerRoom = this._calculateAdultsPerRoom(numberOfRoomsBasedOnInfantsAndChildren);
        this._calculatePaxPerRoom(adultsPerRoom);
    }

    _calculatePaxPerRoom(adultPerRoom) {
        while(this.numberOfGuests() > 0) {
            const room = new Room();
            let adults = 0;
            if( adultPerRoom >= this._numberOfAdults) {
                adults = this._numberOfAdults;
            } else {
                adults = adultPerRoom;
            }

            room.addAdults(adults);
            this._numberOfAdults -= adults;


            const childeren = this._calculateMaxPersonToAdd(this._numberOfChildren, MAX_NUMBER_OF_CHILDREN);
            room.addChildren(childeren);
            this._numberOfChildren -= childeren;
            
            const infants = this._calculateMaxPersonToAdd(this._numberOfInfants, MAX_NUMBER_OF_INFANTS)
            room.addInfants(infants);
            this._numberOfInfants -= infants;

            this._rooms.push(room);
        }
    }

    _calculateAdultsPerRoom(numberOfRooms) {
        const result = Math.ceil(this._numberOfAdults / numberOfRooms);
        
        if (result == Infinity) {
            return this._calculateEstemetatedNumberOfRooms(this._numberOfAdults, MAX_NUMBER_OF_ADULTS);
        }
        return result;
    }

    _calculateEstemetatedNumberOfRooms(numberOfPeople, maxNumberOfPeople) {
        return Math.ceil(numberOfPeople / maxNumberOfPeople);
    }

    _calcuclateNumberOfRoomsBasedOnGuestsAndInfants() {
        const childeren = this._calculateEstemetatedNumberOfRooms(this._numberOfChildren, MAX_NUMBER_OF_CHILDREN);
        const infints = this._calculateEstemetatedNumberOfRooms(this._numberOfInfants, MAX_NUMBER_OF_INFANTS);
        const adults = this._calculateEstemetatedNumberOfRooms(this._numberOfAdults, MAX_NUMBER_OF_ADULTS);

        return Math.max(childeren, infints, adults);
    }

    _calculateMaxPersonToAdd(number, max) {
        return (number > max) ? max: number;
    }


    numberOfGuests() {
        return this._numberOfChildren + this._numberOfInfants + this._numberOfAdults;
    }

    getRooms() {
        return this._rooms;
    }

    _verifyBookingRules(numberOfAdults, numberOfChildren, numberOfInfants) {
        const numberOfGuests = numberOfChildren + numberOfAdults;
        if(numberOfGuests > MAX_NUMBER_OF_CHILDREN_AND_ADULTS_PER_BOOKING) 
            throw new Error(
                `Max number of guests allowed is ${MAX_NUMBER_OF_CHILDREN_AND_ADULTS_PER_BOOKING} (excluding infants).
                ${numberOfGuests} is provided.`
            );

        if(
            numberOfAdults > (MAX_NUMBER_OF_ADULTS * MAX_NUMBER_OF_ROOMS_PER_BOOKING) ||
            numberOfChildren > (MAX_NUMBER_OF_CHILDREN * MAX_NUMBER_OF_ROOMS_PER_BOOKING) ||
            numberOfInfants > (MAX_NUMBER_OF_INFANTS * MAX_NUMBER_OF_ROOMS_PER_BOOKING) 
        )
            throw new Error(`Cannot fit in ${MAX_NUMBER_OF_ROOMS_PER_BOOKING} Room(s).`);

        return true;    
    }

    verifyNumberOfRooms() {
        return this._rooms.length <= MAX_NUMBER_OF_ROOMS_PER_BOOKING;
    }

    getNumberOfRooms() {
        return this._rooms.length;
    }
}

module.exports = Booking;