const tbody = document.querySelector("tbody");
const modal = document.getElementById("modal");

fetch("/api/admin/users")
  .then(res => res.json())
  .then(users => {
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

function showUser(id) {
  fetch(`/api/admin/users/${id}`)
    .then(res => res.json())
    .then(user => {
      document.getElementById("profileImg").src = user.profileImage;
      document.getElementById("flyerImg").src = user.flyerImage;
      modal.style.display = "flex";
    });
}

modal.onclick = () => modal.style.display = "none";

document.getElementById("clearBtn").onclick = () => {
  if (confirm("Are you sure you want to clear all participants? This action cannot be undone.")) {
    fetch("/api/admin/users", { method: "DELETE" })
      .then(res => res.json())
      .then(() => location.reload());
  }
};
