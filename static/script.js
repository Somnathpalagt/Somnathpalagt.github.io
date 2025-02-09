document.addEventListener("DOMContentLoaded", function () {
    // Upload Image
    document.getElementById("upload-form").addEventListener("submit", function (e) {
        e.preventDefault();

        let formData = new FormData(this);
        fetch("/", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => document.getElementById("upload-status").innerText = data.message)
        .catch(error => console.error("Error:", error));
    });

    // Train Model
    document.getElementById("train-btn").addEventListener("click", function () {
        fetch("/train")
            .then(response => response.json())
            .then(data => document.getElementById("train-status").innerText = data.message)
            .catch(error => console.error("Error:", error));
    });

    // Predict Image
    document.getElementById("predict-btn").addEventListener("click", function () {
        let formData = new FormData();
        let fileInput = document.getElementById("predict-file").files[0];
        formData.append("file", fileInput);

        fetch("/predict", { method: "POST", body: formData })
            .then(response => response.json())
            .then(data => document.getElementById("prediction-result").innerText = "Prediction: " + data.prediction)
            .catch(error => console.error("Error:", error));
    });

    // Webcam Capture
    let video = document.getElementById("webcam");
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    // Start Webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => video.srcObject = stream)
        .catch(error => console.error("Error accessing webcam:", error));

    // Capture Image from Webcam
    document.getElementById("capture-btn").addEventListener("click", function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.style.display = "block";
    });

    // Upload Captured Image
    document.getElementById("upload-captured-btn").addEventListener("click", function () {
        canvas.toBlob(blob => {
            let formData = new FormData();
            formData.append("file", blob, "captured_image.jpg");
            formData.append("label", prompt("Enter label for the image:"));

            fetch("/", {
                method: "POST",
                body: formData,
            })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error("Error:", error));
        }, "image/jpeg");
    });
});
