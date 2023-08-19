const my_qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
let re = new RegExp("RUN=([\\d.-]+)");
const btnScanQR = document.getElementById("btn-scan-qr");

let scanning = false;

my_qrcode.callback = (res) => {
  if (res) {
    const match = res.match(re);
    if (match) {
      const runNumber = match[1];
      console.log(runNumber);
      outputData.innerText = runNumber;
    } else {
      console.log("RUN number not found.");
      outputData.innerText = res;
    }
    scanning = false;

    video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });

    qrResult.hidden = false;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
  }
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
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
