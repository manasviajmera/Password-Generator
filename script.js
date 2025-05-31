// ==== DOM Elements ====
const getStartedBtn = document.getElementById("getStartedBtn");
const welcomeScreen = document.getElementById("welcome");
const generatorScreen = document.getElementById("generator");

const slider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const numbersCheck = document.getElementById("numbers");
const symbolsCheck = document.getElementById("symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");

const symbols = '`~!@#$%^&*()_-+={[}]|:;"<,>.?/';

// ==== State Variables ====
let password = "";
let passwordLength = 10;
let checkCount = 0;

// ==== Helper Functions ====
function handleSlider() {
    slider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = slider.min;
    const max = slider.max;
    slider.style.backgroundSize = ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
    return getRandomInteger(0, 10);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    return symbols.charAt(getRandomInteger(0, symbols.length));
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("green");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("yellow");
    } else {
        setIndicator("red");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBoxes.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// ==== Initial Setup ====
handleSlider();
setIndicator("grey");

// ==== Event Listeners ====

// Show password generator
getStartedBtn.addEventListener("click", () => {
    welcomeScreen.classList.add("hidden");
    generatorScreen.classList.remove("hidden");
});

// Slider update
slider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// Checkbox update
allCheckBoxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

// Copy button
copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});

// Generate password
generateBtn.addEventListener("click", () => {
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Collect selected functions
    const funcArr = [];
    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(getRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbol);

    // Generate mandatory characters
    password = "";
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Fill remaining length
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        const randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle and display
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    // Check strength
    calcStrength();
});
