const form = document.getElementById("flyerForm");
const nameInput = document.getElementById("name");
const imageInput = document.getElementById("image");
const previewImg = document.getElementById("preview");
const resultDiv = document.getElementById("result");
const flyerResult = document.getElementById("flyerResult");
const downloadBtn = document.getElementById("downloadBtn");

// Show preview of uploaded image
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.hidden = false;
        };
        reader.readAsDataURL(file);
    } else {
        previewImg.hidden = true;
    }
});

// Submit form
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", nameInput.value);
    formData.append("image", imageInput.files[0]);

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            body: formData, // Do NOT set Content-Type manually
        });

        const data = await response.json();
        console.log("Server response:", data);

        if (data.success) {
            // Show result section
            resultDiv.hidden = false;
            flyerResult.src = data.flyerUrl;

            // Set download link
            downloadBtn.href = data.flyerUrl;
            downloadBtn.download = `${nameInput.value}-flyer.png`;

            // Optionally, reset the form
            // form.reset();
            // previewImg.hidden = true;
        } else {
            alert("Error: " + data.message);
        }
    } catch (err) {
        console.error("Fetch error:", err);
        alert("Something went wrong!");
    }
});
