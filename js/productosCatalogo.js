const tableBody = document.getElementById("tableBody");
const table = document.getElementById("table");
const container = document.getElementById("container");
const form = document.getElementById("form");

const btnShowModalForm = document.getElementById("showModalForm");
const btnCloseModalForm = document.getElementById("closeModal");
const btnCloseModalProducto = document.getElementById("closeModalProduct");
const modalForm = document.getElementById("modalForm");
const modalProduct = document.getElementById("modalProduct");
const btnEdit = document.getElementById("btnEdit");
const btnDelete = document.getElementById("btnDelete");

const formSearch = document.getElementById('formSearch');

const idByUrl = new URLSearchParams(window.location.search).get("id");
let ArrayProducts = [];
let isUpdating = false;
let imgActual = '';
let idForActions = '';


const closeModalProduct = () => {
    modalProduct.style.display = "none";
    modalProduct.querySelector("h2").textContent = "";
    modalProduct.querySelectorAll("span").forEach((span) => {
        span.textContent = '';
    });
}
const showModalProduct = (product) => {
    idForActions = product.idProducto;

    modalProduct.style.display = "flex";
    modalProduct.querySelector("h2").textContent = product.nombre;
    modalProduct.querySelector("#imgProducto").src = '../images/products/' + product.imagen;
    modalProduct.querySelector("#imgProducto").alt = 'Imagen del producto ' + product.nombre;
    modalProduct.querySelectorAll("span").forEach((span) => {
        span.textContent = product[span.dataset.attribute] || 'No asignado';
    });
    btnEdit.addEventListener('click', () => {
        closeModalProduct();
        showModalForm(true, product);
    });
}   


const createProductHtml = (product) => {
  const tr = document.createElement("tr");
  tr.classList.add("table__tr", "table__tr--body");

  const tdName = document.createElement("td");
  tdName.classList.add("table__td");
  tdName.textContent = product.nombre;

  const tdBrand = document.createElement("td");
  tdBrand.classList.add("table__td");
  tdBrand.textContent = product.marca;

  const tdPrice = document.createElement("td");
  tdPrice.classList.add("table__td");
  tdPrice.textContent = product.precioVenta;

  const tdActions = document.createElement("td");
  tdActions.classList.add("table__td", "table__actions");
  const img = document.createElement("img");
  img.addEventListener('click', () => showModalProduct(product));
  img.src = "../images/view.png";
  img.alt = "Ver informacion";

  tdActions.appendChild(img);
  tr.appendChild(tdName);
  tr.appendChild(tdBrand);
  tr.appendChild(tdPrice);
  tr.appendChild(tdActions);
  tableBody.appendChild(tr);

};

const showProducts = (
  products,
  msgEmpty = "No hay productos en este catalogo"
) => {
  console.log(products)

  const errorsAlerts = document.querySelectorAll(".productos__empty");
  errorsAlerts.forEach((error) => error.remove());

  if (products.length === 0) {
    table.style.display = "none";
    const p = document.createElement("p");
    p.classList.add("productos__empty");
    p.textContent = msgEmpty;
    container.appendChild(p);
  } else {
    table.style.display = "table";
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    products.forEach((product) => {
        createProductHtml(product);
    });
  }
};

const deleteProduct = () => {
  Swal.fire({
    title: "Estas seguro?",
    text: "El producto sera eliminado completamente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "si, Eliminar producto!",
    cancelButtonText: "cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log(idForActions)
      const response = await fetch(
        `http://sistema.test/api/deleteProducto.php`,
        {
          method: "POST",
          body: JSON.stringify({ id: idForActions }),
        }
      );
      const result = await response.json();

      if (result.code === 200) {
        Swal.fire({
          icon: "success",
          title: "Todo listo!",
          text: result.msg,
        });

        ArrayProducts = ArrayProducts.filter(
          (producto) => producto.idProducto != idForActions
        );
        showProducts(ArrayProducts);
        closeModalProduct();
      } else {
        Swal.fire({
          icon: "error",
          title: "Ocurrio un error!",
          text:
            result.msg ||
            "Ocurrio un error inesperado intentelo denuevo más tarde",
        });
      }
    }
  });
};


