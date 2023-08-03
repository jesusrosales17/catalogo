const container = document.getElementById("container");
const table = document.getElementById("table");
const tbody = document.getElementById("tbody");
const modal = document.getElementById("modal");
const form = document.getElementById("form");
const formTitle = document.getElementById("formTitle");
const btnClose = document.getElementById("btnClose");
const btnSubmit = document.getElementById("btnSubmit");
const btnAddUser = document.getElementById("addUser");

const nombre = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const active = document.getElementById("active");

let isUpdating = false;
let idUpdate = null;
let users = [];

const showModal = () => {
  modal.style.display = "flex";

  if (isUpdating) {
    formTitle.textContent = "Actualizar usuario";
    btnSubmit.value = "Actualizar";
    document.getElementById('select').style.display = "block";

    
    dataUser = users.find((user) => user.idUsuario === idUpdate);
    nombre.value = dataUser.nombre;
    email.value = dataUser.email;
    active.value = dataUser.activo;
  } else {
    document.getElementById('select').style.display = "none";
    active.value = "";
    formTitle.textContent = "Nuevo usuario";
    btnSubmit.value = "Crear";
  }
};

const closeModal = () => {
  modal.style.display = "none";
  isUpdating = false;
  idUpdate = null;

    nombre.value = "";
    email.value = "";
    password.value = "";
};

const createUserHTML = (user) => {
  const row = document.createElement("tr");
  const tdName = document.createElement("td");
  const tdEmail = document.createElement("td");
  const tdActive = document.createElement("td");
  const tdActions = document.createElement("td");

  tdName.textContent = user.nombre;
  tdEmail.textContent = user.email;
  tdActive.textContent = user.activo === "1" ? "Si" : "No";

  const btnEdit = document.createElement("img");
  btnEdit.src = "../images/edit.png";
  btnEdit.alt = "Editar usuario";
  btnEdit.addEventListener("click", () => {
    isUpdating = true;
    idUpdate = user.idUsuario;
    showModal();
  });

  tdActions.appendChild(btnEdit);

  row.appendChild(tdName);
  row.appendChild(tdEmail);
  row.appendChild(tdActive);
  row.appendChild(tdActions);

  tbody.appendChild(row);
};

const showUsers = (users) => {
  //comprobar que existan usuarios
  if (users.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No hay usuarios, comienza creando uno";
    p.classList.add("users__empty");
    container.appendChild(p);
    table.style.display = "none";
    return;
  }

  table.style.display = "table";
  // si existen alertas eliminarlas
  const alerts = document.querySelectorAll(".users__empty");
  if (alert.length > 0) {
    alerts.forEach((alert) => {
      alert.remove();
    });
  }
  //limpiar el html y mostrar los usuarios
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  users.forEach((user) => {
    createUserHTML(user);
  });
};

// obtiene los usuarios de la base de datos
const getUsers = async () => {
  const response = await fetch("http://sistema.test/api/usuarios.php");
  const data = await response.json();
  return data;
};

const onSubmit = async (e) => {
  e.preventDefault();
  

  if (nombre.value === "" || email.value === ""  || !isUpdating && password.value === "" || isUpdating && active.value === ''  ) {

    Swal.fire({
      icon: "error",
      title: "Faltan datos",
      text: "Todos los campos son obligatorios",
    });
    return;
  }
  const formData = new FormData(form);

  if (isUpdating) {
    formData.append("idUser", idUpdate);
  }

  const response = await fetch(
    `http://sistema.test/api/${
      isUpdating ? "updateUser.php" : "usuarios.php"
    }`,
    {
      method: "POST",
      body: formData,
    }
  );
  const result = await response.json();

  if (result.code === 200) {
    Swal.fire({
      icon: "success",
      title: "Todo listo!",
      text: result.msg,
    }).then(() => {
      location.reload();
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Ocurrio un error!",
      text:
        result.msg || "Ocurrio un error inesperado intentelo denuevo más tarde",
    });
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  users = await getUsers();
  showUsers(users);
});
btnClose.addEventListener("click", closeModal);
form.addEventListener("submit", onSubmit);
btnAddUser.addEventListener("click", showModal);
