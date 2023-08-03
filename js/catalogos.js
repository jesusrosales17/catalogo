const form = document.getElementById("form");
const inputName = document.getElementById("name");
const containerCatalogos = document.getElementById("containerCatalogos");

const btnShowModal = document.getElementById("showModal");
const btnCloseModal = document.getElementById("closeModal");
const modal = document.getElementById("modal");

let arrayCatalogos = [];
let isUpdating = false;
let id;

// Agregar o actualizar catalogo
const onSubmit = async (e) => {
  e.preventDefault();

  if (inputName.value.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Faltan datos!",
      text: "El nombre del catalogo es obligatorio!",
    });

    return;
  }

  const formData = new FormData(form);
  if (isUpdating) {
    formData.append("id", id);
  }

  const response = await fetch(
    `http://sistema.test/api/${
      isUpdating ? "updateCatalogo.php" : "catalogo.php"
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

// Muestra el modal para agregar o actualizar el catalogo
const showModal = (updating = false, catalogo = {}) => {
  modal.style.display = "flex";

  if (updating) {
    form.querySelector(".form__title").textContent = "Actualizar Catalogo";
    form.querySelector(".form__submit").value = "Actualizar Catalogo";
    inputName.value = catalogo.nombre;
    id = catalogo.idCatalogo;
    isUpdating = true;
  } else {
    form.querySelector(".form__title").textContent = "Agregar Catalogo";
    form.querySelector(".form__submit").value = "Agregar Catalogo";
    isUpdating = false;
  }
};
// Cierra el modal
const closeModal = () => {
  modal.style.display = "none";
  inputName.value = "";
  isUpdating = false;
};

// HTML de cada catologo
const createCatalogoHTML = (catalogo) => {
  const { idCatalogo, nombre } = catalogo;

  const containerLi = document.createElement("LI");
  containerLi.classList.add("catalogos__item");

  const nameCatalogo = document.createElement("P");
  nameCatalogo.textContent = nombre;

  const containerActions = document.createElement("DIV");
  containerActions.classList.add("catalogos__actions");

  const viewCatalogoA = document.createElement("A");
  viewCatalogoA.href = `./productos.php?id=${idCatalogo}`;

  const viewCatalogoImg = document.createElement("IMG");
  viewCatalogoImg.src = "../images/view.png";
  viewCatalogoImg.alt = "Ver catalogo";

  const editCatalogoImg = document.createElement("IMG");
  editCatalogoImg.src = "../images/edit.png";
  editCatalogoImg.alt = "Editar catalogo";

  editCatalogoImg.addEventListener("click", () => showModal(true, catalogo));

  const deleteCatalogoImg = document.createElement("IMG");
  deleteCatalogoImg.src = "../images/delete.png";
  deleteCatalogoImg.alt = "Eliminar catalogo";
  deleteCatalogoImg.addEventListener("click", () => deleteCatalogo(idCatalogo));

  viewCatalogoA.appendChild(viewCatalogoImg);

  containerActions.appendChild(viewCatalogoA);
  containerActions.appendChild(editCatalogoImg);
  containerActions.appendChild(deleteCatalogoImg);

  containerLi.appendChild(nameCatalogo);
  containerLi.appendChild(containerActions);

  containerCatalogos.appendChild(containerLi);
};

// muestra todos los catalogos en su contenedor
const showCatalogos = (catalogos) => {
  if (catalogos.length === 0) {
    const li = document.createElement("li");
    li.classList.add("catalogos__empty");
    li.textContent = 'No hay catalogos';
    containerCatalogos.appendChild(li);
  } else {
    while (containerCatalogos.firstChild) {
      containerCatalogos.removeChild(containerCatalogos.firstChild);
    }
    catalogos.forEach((catalogo) => {
      createCatalogoHTML(catalogo);
    });
  }
};
// Eliminar catalogo
const deleteCatalogo = (id) => {
  Swal.fire({
    title: "Estas seguro?",
    text: "Todos los productos de este catalogo seran eliminados y no los podras recuperar",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "si, Eliminar catalogo!",
    cancelButtonText: "cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await fetch(
        `http://sistema.test/api/deleteCatalogo.php`,
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

        arrayCatalogos = arrayCatalogos.filter(
          (catalogo) => catalogo.idCatalogo != id
        );
        showCatalogos(arrayCatalogos);
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

// Optener todos los catalogos al iniciar la pagina
const getCatalogos = async () => {
  const response = await fetch("http://sistema.test/api/catalogo.php");
  const result = await response.json();
  arrayCatalogos = [...result.filter(catalogo => catalogo.activo === '1')];
  showCatalogos(arrayCatalogos);
};

form.addEventListener("submit", onSubmit);
btnCloseModal.addEventListener("click", closeModal);
btnShowModal.addEventListener("click", () => showModal());
document.addEventListener("DOMContentLoaded", getCatalogos);
