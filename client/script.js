const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");
const form = document.getElementById("flyerForm");
const resultDiv = document.getElementById("result");
const flyerResult = document.getElementById("flyerResult");
const downloadBtn = document.getElementById("downloadBtn");

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        preview.src = reader.result;
        preview.hidden = false;
    };
    reader.readAsDataURL(file);
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const image = imageInput.files[0];

    if (!name || !image) {
        alert("Please enter your name and upload a photo.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
        const res = await fetch("https://eat-a-fruit-challenge.onrender.com/api/register", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (data.success) {
            flyerResult.src = data.flyerUrl;
            downloadBtn.href = data.flyerUrl;
            resultDiv.hidden = false;
        } else {
            alert("Failed to generate flyer. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
});
