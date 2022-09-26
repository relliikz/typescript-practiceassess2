// Import stylesheets
import './style.css';
import { Colours, ColourHelper } from './models/colours.enum';
import { BodyParts, BodyPartsHelper } from './models/bodyParts.enum';
import { SpinRecord } from './models/spin';

// used to make the spinner spin
let spinnerCounter = 0;

// container for the spinner
let spinnerCycle;

// used to keep track of how many spins have been requested
let spinCount = 0;

// used to keep track of the results of the spin
let selectedColour: string;
let selectedBodyPart: string;

// use to store the results of spins
let spinHistoryArray: Array<SpinRecord> = [];

const colourDiv = document.getElementById('colourResult');

const colourSelector: HTMLSelectElement = <HTMLSelectElement>(
  document.getElementById('colourSelect')
);
const bodyPartSelector: HTMLSelectElement = <HTMLSelectElement>(
  document.getElementById('bodyPartSelect')
);

// sets up an array of strings to represent the colours from the enum
let coloursArray: Array<string> = [];
for (let colour in Colours) {
  if (isNaN(Number(colour))) {
    coloursArray.push(colour);
    let option = document.createElement('option');
    option.text = colour;
    colourSelector.add(option);
  }
}

const bodyPartP = document.getElementById('bodyPartText');

// TODO see above and create an array of strings to store the bodypart strings from the enum
let bodyPartsArray: Array<string> = [];
for (let bodyPart in BodyParts) {
  if (isNaN(Number(bodyPart))) {
    bodyPartsArray.push(bodyPart);
    let option = document.createElement('option');
    option.text = bodyPart;
    bodyPartSelector.add(option);
  }
}

// TODO add eventlistners to buttons
const spinBtn = <HTMLButtonElement>document.getElementById('spin-btn');
spinBtn.addEventListener('click', () => spinBtnHandler(2000, 100));
const statsBtn = <HTMLButtonElement>document.getElementById('statsBtn');
statsBtn.addEventListener('click', () => statsBtnHandler());

// TODO handles the spin button click
// time in ms, interval in ms
function spinBtnHandler(time: number, interval: number) {
  // start spinner rotating through colours
  spinnerCycle = setInterval(() => spinSpinners(), interval);

  // TODO randomly select colour from array
  let colourIndex: number = randomSelect(coloursArray);
  selectedColour = coloursArray[colourIndex];

  // TODO randomly select bodyPart from array
  let bodyPartIndex: number = randomSelect(bodyPartsArray);
  selectedBodyPart = bodyPartsArray[bodyPartIndex];

  function randomSelect(array: Array<String>): number {
    let random = Math.floor(Math.random() * array.length);
    console.log(random);
    return random;
  }

  spinBtn.disabled = true;

  // set timer to stop the spinners rotating
  setTimeout(() => stopSpinners(), time);
}

// rotates between the colours in Colours.enum.
function spinSpinners() {
  spinnerCounter++;

  colourDiv.style.backgroundColor =
    coloursArray[spinnerCounter % coloursArray.length];

  bodyPartP.innerHTML = bodyPartsArray[spinnerCounter % bodyPartsArray.length];
}

// stops spinner after time parameter, time in ms
function stopSpinners() {
  clearInterval(spinnerCycle);
  // TODO set colourDiv and bodyPartP to the randomly spun results

  let colourDiv = <HTMLDivElement>document.getElementById('colourResult');

  colourDiv.style.backgroundColor = selectedColour;
  bodyPartP.innerHTML = selectedBodyPart;
  spinBtn.disabled = false;
  addToHistory();
}

// TODO add the newly spun result to the history table
function addToHistory() {
  spinHistoryArray.push(
    new SpinRecord(Colours[selectedColour], BodyParts[selectedBodyPart])
  );
  const table: HTMLTableElement = <HTMLTableElement>(
    document.getElementById('historyTable')
  );
  table.insertRow().innerHTML = `<td>${spinHistoryArray.length}</td>
<td>${selectedColour}</td>
<td>${selectedBodyPart}</td>`;
}

function statsBtnHandler() {
  // TODO set the statsResults div innerHTML to the amount and last spun number that the user has chosen
  // eg. Red LeftHand spun 10 times
  //     Red LeftHand last spun at num 23
  let resultsDiv = document.getElementById('statsResults');
  let colourResult = colourSelector.value;
  let bodyPartResult = bodyPartSelector.value;
  resultsDiv.innerHTML =
    colourResult +
    ' ' +
    bodyPartResult +
    ' has been spun ' +
    getAmount(colourResult, bodyPartResult) +
    ' times; the last time being at spin ' +
    getLastSpun(colourResult, bodyPartResult);
}

// TODO returns the amount of times the combination of selected of colour and body part have been spun
function getAmount(colour, bodyPart): number {
  let number = 0;
  for (let i = 0; i < spinHistoryArray.length; i++) {
    if (
      spinHistoryArray[i].colour === ColourHelper.get(colour) &&
      spinHistoryArray[i].bodyPart === BodyPartsHelper.get(bodyPart)
    ) {
      number++;
    }
  }
  return number;
}

// TODO return the last num which the combination of selected of colour and body part have been spun
function getLastSpun(colour, bodyPart): number {
  for (let i = spinHistoryArray.length - 1; i >= 0; i--) {
    if (
      ColourHelper.get(colour) === spinHistoryArray[i].colour &&
      BodyPartsHelper.get(bodyPart) === spinHistoryArray[i].bodyPart
    ) {
      return i + 1;
    }
  }
  return 0;
}
