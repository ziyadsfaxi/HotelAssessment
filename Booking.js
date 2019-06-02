/**
 * Booking class
 * @module Booking
 */
const Room = require('./Room');

const {
    MAX_NUMBER_OF_CHILDREN_AND_ADULTS_PER_BOOKING,
    MAX_NUMBER_OF_ROOMS_PER_BOOKING,
    MAX_NUMBER_OF_ADULTS,
    MAX_NUMBER_OF_INFANTS,
    MAX_NUMBER_OF_CHILDREN
} = require('./config');

/**
 * Main booking class, this class uses the Room class under the hood.
 */
class Booking {
    
    /**
     * This constructor is optional, booking details can be overriden when calling the book() method
     * @param {Object} booking
     * @param {Number} booking.numberOfChildren 
     * @param {Number} booking.numberOfInfants 
     * @param {Number} booking.numberOfAdults 
     */
    constructor({ numberOfChildren, numberOfInfants, numberOfAdults } = {}) {
        /** @private */
        this._numberOfChildren = numberOfChildren || 0;
        /** @private */
        this._numberOfInfants = numberOfInfants || 0;
        /** @private */
        this._numberOfAdults = numberOfAdults || 0;
        /** @private */
        this._rooms = [];
    }

    /**
     * Book rooms for a given number of guests.
     * 
     * Booking details inserted here will override the Booking() constructor.
     * @param {Object} booking
     * @param {Number} booking.numberOfChildren 
     * @param {Number} booking.numberOfInfants 
     * @param {Number} booking.numberOfAdults 
     */
    async book({ numberOfChildren, numberOfInfants, numberOfAdults } = {}) {

        this._numberOfChildren = numberOfChildren || this._numberOfChildren;
        this._numberOfInfants = numberOfInfants || this._numberOfInfants;
        this._numberOfAdults = numberOfAdults || this._numberOfAdults;

        this._verifyBookingRules(this._numberOfAdults, this._numberOfChildren, this._numberOfInfants);

        const numberOfRoomsBasedOnGuests = this._calcuclateNumberOfRoomsBasedOnGuests();
        if(numberOfRoomsBasedOnGuests > MAX_NUMBER_OF_ROOMS_PER_BOOKING)
            throw new Error('Number of rooms exceeded, please make a seperate booking.');

        if(numberOfRoomsBasedOnGuests > this._numberOfAdults) {
            throw new Error(`Every room must have at least one adult.
            Rooms Required: ${numberOfRoomsBasedOnGuests}, Adults Provided: ${this._numberOfAdults}`);
        }

        /** Number of adults per room (ceiled) */
        const adultsPerRoom = this._calculateAdultsPerRoom(numberOfRoomsBasedOnGuests);
        this._calculatePaxPerRoom(adultsPerRoom);
    }

    /**
     * @private
     * @param {Number} adultsPerRoom 
     */
    _calculatePaxPerRoom(adultsPerRoom) {
        while(this.getNumberOfGuests() > 0) {
            const room = new Room();
            let adultsToAdd = 0;
            if( adultsPerRoom >= this._numberOfAdults) {
                adultsToAdd = this._numberOfAdults;
            } else {
                adultsToAdd = adultsPerRoom;
            }

            room.addAdults(adultsToAdd);
            this._numberOfAdults -= adultsToAdd;


            const childeren = this._calculateMaxGuestToAdd(this._numberOfChildren, MAX_NUMBER_OF_CHILDREN);
            room.addChildren(childeren);
            this._numberOfChildren -= childeren;
            
            const infants = this._calculateMaxGuestToAdd(this._numberOfInfants, MAX_NUMBER_OF_INFANTS)
            room.addInfants(infants);
            this._numberOfInfants -= infants;

            this._rooms.push(room);
        }
    }

    /**
     * Calculate how many rooms required.
     * 
     * This method generate the final rooms number. 
     * @private
     * 
     */
    _calcuclateNumberOfRoomsBasedOnGuests() {
        const childeren = this._calculateEstemetatedNumberOfRooms(this._numberOfChildren, MAX_NUMBER_OF_CHILDREN);
        const infints = this._calculateEstemetatedNumberOfRooms(this._numberOfInfants, MAX_NUMBER_OF_INFANTS);
        const adults = this._calculateEstemetatedNumberOfRooms(this._numberOfAdults, MAX_NUMBER_OF_ADULTS);

        return Math.max(childeren, infints, adults);
    }

    /**
     * Calculate how many rooms required regardless of guests category.
     * 
     * This method doesn't generate the final number of rooms as 
     * it doesn't consider all guests categories.
     * @private
     * @param {Number} numberOfGuests 
     * @param {Number} maxNumberOfGuests 
     */
    _calculateEstemetatedNumberOfRooms(numberOfGuests, maxNumberOfGuests) {
        return Math.ceil(numberOfGuests / maxNumberOfGuests);
    }

    /**
     * Calculate how many rooms are required based on the respect of number of adults and 
     * the max number of adults allowed per room.
     * @private
     * @param {Number} numberOfRooms 
     */
    _calculateAdultsPerRoom(numberOfRooms) {
        const result = Math.ceil(this._numberOfAdults / numberOfRooms);
        
        if (result == Infinity) {
            return this._calculateEstemetatedNumberOfRooms(this._numberOfAdults, MAX_NUMBER_OF_ADULTS);
        }
        return result;
    }

    /**
     * Return the maximum number of guests allowed to be inserted in a signle room.
     * @private
     * @param {Number} number 
     * @param {Number} max 
     */
    _calculateMaxGuestToAdd(number, max) {
        return (number > max) ? max: number;
    }

    /**
     * @returns {Number} numberOfGuests
     */
    getNumberOfGuests() {
        return this._numberOfChildren + this._numberOfInfants + this._numberOfAdults;
    }

    /**
     * @returns {Array<Room>} rooms
     */
    getRooms() {
        return this._rooms;
    }

    /**
     * Check against the following rools:
     * 
     * 1- In one booking, maximum guests can be 7(excluding infants).
     * 
     * 2- Per booking maximum number of rooms will be only 3
     * @private
     * @param {Number} numberOfAdults 
     * @param {Number} numberOfChildren 
     * @param {Number} numberOfInfants 
     */
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

    /**
     * Verify if the number of rooms is within the Max number of rooms per booking.
     * 
     * @returns {boolean} numberOfRoomsIsVerified
     */
    verifyNumberOfRooms() {
        return this._rooms.length <= MAX_NUMBER_OF_ROOMS_PER_BOOKING;
    }

    /**
     * Returs the number of rooms registered in this booking.
     * 
     * @returns {Number} numberOfRooms
     */
    getNumberOfRooms() {
        return this._rooms.length;
    }
}

module.exports = Booking;