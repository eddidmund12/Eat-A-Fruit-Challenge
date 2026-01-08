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
      body: formData,
    });

    const data = await response.json();
    console.log("Server response:", data);

    if (data.success) {
      resultDiv.hidden = false;
      flyerResult.src = data.flyerUrl;

      // Enable download button
      downloadBtn.disabled = false;
      downloadBtn.textContent = "Download Flyer";

      // ✅ Force download from Cloudinary + loader
      downloadBtn.onclick = async () => {
        const originalText = downloadBtn.textContent;

        try {
          downloadBtn.disabled = true;
          downloadBtn.textContent = "Downloading...";

          const response = await fetch(flyerResult.src);
          const blob = await response.blob();

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");

          a.href = url;
          a.download = `${nameInput.value}-flyer.png`;
          document.body.appendChild(a);
          a.click();

          a.remove();
          window.URL.revokeObjectURL(url);
        } catch (err) {
          console.error("Download failed:", err);
          alert("Failed to download flyer.");
        } finally {
          downloadBtn.disabled = false;
          downloadBtn.textContent = originalText;
        }
      };
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Something went wrong!");
  }
});
