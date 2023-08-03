const form = document.getElementById("form");
const containerClientes = document.getElementById("containerClientes");
const container = document.getElementById("container");

const btnShowModalForm = document.getElementById("btnShowModalForm");
const btnCloseModalForm = document.getElementById("btnCloseModalForm");
const modal = document.getElementById("modal");

const selectCatalogo = document.getElementById("selectCatalogo");
const list = document.getElementById("list");
const listSale = document.getElementById("listSale");
const clientInput = document.getElementById("clientInput");
const wayToPayInput = document.getElementById("wayToPay");
const inputPaymentAmound = document.getElementById("inputPaymentAmount");
const spanTotalPayments = document.getElementById("resumTotalPayments");

const formSearch = document.getElementById('formSearch');


let dataClientes = [];
let dataCatalogos = [];
let dataProductos = [];

let productsSelected = [];
let totalProductsSale = 0;
let fullSalePrice = 0;
let totalPayments = 1;

const showSpinner = () => {
  document.getElementById('spinner').style.display = 'flex';
}

const hideSpinner = () => {
  document.getElementById('spinner').style.display = 'none';
}

// Muestra el modal para agregar o actualizar el cliente

const validateForm = (form) => {
  let resp = {
    error: false,
    msg: "",
  };

  form.querySelectorAll("input").forEach((input) => {
    if (input.type !== "submit") {
      if (input.value.trim() === "" && input.name != "paymentAmount") {
        resp = {
          error: true,
          msg: "Todos los datos son obligatorios!",
        };
        return resp;
      }

      if (input.type === "number") {
        if (input.value < 0 || isNaN(input.value)) {
          resp = {
            error: true,
            msg: "Debes escribir solo números!",
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

const moreProduct = (product) => {
  productsSelected = productsSelected.map((p) => {
    if (
      p.idProducto === product.idProducto &&
      p.cantidadAVender < p.cantidadTotalProducto
    ) {
      p.cantidadAVender += 1;
    }
    return p;
  });

  showProductsSale(productsSelected);

  totalProductsSale = 0;
  fullSalePrice = 0;

  productsSelected.forEach((product) => {
    totalProductsSale += product.cantidadAVender;

    fullSalePrice +=
      dataProductos.find((p) => product.idProducto === p.idProducto)
        .precioVenta * product.cantidadAVender;
  });

  document.getElementById("resumAmoundProductsSale").textContent =
    totalProductsSale;
  document.getElementById("resumFullSalePrice").textContent =
    "$" + fullSalePrice;

  let text;

  switch (wayToPayInput.value) {
    case "1":
      text = "Al contado";
      totalPayments = 1;
      break;
    case "2":
      text = "Pagos diarios";
      break;
    case "3":
      text = "Pagos semanales";
      break;
    case "4":
      text = "Pagos quincenales";
      break;
      case "5":
      text = "Pagos mensuales";
      break;
    default:
      text = "No seleccionada";
      break;
  }

  if (wayToPayInput.value > 1) {
    document.getElementById("inputPaymentAmount").style.display = "block";
    spanTotalPayments.textContent =
      totalPayments +
      " pagos de $" +
      fullSalePrice / (inputPaymentAmound.querySelector("input")?.value || 1);
  } else {
    document.getElementById("inputPaymentAmount").style.display = "none";
    spanTotalPayments.textContent =
      totalPayments + " pagos de $" + fullSalePrice;
  }

  document.getElementById("ResumWayToPay").textContent = text;
};

const reduceProduct = (product) => {
  productsSelected = productsSelected.map((p) => {
    if (p.idProducto === product.idProducto && p.cantidadAVender > 1) {
      p.cantidadAVender -= 1;
    }
    return p;
  });

  showProductsSale(productsSelected);

  totalProductsSale = 0;
  fullSalePrice = 0;

  productsSelected.forEach((product) => {
    totalProductsSale += product.cantidadAVender;

    fullSalePrice +=
      dataProductos.find((p) => product.idProducto === p.idProducto)
        .precioVenta * product.cantidadAVender;
  });

  document.getElementById("resumAmoundProductsSale").textContent =
    totalProductsSale;
  document.getElementById("resumFullSalePrice").textContent =
    "$" + fullSalePrice;

  let text;

  switch (wayToPayInput.value) {
    case "1":
      text = "Al contado";
      totalPayments = 1;
      break;
    case "2":
      text = "Pagos diarios";
      break;
    case "3":
      text = "Pagos semanales";
      break;
    case "4":
      text = "Pagos quincenales";
      break;
      case "5":
        text = "Pagos mensuales";
        break;
    default:
      text = "No seleccionada";
      break;
  }

  if (wayToPayInput.value > 1) {
    document.getElementById("inputPaymentAmount").style.display = "block";
    spanTotalPayments.textContent =
      totalPayments +
      " pagos de $" +
      fullSalePrice / (inputPaymentAmound.querySelector("input")?.value || 1);
  } else {
    document.getElementById("inputPaymentAmount").style.display = "none";
    spanTotalPayments.textContent =
      totalPayments + " pagos de $" + fullSalePrice;
  }

  document.getElementById("ResumWayToPay").textContent = text;
};

const createProductsSaleHTML = (product) => {
  const dataProduct = dataProductos.find(
    (p) => p.idProducto === product.idProducto
  );
  const li = document.createElement("LI");
  li.classList.add("sale__item");

  const saleInfoContainer = document.createElement("DIV");
  saleInfoContainer.classList.add("sale__infoContainer");

  const img = document.createElement("IMG");
  img.src = "../images/products/" + dataProduct.imagen;
  img.alt = dataProduct.nombre;
  img.classList.add("sale__img");

  const saleInfo = document.createElement("DIV");
  saleInfo.classList.add("sale__info");

  const name = document.createElement("P");
  name.textContent = "Nombre: ";

  const nameSpan = document.createElement("SPAN");
  nameSpan.textContent = dataProduct.nombre;

  const brand = document.createElement("P");
  brand.textContent = "Marca: ";

  const brandSpan = document.createElement("SPAN");
  brandSpan.textContent = dataProduct.marca;

  const price = document.createElement("P");
  price.textContent = "Precio C/U: ";

  const priceSpan = document.createElement("SPAN");
  priceSpan.textContent = "$" + dataProduct.precioVenta;

  const catalogo = document.createElement("P");
  catalogo.textContent = "Catalogo: ";

  const catalogoSpan = document.createElement("SPAN");
  dataCatalogos.forEach((catalogo) => {
    if (catalogo.idCatalogo === product.idCatalogo) {
      catalogoSpan.textContent = catalogo.nombre;
    }
  });

  const amound = document.createElement("DIV");
  amound.classList.add("amound");

  const btnAdd = document.createElement("BUTTON");
  btnAdd.setAttribute("id", "add");
  btnAdd.setAttribute("type", "button");
  btnAdd.classList.add("amound__btn");
  btnAdd.textContent = "+";
  btnAdd.addEventListener("click", () => moreProduct(product));

  const btnReduce = document.createElement("BUTTON");
  btnReduce.setAttribute("id", "reduce");
  btnReduce.setAttribute("type", "button");
  btnReduce.classList.add("amound__btn");
  btnReduce.textContent = "-";
  btnReduce.addEventListener("click", () => reduceProduct(product));

  const amoundValue = document.createElement("P");
  amoundValue.classList.add("amound__value");
  amoundValue.textContent = product.cantidadAVender;

  name.appendChild(nameSpan);
  price.appendChild(priceSpan);
  brand.appendChild(brandSpan);
  catalogo.appendChild(catalogoSpan);

  saleInfo.appendChild(name);
  saleInfo.appendChild(brand);
  saleInfo.appendChild(price);
  saleInfo.appendChild(catalogo);

  saleInfoContainer.appendChild(img);
  saleInfoContainer.appendChild(saleInfo);

  amound.appendChild(btnReduce);
  amound.appendChild(amoundValue);
  amound.appendChild(btnAdd);

  li.appendChild(saleInfoContainer);
  li.appendChild(amound);

  listSale.appendChild(li);
};

function showProductsSale(products) {
  while (listSale.firstChild) {
    listSale.removeChild(listSale.firstChild);
  }
  products.forEach((product) => {
    createProductsSaleHTML(product);
  });
}

const createCatalogoOptionHTML = (catalogo) => {
  const option = document.createElement("option");
  option.value = catalogo.idCatalogo;
  option.textContent = catalogo.nombre;
  selectCatalogo.appendChild(option);
};
const createClientOptionHTML = (client) => {
  const option = document.createElement("option");
  option.value = client.idCliente;
  option.textContent = client.nombreCompleto;
  clientInput.appendChild(option);
};

const showClientsOption = (clients) => {
  clients.forEach((client) => {
    createClientOptionHTML(client);
  });
};
const showCatalogos = (catalogos) => {
  while (selectCatalogo.filrstChild) {
    selectCatalogo.removeChild(selectCatalogo.firstChild);
  }
  catalogos.forEach((catalogo) => {
    createCatalogoOptionHTML(catalogo);
  });
};

const selectProduct = (li, product) => {
  if(product.cantidadProducto > 0) {
    li.classList.toggle("selected");
    if (!li.classList.contains("selected")) {
      product.selected = false;
      productsSelected = productsSelected.filter(
        (element) => element.idProducto != product.idProducto
      );
    } else {
      product.selected = true;
      productsSelected = [
        ...productsSelected,
        {
          idProducto: product.idProducto,
          idCatalogo: product.idCatalogo,
          cantidadTotalProducto: product.cantidadProducto,
          cantidadAVender: 1,
        },
      ];
    }
  }
};

const showModal = (products) => {
  modal.style.display = "flex";
  showProductsSale(products);

  products.forEach((product) => {
    totalProductsSale += product.cantidadAVender;
    fullSalePrice +=
      dataProductos.find((p) => product.idProducto === p.idProducto)
        .precioVenta * product.cantidadAVender;
  });

  document.getElementById("resumAmoundProductsSale").textContent =
    totalProductsSale;
  document.getElementById("resumFullSalePrice").textContent =
    "$" + fullSalePrice;
};
// Cierra el modal
const closeModal = (e) => {
  modal.style.display = "none";
  totalProductsSale = 0;
  fullSalePrice = 0;
};

const createProductHtml = (product) => {
  const li = document.createElement("LI");
  li.classList.add("products__item");
  if (product.selected) {
    li.classList.add("selected");
  }

  li.addEventListener("click", () => selectProduct(li, product));

  const title = document.createElement("H3");
  title.textContent = product.nombre;
  title.classList.add("products__title");

  const productsContainer = document.createElement("DIV");
  productsContainer.classList.add("products__container");

  const img = document.createElement("IMG");
  img.src = "../images/products/" + product.imagen;
  img.alt = product.nombre;

  const productsInfo = document.createElement("div");
  productsInfo.classList.add("products__info");

  const brand = document.createElement("P");
  brand.textContent = "Marca: ";

  const brandSpan = document.createElement("SPAN");
  brandSpan.textContent = product.marca;

  const price = document.createElement("P");
  price.textContent = "Precio de Venta: ";

  const priceSpan = document.createElement("SPAN");
  priceSpan.textContent = "$" + product.precioVenta;

  const amound = document.createElement("P");
  amound.textContent = "Existencia: ";

  const amoundSpan = document.createElement("SPAN");
  amoundSpan.textContent = product.cantidadProducto;

  brand.appendChild(brandSpan);
  price.appendChild(priceSpan);
  amound.appendChild(amoundSpan);

  productsInfo.appendChild(brand);
  productsInfo.appendChild(price);
  productsInfo.appendChild(amound);

  productsContainer.appendChild(img);
  productsContainer.appendChild(productsInfo);

  li.appendChild(title);
  li.appendChild(productsContainer);

  list.appendChild(li);
};

const showProducts = (
  products,
  msgEmpty = "No hay productos en este catalogo"
) => {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  if (products.length === 0) {
    const li = document.createElement("li");
    li.classList.add("productos__empty");
    li.textContent = msgEmpty;
    list.appendChild(li);
  } else {
    
    products.forEach((product) => {
      createProductHtml(product);
    });
  }
};

function fetchDataFromAPI(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("Error en la solicitud de la API");
    }
    return response.json();
  });
}

const getData = () => {
  const urlClientes = "http://sistema.test/api/clientes.php";
  const urlCatalogos = "http://sistema.test/api/catalogo.php";
  const urlProductos = "http://sistema.test/api/productos.php";

  const promises = [
    fetchDataFromAPI(urlClientes),
    fetchDataFromAPI(urlCatalogos),
    fetchDataFromAPI(urlProductos),
  ];

  showSpinner();
  Promise.all(promises)
    .then((results) => {
      dataClientes = results[0].filter(client => client.activo === '1');
      dataCatalogos = results[1].filter(catalogo => catalogo.activo === '1');
      dataProductos = results[2].filter(product => product.activo === '1');

      showCatalogos(dataCatalogos);
      showClientsOption(dataClientes);
      hideSpinner();
    })
    .catch((error) => {
      // Manejar errores si alguna de las promesas falla
      console.error("Error al obtener datos:", error);
    });
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
  formData.append("pedido", JSON.stringify(productsSelected));

  showSpinner();
  const response = await fetch(`http://sistema.test/api/ventas.php`, {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  hideSpinner();
  if (result.code === 200) {
    Swal.fire({
      icon: "success",
      title: "Todo listo!",
      text: result.msg,
    }).then(() => {
      location.href = './';
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
  const productSearch = formData.get('search');

  
  const productsFilter = dataProductos.filter(product => product.nombre.includes(productSearch));
  showProducts(productsFilter, 'No hay productos con ese nombre');
;}


document.addEventListener("DOMContentLoaded", () => {
  getData();
  showProducts(
    dataProductos.filter(
      (product) => product.idCatalogo === selectCatalogo.value
    ),
    "Elige un catalogo para ver sus productos"
  );
});
selectCatalogo.addEventListener("change", () =>
  showProducts(
    dataProductos.filter(
      (product) => product.idCatalogo === selectCatalogo.value
    )
  )
);

btnShowModalForm.addEventListener("click", () => {
  if (productsSelected.length > 0) {
    showModal(productsSelected);
  }
});
btnCloseModalForm.addEventListener("click", closeModal);

clientInput.addEventListener("change", (e) => {
  const dataClient = dataClientes.find(
    (client) => (client.idCliente = e.target.value)
  );
  document.getElementById("resumNameClient").textContent =
    dataClient?.nombreCompleto || "No seleccionado";
});
wayToPayInput.addEventListener("change", (e) => {
  let text;

  switch (e.target.value) {
    case "1":
      text = "Al contado";
      totalPayments = 1;
      break;
    case "2":
      text = "Pagos diarios";
      break;
    case "3":
      text = "Pagos semanales";
      break;
    case "4":
      text = "Pagos quincenales";
      break;
      case "5":
        text = "Pagos mensuales";
        break;
    default:
      text = "No seleccionada";
      break;
  }

  if (e.target.value > 1) {
    document.getElementById("inputPaymentAmount").style.display = "block";
    inputPaymentAmound.querySelector("input").value = "";
  } else {
    spanTotalPayments.textContent =
      totalPayments + " pago de $" + fullSalePrice;
    document.getElementById("inputPaymentAmount").style.display = "none";
  }

  document.getElementById("ResumWayToPay").textContent = text;
});

inputPaymentAmound.addEventListener("input", (e) => {
  if (e.target.value == "") {
    spanTotalPayments.textContent = "0";
  } else {
    totalPayments = e.target.value;
    spanTotalPayments.textContent =
      totalPayments + " pagos de $" + fullSalePrice / e.target.value;
  }
});
form.addEventListener("submit", onSubmit);
formSearch.addEventListener('submit', searchProduct)
