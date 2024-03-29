
const inputSlider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-lengthnumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicators]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_+{}|\:"<>,.?/';
// console.log(inputSlider.value);
let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();

setIndicator();

//Set passowrd length

// function handleSlider() {
  function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
  
    const min = inputSlider.min;
    const max = inputSlider.max;
    const value = ((passwordLength - min) * 100) / (max - min);
    inputSlider.style.backgroundSize = `${value}% 100%`;
  }
  
  
// }
function setIndicator() {
  let count=0;
  if(uppercaseCheck.checked) count=count+1;
  if(symbolsCheck.checked) count=count+1;
  if(numberCheck.checked) count=count+1;
  if(lowercaseCheck.checked) count=count+1;

  // indicator.style.background = "red";
  // indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
  if(count===0)
  {
    document.querySelector('#hh').style.background="voilet";
    document.querySelector('#hh').innerHTML="Select";
  }else if(count>=1 && count<3)
  {
    document.querySelector('#hh').style.background="yellow";
    document.querySelector('#hh').innerHTML="Weak";
    passwordDisplay.style.color="yellow";
  }else
  {
    document.querySelector('#hh').style.background="green";
    document.querySelector('#hh').innerHTML="Strong";
    passwordDisplay.style.color="green";
  }

}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}
/* const randNum = getRndInteger(0, symbols.length);
const dd=symbols[randNum];
console.log("random char=",dd); */



function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  }
  catch (e) {
    copyMsg.innerText = "failed";
  }
  //to make copy vala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflepassword(array) {
  //Fisher yites method.
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}



function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked)
      checkCount++;
  });
  //specialcondition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);
})



inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
})

copyBtn.addEventListener('click', () => {
  if (passwordDisplay.value)
    copyContent();
})


generateBtn.addEventListener('click', () => {
  //none of the checkbox are selected
  if (checkCount <= 0)
    return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
   
  }

  //let's start the journey to find new password
  //remove old password
  password = "";

  //let's put the stuff mentioned by checkboxes

  /*    if(uppercaseCheck.checked){
      password += generateUpperCase();
       }

       if(lowercaseCheck.checked){
        password += generateLowerCase();
         }

         if(numberCheck.checked){
          password += generateRandomNumber();
           }

           if(symbolsCheck.checked){
            password += generateSymbol();
             } */

  let funcArr = [];

  if (uppercaseCheck.checked)
    funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

  if (numberCheck.checked)
    funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked)
    funcArr.push(generateSymbol);

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  //remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  //shuffle the pasword
  password = shufflepassword(Array.from(password));

  //show in UI
  passwordDisplay.value = password;
  //calculate strength
  document.querySelector('#btnj').style.opacity="1";
  calcStrength();
});
