const form = document.getElementById("form");
const containerClientes = document.getElementById("containerClientes");
const container = document.getElementById("container");

const btnShowModalForm = document.getElementById("showModalForm");
const btnCloseModalForm = document.getElementById("closeModalForm");
const modal = document.getElementById("modal");

const formSearch = document.getElementById("formSearch");

let arrayClients = [];
let isUpdating;
let idUpdate;

// Muestra el modal para agregar o actualizar el cliente
const showModal = (updating = false, catalogo = {}) => {
  modal.style.display = "flex";
  form.querySelector(".form__title").textContent = updating
    ? "Actualizar Cliente"
    : "Agregar Cliente";
  isUpdating = updating;
  form.querySelector(".form__submit").value = updating
    ? "Actualizar Cliente"
    : "Agregar Cliente";
  isUpdating = updating;

  if (updating) {
    idUpdate = catalogo.idCliente;
    form.querySelector("#name").value = catalogo.nombreCompleto;
    form.querySelector("#numberPhone").value = catalogo.telefono;
    form.querySelector("#birthdate").value = catalogo.fechaNacimiento;
  }
};
// Cierra el modal
const closeModal = () => {
  modal.style.display = "none";
  form.querySelector("#name").value = "";
  form.querySelector("#numberPhone").value = "";
  form.querySelector("#birthdate").value = "";
  isUpdating = false;
  idUpdate = "";
};

const deleteClient = (id) => {
  Swal.fire({
    title: "Estas seguro?",
    text: "El cliente sera eliminado completamente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "si, Eliminar este cliente!",
    cancelButtonText: "cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await fetch(
        `http://sistema.test/api/deleteCliente.php`,
        {
          method: "POST",
          body: JSON.stringify({ id }),
        }
      );
      const result = await response.json();

      if (result.code === 200) {
        Swal.fire({
          icon: "success",
          title: "Todo listo!",
          text: result.msg,
        });

        arrayClients = arrayClients.filter((client) => client.idCliente != id);
        showClients(arrayClients);
      } else {
        Swal.fire({
          icon: "error",
          title: "Faltan datos!",
          text:
            result.msg ||
            "Ocurrio un error inesperado intentelo denuevo más tarde",
        });
      }
    }
  });
};

const createClientesHTML = (client) => {
  const tr = document.createElement("tr");
  tr.classList.add("table__tr", "table__tr--body");

  const tdName = document.createElement("td");
  tdName.classList.add("table__td");
  tdName.textContent = client.nombreCompleto;

  const tdNumberPhone = document.createElement("td");
  tdNumberPhone.classList.add("table__td");
  tdNumberPhone.textContent = client.telefono;

  const tdDate = document.createElement("td");
  tdDate.classList.add("table__td");
  tdDate.textContent = client.fechaNacimiento;

  const tdActions = document.createElement("td");
  tdActions.classList.add("table__td", "table__actions");

  const imgEdit = document.createElement("img");
  imgEdit.src = "../images/edit.png";
  imgEdit.alt = "Editar informacion";
  imgEdit.addEventListener("click", () => showModal(true, client));

  const imgDelete = document.createElement("img");
  imgDelete.src = "../images/delete.png";
  imgDelete.alt = "Eliminar informacion";
  imgDelete.addEventListener("click", () => deleteClient(client.idCliente));

  tdActions.appendChild(imgEdit);
  tdActions.appendChild(imgDelete);
  tr.appendChild(tdName);
  tr.appendChild(tdNumberPhone);
  tr.appendChild(tdDate);
  tr.appendChild(tdActions);
  tableBody.appendChild(tr);
};

const showClients = (clients, msgEmpty = "No hay clientes registrados") => {
  const errorsAlerts = document.querySelectorAll(".clients__empty");
  errorsAlerts.forEach((error) => error.remove());
  
  if (clients.length === 0) {
    table.style.display = "none";
    const p = document.createElement("p");
    p.classList.add("clients__empty");
    p.textContent = msgEmpty;
    container.appendChild(p);
  } else {
    table.style.display = "table";

    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    clients.forEach((client) => {
      createClientesHTML(client);
    });
  }
};

const validateForm = (form) => {
  let resp = {
    error: false,
    msg: "",
  };

  form.querySelectorAll("input").forEach((input) => {
    if (input.type !== "submit") {
      if (input.value.trim() === "") {
        resp = {
          error: true,
          msg: "Todos los datos son obligatorios!",
        };
        return resp;
      }

      if (input.type === "tel") {
        if (input.value < 0 || isNaN(input.value)) {
          resp = {
            error: true,
            msg: "El numero de telefono debe ser solo números!",
          };
          return resp;
        }
      }
    }
  });

  if (!resp.error) {
    form.querySelectorAll("textarea").forEach((textArea) => {
      if (textArea.value.trim() === "") {
        resp = {
          error: true,
          msg: "Todos los datos son obligatorios!",
        };
        return resp;
      }
    });
  }

  return resp;
};

// Agregar o actualizar producto
const onSubmit = async (e) => {
  e.preventDefault();

  //validar datos y mostrar alerta

  const formValidation = validateForm(form);

  if (formValidation.error) {
    Swal.fire({
      icon: "error",
      title: "Ocurrio un error",
      text: formValidation.msg,
    });

    return;
  }

  const formData = new FormData(form);

  if (isUpdating) {
    formData.append("id", idUpdate);
  }

  const response = await fetch(
    `http://sistema.test/api/${
      isUpdating ? "updateCliente.php" : "clientes.php"
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

const searchProduct = (e) => {
  e.preventDefault();

  const formData = new FormData(formSearch);
  const productSearch = formData.get("search");

  const clientsFilter = arrayClients.filter((client) =>
    client.nombreCompleto.includes(productSearch)
  );
  showClients(clientsFilter, "No se encontro ningun cliente con ese nombre");
};

const getClients = async () => {
  const response = await fetch("http://sistema.test/api/clientes.php");
  const data = await response.json();

  return data.filter((client) => client.activo === "1");
};

btnShowModalForm.addEventListener("click", () => showModal());
btnCloseModalForm.addEventListener("click", closeModal);
form.addEventListener("submit", onSubmit);
document.addEventListener("DOMContentLoaded", async () => {
  arrayClients = await getClients();
  showClients(arrayClients);
});
formSearch.addEventListener("submit", searchProduct);
