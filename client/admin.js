const loginForm = document.getElementById("loginForm");
const adminContent = document.getElementById("adminContent");
const passcodeInput = document.getElementById("passcode");
const loginBtn = document.getElementById("loginBtn");
const error = document.getElementById("error");
const logoutBtn = document.getElementById("logoutBtn");
const tbody = document.querySelector("tbody");
const modal = document.getElementById("modal");
const toggle = document.getElementById("toggle")
const PASSCODE = "@10dayschallenge";
function checkLogin() {
  if (localStorage.getItem("adminLoggedIn") === "true") {
    showAdmin();
  } else {
    showLogin();
  }
}

function showLogin() {
  loginForm.style.display = "flex";
  adminContent.style.display = "none";
}

function showAdmin() {
  loginForm.style.display = "none";
  adminContent.style.display = "block";
  loadUsers();
}

function loadUsers() {
  fetch("/api/admin/users")
    .then(res => res.json())
    .then(users => {
      tbody.innerHTML = "";
      users.forEach(u => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${u.name}</td>
          <td>${new Date(u.createdAt).toLocaleString()}</td>
        `;
        tr.onclick = () => showUser(u._id);
        tbody.appendChild(tr);
      });
    });
}

function showUser(id) {
  fetch(`/api/admin/users/${id}`)
    .then(res => res.json())
    .then(user => {
      console.log("User flyerImage:", user.flyerImage);
      document.getElementById("flyerImg").src = user.flyerImage;
      modal.style.display = "flex";
    })
    .catch(err => console.error("Error fetching user:", err));
}

loginBtn.onclick = () => {
  if (passcodeInput.value === PASSCODE) {
    localStorage.setItem("adminLoggedIn", "true");
    showAdmin();
  } else {
    error.style.display = "block";
  }
};

logoutBtn.onclick = () => {
  localStorage.removeItem("adminLoggedIn");
  showLogin();
};

modal.onclick = () => modal.style.display = "none";

document.getElementById("clearBtn").onclick = () => {
  if (confirm("Are you sure you want to clear all participants? This action cannot be undone.")) {
    fetch("/api/admin/users", { method: "DELETE" })
      .then(res => res.json())
      .then(() => loadUsers());
  }
};

checkLogin();
toggle.addEventListener("click", ()=>{
  const isHidden = passcodeInput.type === "password";
  passcodeInput.type = isHidden ? "text" : "password";
  toggle.textContent = isHidden ? "Hide" : "show";
})