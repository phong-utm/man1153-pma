var modalCheckSymptoms = document.getElementById("modalCheckSymptoms");
var btnCheckSymptoms = document.getElementById("btnCheckSymptoms");
var btnCloseModal = document.getElementById("btnCloseModal");
var rangeTemperature = document.getElementById("rangeTemperature");
var lblTemperature = document.getElementById("lblTemperature");
var btnDiagnose = document.getElementById("btnDiagnose");
var tblResult = document.getElementById("tblResult");
var frm = document.getElementById("frm");
var modalFooter = document.getElementById("modalFooter");

// prettier-ignore
function showResult(input, output) {
  var bladderInfHtml = output['bladder_inflammation'] == 1 ? "<div class='notification is-danger'>Bladder inflammation: YES</div>" : "<div class='notification is-success is-light'>Bladder inflammation: NO</div>" 
  var nephritisHtml = output['nephritis'] == 1 ? "<div class='notification is-danger'>Acute nephritis: YES</div>" : "<div class='notification is-success is-light'>Acute nephritis: NO</div>" 

  var resultHtml = ""
  resultHtml += "<tr><th colspan='2'>" + bladderInfHtml + "</th></tr>"
  resultHtml += "<tr><th colspan='2'>" + nephritisHtml + "</th></tr>"
  resultHtml += "<tr><td>Temperature</td><td>" + input['temperature'] + "</td></tr>"
  resultHtml += "<tr><td>Nausea?</td><td>" + (input['nausea'] == 1 ? "Yes" : "No") + "</td></tr>"
  resultHtml += "<tr><td>Lumbar pain?</td><td>" + (input['lumbar_pain'] == 1 ? "Yes" : "No") + "</td></tr>"
  resultHtml += "<tr><td>Urine pushing?</td><td>" + (input['urine_pushing'] == 1 ? "Yes" : "No") + "</td></tr>"
  resultHtml += "<tr><td>Micturition pains?</td><td>" + (input['micturition_pains'] == 1 ? "Yes" : "No") + "</td></tr>"
  resultHtml += "<tr><td>Burning of urethra, itch, swelling of urethra outlet?</td><td>" + (input['urethra_burning'] == 1 ? "Yes" : "No") + "</td></tr>"
  resultHtml += "<tr><td colspan='2'>&nbsp;</td></tr>"

  tblResult.innerHTML = resultHtml
  tblResult.style.display = "block"
  frm.style.display = "none"
  modalFooter.style.display = "none"
}

function resetModal() {
  frm.reset();
  lblTemperature.innerHTML = "37.0";
  tblResult.style.display = "none";
  frm.style.display = "block";
  modalFooter.style.display = "block";
}

btnCheckSymptoms.onclick = function () {
  modalCheckSymptoms.classList.add("is-active");
};

btnCloseModal.onclick = function () {
  modalCheckSymptoms.classList.remove("is-active");
  resetModal();
};

rangeTemperature.oninput = function () {
  var val = (Math.round(this.value * 10) / 10).toFixed(1);
  lblTemperature.innerHTML = val;
};

btnDiagnose.onclick = function () {
  var f = document.forms["frm"];
  // prettier-ignore
  var input = {
    temperature: parseFloat(f.rangeTemperature.value),
    nausea: parseInt(document.querySelector('input[name="nausea"]:checked').value),
    lumbar_pain: parseInt(document.querySelector('input[name="lumbarPain"]:checked').value),
    urine_pushing: parseInt(document.querySelector('input[name="urinePushing"]:checked').value),
    micturition_pains: parseInt(document.querySelector('input[name="micturitionPain"]:checked').value),
    urethra_burning: parseInt(document.querySelector('input[name="urethraBurning"]:checked').value),
  };

  btnDiagnose.classList.add("is-loading");

  // prettier-ignore
  fetch("/predict", {
    method: "POST",
    headers: {
      ContenType: "application/json",
      "X-CSRFToken": document.querySelector('input[name="csrfmiddlewaretoken"]').value
    },
    body: JSON.stringify(input)
  })
  .then(res => res.json())
  .then(output => {
    btnDiagnose.classList.remove("is-loading");
    showResult(input, output)
  })
};
