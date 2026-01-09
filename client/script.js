const form = document.getElementById("flyerForm");
const nameInput = document.getElementById("name");
const imageInput = document.getElementById("image");
const previewImg = document.getElementById("preview");

/* ---------------------------
   CREATE OVERLAYS
----------------------------*/

// Processing overlay
const processingOverlay = document.createElement("div");
processingOverlay.className = "overlay hidden";
processingOverlay.innerHTML = `
  <div class="processing-box">
    <div class="spinner"></div>
    <p id="processingText">Generating flyer...</p>
    <button id="retryBtn" class="hidden">Retry</button>
  </div>
`;
document.body.appendChild(processingOverlay);

// Result popup
const resultOverlay = document.createElement("div");
resultOverlay.className = "overlay hidden";
resultOverlay.innerHTML = `
  <div class="result-box">
    <button class="close-btn">&times;</button>
    <img id="popupFlyer" />
    <button id="popupDownload">Download Flyer</button>
  </div>
`;
document.body.appendChild(resultOverlay);

/* ---------------------------
   STYLES
----------------------------*/
const style = document.createElement("style");
style.textContent = `
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow-y: auto; /* ✅ allow scroll */
}

.hidden {
  display: none;
}

.processing-box,
.result-box {
  background: white;
  padding: 30px;
  border-radius: 14px;
  text-align: center;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto; /* ✅ popup scroll */
  position: relative;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ddd;
  border-top-color: #2E7D32;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-box img {
  max-width: 100%;
  border-radius: 10px;
  margin-bottom: 15px;
}

button {
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #2E7D32;
  color: white;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 18px;
  font-size: 28px;
  background: none;
  color: #000;
}

#retryBtn {
  margin-top: 15px;
}
`;
document.head.appendChild(style);

/* ---------------------------
   IMAGE PREVIEW
----------------------------*/
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) {
    previewImg.hidden = true;
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewImg.hidden = false;
  };
  reader.readAsDataURL(file);
});

/* ---------------------------
   FORM SUBMIT
----------------------------*/
form.addEventListener("submit", async (e) => {
  if (nameInput.value==="" || imageInput.files.length===0){
    alert("Please enter both details")
    return;
  }
  
 else{
   e.preventDefault();

  const formData = new FormData();
  formData.append("name", nameInput.value);
  formData.append("image", imageInput.files[0]);

  processingOverlay.classList.remove("hidden");
  document.getElementById("processingText").textContent = "Generating...";
  document.getElementById("retryBtn").classList.add("hidden");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();
    if (!data.success) throw new Error(data.message);

    processingOverlay.classList.add("hidden");

    const popupFlyer = document.getElementById("popupFlyer");
    const popupDownload = document.getElementById("popupDownload");

    popupFlyer.src = data.flyerUrl;
    resultOverlay.classList.remove("hidden");

    /* -------- DOWNLOAD -------- */
    popupDownload.onclick = async () => {
      popupDownload.textContent = "Downloading...";
      popupDownload.disabled = true;

      const res = await fetch(data.flyerUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${nameInput.value}-flyer.png`;
      a.click();

      URL.revokeObjectURL(url);
      popupDownload.textContent = "Download";
      popupDownload.disabled = false;
    };
  } catch (err) {
    console.error(err);

    document.getElementById("processingText").textContent =
      "Network error! Please try again.";
    const retryBtn = document.getElementById("retryBtn");
    retryBtn.classList.remove("hidden");

    retryBtn.onclick = () => {
      processingOverlay.classList.add("hidden");

      // ✅ clear image only, keep name
      imageInput.value = "";
      previewImg.hidden = true;
    };
  }
 }
});

/* ---------------------------
   CLOSE RESULT POPUP
----------------------------*/
resultOverlay.querySelector(".close-btn").onclick = () => {
  resultOverlay.classList.add("hidden");
};