const getProductsFromCatalogoById = async (id) => {
  const response = await fetch("http://sistema.test/api/productos.php/" + id);
  const data = await response.json();
  if (data.code !== 200) {
    window.location.href = "./";
    return;
  }
  return data.data;
};

const showModalForm = (updating = false, product = {}) => {
  modalForm.style.display = "flex";

  if (updating) {
    idForActions = product.idProducto;
    imgActual = product.imagen;
    form.querySelector(".form__title").textContent = "Actualizar Producto";
    form.querySelector(".form__submit").value = "Actualizar Producto";
    

    form.querySelector('#name').value = product.nombre;
    form.querySelector('#brand').value = product.marca;
    form.querySelector('#description').value = product.descripcion;
    form.querySelector('#dateAlta').value = product.fechaAlta;
    form.querySelector('#dateBaja').value = product.fechaBaja;
    form.querySelector('#type').value = product.tipo;
    form.querySelector('#promocion').value = product.promocion;
    form.querySelector('#buyPrice').value = product.precioCompra;
    form.querySelector('#salePrice').value = product.precioVenta;
    form.querySelector('#amound').value = product.cantidadProducto;
    isUpdating = true;
  } else {
    form.querySelector(".form__title").textContent = "Agregar Producto";
    form.querySelector(".form__submit").value = "Agregar Producto";
    isUpdating = false;
  }
};
// Cierra el modal
const closeModalForm = () => {
  modalForm.style.display = "none";
  idForActions = '';

  form.querySelector('#name').value = "";
  form.querySelector('#brand').value = "";
  form.querySelector('#description').value = "";
  form.querySelector('#dateAlta').value = "";
  form.querySelector('#dateBaja').value = "";
  form.querySelector('#type').value = "";
  form.querySelector('#promocion').value = "";
  form.querySelector('#buyPrice').value = "";
  form.querySelector('#salePrice').value = "";
  form.querySelector('#amound').value = "";


  isUpdating = false;
};

const validateForm = (form) => {
  let resp = {
    error: false,
    msg: "",
  };

  form.querySelectorAll("input").forEach((input) => {
    if (input.type !== "submit") {
      if (input.value.trim() === "" ) {
        if(input.type === 'file' && !isUpdating || input.type !== 'file') {
            resp = {
              error: true,
              msg: "Todos los datos son obligatorios!",
            };
            return resp;
        } 
      }

      if (input.type === "number") {
        if (input.value < 0 || isNaN(input.value)) {
          resp = {
            error: true,
            msg: "Debes agregar un numero!",
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
    formData.append("idProducto", idForActions);
    formData.append("imagenActual", imgActual);
    } else {
      formData.append("idCatalogo", idByUrl);
  }

  const response = await fetch(
    `http://sistema.test/api/${
      isUpdating ? "updateProducto.php" : "productos.php"
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

const searchProduct = (e) =>  {
  e.preventDefault();

  const formData = new FormData(formSearch);
  const productSearch = formData.get('search').trim();


  const productsFilter = ArrayProducts.filter(product => product.nombre.includes(productSearch));
  showProducts(productsFilter, 'No hay productos con ese nombre');
;}


document.addEventListener("DOMContentLoaded", async () => {
  ArrayProducts = await getProductsFromCatalogoById(idByUrl);
  showProducts(ArrayProducts);
});

btnShowModalForm.addEventListener("click", () => showModalForm());
btnCloseModalForm.addEventListener("click", closeModalForm);
btnCloseModalProducto.addEventListener("click", closeModalProduct);
form.addEventListener("submit", onSubmit);
btnDelete.addEventListener('click', deleteProduct );
formSearch.addEventListener('submit', searchProduct)

