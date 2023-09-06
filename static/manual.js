const manualResult = document.getElementById("manual-result");
const outputDataManual = document.getElementById("outputDataManual");

const btnSend = document.getElementById("btn-send-manual");
const rut = document.getElementById("rut");

btnSend.onclick = async () => {
    const data = new FormData();
    data.append("rut", rut.value);
    console.log(data.get("rut"));
    const response = await fetch("https://gabigabi.xyz:8000/validate", {method: "POST", body: data, redirect: 'follow'});
    const validate = await response;
    result = await validate.json();
    if (validate.status === 200) {
        if (result.result == "yes"){
            outputDataManual.innerText = "Valido " + result.user_type;
            document.body.style.background = "Chartreuse";
        } else {
            outputDataManual.innerText = "No valido";
            document.body.style.background = "Crimson";
        }
    } else {
    outputDataManual.innerText = "Error";
    document.body.style.background = "Black";
    }
}