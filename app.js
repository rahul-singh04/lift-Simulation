import {
  updateNumOfFloors,
  updateNumOfLifts,
  updateLiftState,
  getNumOfFloors,
  getNumOfLifts,
  getLiftState,
} from "./dataStore.js";

let liftState;

// Function to initialize the lift simulation based on user input
const initializeSimulation = () => {
  const floorsInput = document.getElementById("floors").value;
  const liftsInput = document.getElementById("lifts").value;

  // Validate inputs
  updateNumOfFloors(parseFloat(floorsInput));
  updateNumOfLifts(parseFloat(liftsInput));

  if (!Number.isInteger(getNumOfFloors()) || getNumOfFloors() <= 0) {
    showErrorMessage(
      "Please enter a valid positive integer for the number of floors. Decimal values are not allowed.",
      "error-message-floors"
    );
    return;
  }

  if (!Number.isInteger(getNumOfLifts()) || getNumOfLifts() <= 0) {
    showErrorMessage(
      "Please enter a valid positive integer for the number of lifts. Decimal values are not allowed.",
      "error-message-lifts"
    );
    return;
  }

  // Update liftState based on the new number of lifts
  updateLiftState(getNumOfLifts());

  liftState = getLiftState();

  clearErrorMessage();

  // Initialize the UI with the updated parameters
  renderUI();
};

// Function to show error message
const showErrorMessage = (message, id) => {
  const errorMessageContainer = document.getElementById(id);
  errorMessageContainer.innerText = message;
  errorMessageContainer.style.color = "red";
  errorMessageContainer.style.fontSize = "0.8rem";
};

// Function to clear error message
const clearErrorMessage = () => {
  const errorMessageContainer = document.getElementById("error-message-lifts");
  errorMessageContainer.innerText = "";
  const errorMessageContainer1 = document.getElementById(
    "error-message-floors"
  );
  errorMessageContainer1.innerText = "";
};

// UI Rendering
const renderUI = () => {
  const appContainer = document.getElementById("app");
  appContainer.innerHTML = "";

  for (let floor = getNumOfFloors(); floor >= 1; floor--) {
    const floorContainer = document.createElement("div");
    floorContainer.className = "floor-container";

    const upButton = document.createElement("button");
    upButton.innerText = "Up";
    upButton.style.display = floor === getNumOfFloors() ? "none" : "block";
    upButton.addEventListener("click", () => callLift(floor));
    floorContainer.appendChild(upButton);

    const downButton = document.createElement("button");
    downButton.innerText = "Down";
    downButton.style.display = 1 === floor ? "none" : "block";
    downButton.style.backgroundColor = "brown";
    downButton.addEventListener("click", () => callLift(floor));
    floorContainer.appendChild(downButton);

    const line = document.createElement("div");
    line.className = "floor-line";
    floorContainer.appendChild(line);

    const label = document.createElement("div");
    label.className = "floor-label";
    label.innerText = `Floor ${floor}`;
    floorContainer.appendChild(label);

    appContainer.appendChild(floorContainer);
  }

  // Create lifts

  let horizontalPosition = 150;

  for (let liftIndex = 0; liftIndex < getNumOfLifts(); liftIndex++) {
    const liftContainer = document.createElement("div");
    liftContainer.className = `lift-container lift-${liftIndex}`;

    const lift = document.createElement("div");
    lift.className = `lift ${liftIndex} ${
      liftState[liftIndex].isOpen ? "open" : ""
    } ${liftState[liftIndex].isMoving ? "moving" : ""}`;

    liftContainer.style.left = `${horizontalPosition}px`;

    // liftContainer.addEventListener("click", () => toggleLiftState(liftIndex));

    liftContainer.appendChild(lift);
    appContainer.appendChild(liftContainer);
    horizontalPosition += 50;
  }
};

const toggleLiftState = (liftIndex) => {
  liftState[liftIndex].isOpen = !liftState[liftIndex].isOpen;
  const liftElement = document.getElementsByClassName(`lift ${liftIndex}`);

  liftElement[0].style.transform = "rotateY(0deg)";
  liftElement[0].style.transition = "transform 2.5s";
  setTimeout(() => {
    liftElement[0].style.transform = "rotateY(90deg)";
    liftElement[0].style.transition = "transform 2.5s";
  }, 2500);

  setTimeout(() => {
    liftState[liftIndex].isOpen = !liftState[liftIndex].isOpen;
  }, 3000);
};

// Milestone 2: Lift mechanics

// Handling lift calls
const callLift = (floor) => {
  const availableLiftIndex = findAvailableLift(floor);
  console.log(availableLiftIndex + "here");
  if (availableLiftIndex === null) {
    return;
  }
  if (availableLiftIndex !== -1) {
    moveLift(availableLiftIndex, floor);
  } else {
    console.log("all lifts busy");
    setTimeout(() => {
      callLift(floor);
    }, 1000);
  }
};

const findAvailableLift = (floor) => {
  for (let i = 0; i < getNumOfLifts(); i++) {
    if (liftState[i].currentFloor === floor && liftState[i].isOpen === false) {
      //selecting a lift which is not moving and is  present on that floor
      toggleLiftState(i);
      console.log("already lift present");
      return null;
    }
  }

  for (let i = 0; i < getNumOfLifts(); i++) {
    if (
      !liftState[i].isMoving &&
      liftState[i].currentFloor !== floor &&
      !liftState[i].isOpen
    ) {
      //selecting a lift which is not moving and is not present on that floor
      return i;
    }
  }
  return -1; // No available lift
};

const moveLift = (liftIndex, destination) => {
  console.log(liftIndex, destination);
  liftState[liftIndex].destination = destination; //setting target lifts destination
  liftState[liftIndex].isMoving = true; //setting it property moving to true
  let currentFloorOfLift = liftState[liftIndex].currentFloor;
  const lift = document.getElementsByClassName(
    `lift-container lift-${liftIndex}`
  );
  lift[0].style.bottom = `${destination * 6 + (destination - 2) * 2}rem`;
  lift[0].style.transition = `bottom ${
    Math.abs(destination - currentFloorOfLift) * 2
  }s linear`;

  setTimeout(() => {
    liftState[liftIndex].currentFloor = destination;
    liftState[liftIndex].isMoving = false;
    toggleLiftState(liftIndex);
  }, Math.abs(destination - currentFloorOfLift) * 2 * 1000);
};

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("initializeBtn")
    .addEventListener("click", initializeSimulation);
});
