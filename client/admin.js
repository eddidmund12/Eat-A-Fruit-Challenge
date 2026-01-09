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
      modal.hidden = false;
    });
}

modal.onclick = () => modal.hidden = true;
