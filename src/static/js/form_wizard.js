const firstStep = document.querySelector(".first-form")
const secondStep = document.querySelector(".second-form")
const thirdStep = document.querySelector(".third-form")
const submitButton = document.querySelector(".submit-button")
const nextButton = document.querySelector(".next-button")

let currentStep = 0

if (currentStep === 0) {
  secondStep.classList.add("hidden")
  thirdStep.classList.add("hidden")
  submitButton.classList.add("hidden")
} else if (currentStep === 1){
  firstStep.classList.add("hidden")
  thirdStep.classList.add("hidden")
}

function nextStep() {
  currentStep += 1
}

console.log(currentStep)
