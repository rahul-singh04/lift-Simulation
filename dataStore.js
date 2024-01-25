// dataStore.js

let numOfFloors;
let numOfLifts;
let liftState;

export const updateNumOfFloors = (floors) => {
  numOfFloors = floors;
};

export const updateNumOfLifts = (lifts) => {
  numOfLifts = lifts;
};

// Function to update the lift state
export const updateLiftState = (numOfLifts) => {
  liftState = Array.from({ length: numOfLifts }, () => ({
    currentFloor: 1,
    isOpen: false,
    isMoving: false,
    destination: 1,
  }));
};

export const getNumOfFloors = () => numOfFloors;

export const getNumOfLifts = () => numOfLifts;

export const getLiftState = () => liftState;

// // Update data
// updateNumOfFloors(initialFloors);
// updateNumOfLifts(initialLifts);
// updateLiftState(initialLiftState);
