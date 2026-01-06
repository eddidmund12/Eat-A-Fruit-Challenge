const imageInput = document.getElementById("Image");
const preview = document.getElementById("preview");
const form = document.getElementById("flyerForm");

imageInput.addEventListener("change", ()=> {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        preview.src = reader.result;
        preview.hidden = false;
    };
    reader.readAsDataURL(file);
});

form.addEventListener("submit", async(e) =>{
    e.preventDefault();

    const name = document.getElementById("name").value;
    const image = imageInput.files[0];
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
});


const res = await fetch("http://localhost:5000/api/register", {
  method: "POST",
  body: formData,
});
