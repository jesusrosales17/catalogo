const salesContainer = document.getElementById("salesContainer");
const sectionSales = document.getElementById("sectionSales");
const selectClient = document.getElementById("client");
const modal = document.getElementById("modal");
const btnCloseModal = document.getElementById("btnModalExit");
const listSale = document.getElementById("list-products");
const btnShowModalPay = document.getElementById("btnShowModalPay");
const btnCloseModalPay = document.getElementById("btnCloseModalPay");
const modalPay = document.getElementById("modalPay");
const formPay = document.getElementById("formPay");
const inputAmountPay = document.getElementById("inputAmountPay");
const modalHistory = document.getElementById("modalHistory");
const btnCloseModalHistory = document.getElementById("btnCloseModalHistory");
const btnShowModalHistory = document.getElementById("btnShowModalHistory");
let dataSales = [];
let dataProducts = [];
let dataCatalogos = [];
let dataClients = [];

let idSale = null;

const onSubmit = async (e) => {
  e.preventDefault();

  if (inputAmountPay.value === "" || inputAmountPay.value <= 0) {
    Swal.fire({
      icon: "error",
      title: "Ocurrio un error!",
      text: "La cantidad a pagar es obligaria y tiene que ser mayor a 0",
    });
    return;
  }

  const formData = new FormData(formPay);
  formData.append("idSale", idSale);

  const response = await fetch(`http://sistema.test/api/registrarPago.php`, {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  console.log(result);

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

const closeModalPay = () => {
  modalPay.style.display = "none";
  btnCloseModal.removeEventListener("click", showModal);
  idSale = null;
};
const showModalPay = (sale) => {
  modalPay.style.display = "flex";

  inputAmountPay.value =
    (sale.totalDeVenta - sale.cantidadPagada) / (sale.cantidadPagos - sale.pagosRealizados);

    document.querySelector('#divButtonPay').style.display = (sale.cantidadPagos !== sale.pagosRealizados);

  idSale = sale.idVenta;
};

const createProductsSaleHTML = (product, sale) => {
  const dataProduct = dataProducts.find(
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

  const cantidadVendida = document.createElement("P");
  cantidadVendida.textContent = "Cantidad vendida: ";

  const cantidadVendidaSpan = document.createElement("SPAN");
  cantidadVendidaSpan.textContent = JSON.parse(sale.pedido).find(
    (s) => s.idProducto === product.idProducto
  ).cantidadAVender;

  name.appendChild(nameSpan);
  price.appendChild(priceSpan);
  brand.appendChild(brandSpan);
  catalogo.appendChild(catalogoSpan);
  cantidadVendida.appendChild(cantidadVendidaSpan);

  saleInfo.appendChild(name);
  saleInfo.appendChild(brand);
  saleInfo.appendChild(price);
  saleInfo.appendChild(catalogo);
  saleInfo.appendChild(cantidadVendida);

  saleInfoContainer.appendChild(img);
  saleInfoContainer.appendChild(saleInfo);

  li.appendChild(saleInfoContainer);

  listSale.appendChild(li);
};

const closeModalHistory = () => {
  modalHistory.style.display = "none";
  btnShowModalHistory.removeEventListener("click", showModalHistory);
}
const showModalHistory = (sale) => {
  modalHistory.style.display = 'block';
  console.log(sale);
}

function showProductsSale(products, sale) {
  console.log(products);
  while (listSale.firstChild) {
    listSale.removeChild(listSale.firstChild);
  }
  products.forEach((product) => {
    createProductsSaleHTML(product, sale);
  });
}

const showModal = (products, sale) => {
  btnShowModalPay.addEventListener("click", () => showModalPay(sale));
  btnShowModalHistory.addEventListener("click", () => showModalHistory(sale));

  modal.style.display = "block";
  document.getElementById("divButtonPay").style.display =
    Number(sale.totalDeVenta) != Number(sale.cantidadPagada) ? "flex" : "none";
  console.log(JSON.parse(sale.pedido));
  let productsFilter = [];

  let amount = 0;
  products.forEach((product) => {
    JSON.parse(sale.pedido).forEach((s) => {
      if (product.idProducto === s.idProducto) {
        productsFilter = [...productsFilter, product];
        amount += s.cantidadAVender;
      }
    });
  });

  document.querySelector("#spanName").textContent = dataClients.find(
    (client) => client.idCliente === sale.idCliente
  ).nombreCompleto;
  document.querySelector("#spanYear").textContent =
    sale.fechaVenta.split(" ")[0];
  document.querySelector("#SpanTotalSale").textContent =
    "$" + sale.totalDeVenta;
  document.querySelector("#SpanAmountSold").textContent = amount;
  document.querySelector("#spanAmountPaid").textContent =
    "$" + sale.cantidadPagada;

  let text;
  switch (sale.formaPago) {
    case "1":
      text = "Al contado";
      break;
    case "2":
      text = "Pagos diarios";
      break;
    case "3":
      text = "Pagos semanales";
      break;
    case "4":
      text = "Pagos mensuales";
      break;
    default:
      break;
  }
  document.querySelector("#spanWayToPay").textContent = text;
  document.querySelector("#spanTotalPayments").textContent = sale.cantidadPagos;
  document.querySelector("#spanPaymentsMade").textContent =
    sale.pagosRealizados;

  showProductsSale(productsFilter, sale);
};
const closeModal = () => {
  modal.style.display = "none";
};

const createClientOptionHTML = (client) => {
  const option = document.createElement("option");
  option.value = client.idCliente;
  option.textContent = client.nombreCompleto;
  selectClient.appendChild(option);
};

const showClientsOption = (clients) => {
  clients.forEach((client) => {
    createClientOptionHTML(client);
  });
};
// HTML de la venta a mostrar
const createSaleHTML = (sale) => {
  const li = document.createElement("LI");
  li.classList.add("sale__item");

  const nameClient = document.createElement("P");
  nameClient.textContent = "Cliente: ";

  const nameClientSpan = document.createElement("SPAN");
  nameClientSpan.textContent = dataClients.find(
    (client) => client.idCliente === sale.idCliente
  ).nombreCompleto;

  const year = document.createElement("P");
  year.textContent = "Fecha de venta: ";

  const yearSpan = document.createElement("SPAN");
  yearSpan.textContent = sale.fechaVenta.split(" ")[0];

  const price = document.createElement("P");
  price.textContent = "Total de la venta: ";

  const priceSpan = document.createElement("SPAN");
  priceSpan.textContent = "$" + sale.totalDeVenta;

  const totalPayments = document.createElement("P");
  totalPayments.textContent = "Total de pagos: ";

  const totalPaymentsSpan = document.createElement("SPAN");
  totalPaymentsSpan.textContent = sale.cantidadPagos;

  const paymentsMate = document.createElement("P");
  paymentsMate.textContent = "Pagos realizados: ";

  const paymentsMateSpan = document.createElement("SPAN");
  paymentsMateSpan.textContent = sale.pagosRealizados;

  nameClient.appendChild(nameClientSpan);
  year.appendChild(yearSpan);
  price.appendChild(priceSpan);
  totalPayments.appendChild(totalPaymentsSpan);
  paymentsMate.appendChild(paymentsMateSpan);

  const containerActions = document.createElement("DIV");
  containerActions.classList.add("sale__actions");

  const viewSaleImg = document.createElement("IMG");
  viewSaleImg.src = "../images/view.png";
  viewSaleImg.alt = "Ver catalogo";
  viewSaleImg.addEventListener("click", () => showModal(dataProducts, sale));

  const editSale = document.createElement("A");
  editSale.href = "./actualizarVenta.php?id=" + sale.idVenta;
  const editSaleImg = document.createElement("IMG");
  editSaleImg.src = "../images/edit.png";
  editSaleImg.alt = "Editar venta";

  editSale.appendChild(editSaleImg);

  //   editSaleImg.addEventListener("click", () => showModal(true, catalogo));

  // const deleteSaleImg = document.createElement("IMG");
  // deleteSaleImg.src = "../images/delete.png";
  // deleteSaleImg.alt = "Eliminar venta";
  //   deleteSaleImg.addEventListener("click", () => deleteCatalogo(idCatalogo));

  containerActions.appendChild(viewSaleImg);
  containerActions.appendChild(editSale);
  // containerActions.appendChild(deleteSaleImg);

  li.appendChild(nameClient);
  li.appendChild(year);
  li.appendChild(price);
  li.appendChild(totalPayments);
  li.appendChild(paymentsMate);
  li.appendChild(containerActions);

  salesContainer.appendChild(li);
};

// muestra todas las ventas

const showSales = (sales, msgEmpty = "No hay ventas realizadas") => {
  while (salesContainer.firstChild) {
    salesContainer.removeChild(salesContainer.firstChild);
  }
  if (sales.length === 0) {
    const p = document.createElement("p");
    p.classList.add("sales__empty");
    p.textContent = msgEmpty;
    salesContainer.appendChild(p);
  } else {
    sales.forEach((sale) => {
      createSaleHTML(sale);
    });
  }
};

//optener los datos de la api
function fetchDataFromAPI(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("Error en la solicitud de la API");
    }
    return response.json();
  });
}
//optener y asignar lso valores
const getData = () => {
  const urlClientes = "http://sistema.test/api/clientes.php";
  const urlProducts = "http://sistema.test/api/productos.php";
  const urlVentas = "http://sistema.test/api/ventas.php";
  const urlCatalogo = "http://sistema.test/api/catalogo.php";

  const promises = [
    fetchDataFromAPI(urlClientes),
    fetchDataFromAPI(urlVentas),
    fetchDataFromAPI(urlProducts),
    fetchDataFromAPI(urlCatalogo),
  ];

  Promise.all(promises)
    .then((results) => {
      dataClients = results[0];
      dataSales = results[1];
      dataProducts = results[2];
      dataCatalogos = results[3];

      showSales(dataSales);
      showClientsOption(dataClients);
    })
    .catch((error) => {
      // Manejar errores si alguna de las promesas falla
      console.error("Error al obtener datos:", error);
    });
};

document.addEventListener("DOMContentLoaded", async () => {
  getData();
});

selectClient.addEventListener("change", (e) => {
  if (e.target.value === "") {
    showSales(dataSales);
  } else {
    const salesFilter = dataSales.filter(
      (sale) => sale.idCliente === e.target.value
    );

    showSales(salesFilter, "No hay ventas registradas para este cliente");
  }
});
btnCloseModal.addEventListener("click", closeModal);
btnCloseModalPay.addEventListener("click", closeModalPay);
formPay.addEventListener("submit", onSubmit);
btnCloseModalHistory.addEventListener("click", closeModalHistory)