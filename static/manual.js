const manualResult = document.getElementById("manual-result");
const outputDataManual = document.getElementById("outputDataManual");
const form = document.getElementById("manual_input");

const btnSend = document.getElementById("btn-send-manual");
const rut = document.getElementById("rut");

btnSend.addEventListener("click", function () {

    const formData = new FormData(form);

    fetch("https://gabigabi.xyz:8000/validate", {
        method: "POST",
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the response JSON if needed
    })
    .then(data => {
        // Handle the response data here
        console.log("Response data:", data);
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error("Fetch error:", error);
    });
});
