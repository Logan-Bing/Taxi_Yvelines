var currentStep = 0;
showTab(currentStep);


function showTab(n) {
  var x = document.getElementsByClassName("form-step");
  x[n].style.display = "flex";

  if (n == 0){
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline"
  }
  if (n == (x.length - 1)){
    document.getElementById("nextBtn").innerHTML = "Réserver"
  } else {
    document.getElementById("nextBtn").innerHTML = "Suivant"
  }

  fixStepIndicator(n)
}

function nextPrev(n) {
  var x = document.getElementsByClassName("form-step");
  if (n == 1 && !validateForm()) return false;
  x[currentStep].style.display = "none";
  currentStep = currentStep + n;
  if (currentStep >= x.length) {
    document.getElementById("regForm").submit();
    return false;
  }

  showTab(currentStep);
}

function validateForm(){
  var x, y, i, valid = true;
  x = document.getElementsByClassName("form-step");
  y = x[currentStep].getElementsByTagName("input");

  for (i = 0; i < y.length; i++){
    if (y[i].value == ""){
      y[i].className += " invalid";
      valid = false;
    }
  }

  if (currentStep === 2) {
    const dateInput = document.getElementById("date");
    const selectedDate = new Date(dateInput.value);
    const today = new Date();

    // On supprime l'heure pour comparer seulement les jours
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      dateInput.classList.add("invalid");
      valid = false;
    }
  }

  if (valid) {
    const icons = document.getElementsByClassName("step-icon");

    if (currentStep < icons.length) {
      icons[currentStep].classList.add("finish");
    }
  }
  return valid
}

function fixStepIndicator(n) {
  var i, x = document.getElementsByClassName("step-icon");
  for(i = 0; i < x.length; i++){
    x[i].className = x[i].className.replace(" active", "");
  }

  x[n].className += " active";
}
