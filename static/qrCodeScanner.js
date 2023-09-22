const my_qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
let re = new RegExp("RUN=([k\\d.-]+)");
let re_rut = new RegExp("(\\d{1,2})(\\d{3}){2}-([\\dkK])");
const btnScanQR = document.getElementById("btn-scan-qr");

const form = document.getElementById("manual_input");
const formResult = document.getElementById("manual-result")
const outputDataManual = document.getElementById("outputDataManual");
const manual = document.getElementById("manual");

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('clicked');
    
    const payload = new FormData(form);
    const rut = payload.get("rut")
    console.log(rut);
    const match = rut.match(re_rut);
    console.log(match);
    if (match) {
      fetch("https://gabigabi.xyz:8000/validate", {
        method: "POST",
        body: payload,
        redirect: 'follow'
      })
      .then(res => res.json())
      .then(data => {
        if (data.result == "yes"){
          outputDataManual.innerText = "Valido " + data.user_type;
          document.body.style.background = "Chartreuse";
        } else {
          outputDataManual.innerText = "No valido";
          document.body.style.background = "Crimson";
        }
        formResult.hidden = false;
        
      })
      .catch(err => console.log(err))
    } else {
      outputDataManual.innerText = "Rut no válido";
      document.body.style.background = "Black";
      formResult.hidden = false;
    }
  })
}

let scanning = false;

my_qrcode.callback = async (res) => {
  if (res) {
    const match = res.match(re);
    if (match) {
      const runNumber = match[1];
      console.log(runNumber);
      var form = new FormData();
      form.append("rut", runNumber);
      const response = await fetch("https://gabigabi.xyz:8000/validate", {method: "POST", body: form, redirect: 'follow'});
      const validate = await response;
      result = await validate.json();
      if (validate.status === 200) {
        if (result.result == "yes"){
          outputData.innerText = "Valido " + result.user_type;
          document.body.style.background = "Chartreuse";
        } else {
          outputData.innerText = "No valido";
          document.body.style.background = "Crimson";
        }
      } else {
        outputData.innerText = "Error";
        document.body.style.background = "#0a5da7";
      }
    } else {
      console.log("Código QR no válido");
      outputData.innerText = "Código QR no válido";
      document.body.style.background = "#0a5da7";
    }
    scanning = false;

    video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });

    qrResult.hidden = false;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
    manual.hidden = false;
  }
};

btnScanQR.onclick = () => {
  document.body.style.background = "Black";    
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      manual.hidden = true;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
}; 

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    my_qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}
