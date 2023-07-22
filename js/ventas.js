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
const listHistory = document.getElementById("listHistory");
const btnExportSales = document.getElementById("btnExportSales");

let dataSales = [];
let dataProducts = [];
let dataCatalogos = [];
let dataClients = [];
let dataPagos = [];

let isUpdatingPayment = false;

let idSale = null;
let idPayment = null;

// se encarga de agregar y actualizar los pagos
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
  if (isUpdatingPayment) {
    formData.append("idPayment", idPayment);
  }

  const response = await fetch(
    `http://sistema.test/api/${
      isUpdatingPayment ? "updatePago.php" : "pagos.php"
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
// cierra el modal de pagos
const closeModalPay = () => {
  modalPay.style.display = "none";
  btnCloseModal.removeEventListener("click", showModal);
  idSale = null;
  isUpdatingPayment = false;
  idPayment = null;
};
// muestra el modal de pagos
const showModalPay = (sale) => {
  console.log(sale);
  modalPay.style.display = "flex";

  if (isUpdatingPayment) {
    inputAmountPay.value = sale.cantidadPago;
  } else {
    inputAmountPay.value =
      (sale.totalDeVenta - sale.cantidadPagada) /
      (sale.cantidadPagos - sale.pagosRealizados);
  }

  idSale = sale.idVenta;

  formPay.querySelector(".form__submit").value = isUpdatingPayment
    ? "Actualizar pago"
    : "Registrar Pago";
  formPay.querySelector(".modal__title").textContent = isUpdatingPayment
    ? "Actualizar pago"
    : "Registrar Pago";
};
// elimina un pago
const deletePayment = () => {
  Swal.fire({
    title: "Estas seguro?",
    text: "El pago sera eliminado completamente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "si, Eliminar pago!",
    cancelButtonText: "cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log(idPayment);
      const response = await fetch(`http://sistema.test/api/deletePago.php`, {
        method: "POST",
        body: JSON.stringify({ idPayment: idPayment }),
      });
      const result = await response.json();

      if (result.code === 200) {
        Swal.fire({
          icon: "success",
          title: "Todo listo!",
          text: result.msg,
        }).then(() => {
          window.location.reload();
        });
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
// muestra el html de los productos vendidos
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

// crea el html de los pagos
const createPaymentsHTML = (payment, sale) => {
  const li = document.createElement("LI");
  li.classList.add("history__item");

  const year = document.createElement("P");
  year.textContent = "Fecha de. pago: ";
  const yearSpan = document.createElement("SPAN");
  yearSpan.textContent = payment.fechaDelPago.split(" ")[0];

  const amount = document.createElement("P");
  amount.textContent = "Cantidad: ";
  const amountSpan = document.createElement("SPAN");
  amountSpan.textContent = "$" + payment.cantidadPago;

  const containerButtons = document.createElement("DIV");
  containerButtons.classList.add("history__buttons");

  const edit = document.createElement("IMG");
  edit.src = "../images/edit.png";
  edit.alt = "Editar pago";
  edit.addEventListener("click", () => {
    idPayment = payment.idPago;
    closeModalHistory();
    showModalPay(payment);
  });

  const remove = document.createElement("IMG");
  remove.src = "../images/delete.png";
  remove.alt = "Eliminar pago";
  remove.addEventListener("click", () => {
    idPayment = payment.idPago;
    deletePayment();
  });

  year.appendChild(yearSpan);
  amount.appendChild(amountSpan);

  li.appendChild(year);
  li.appendChild(amount);

  if (
    dataClients.find((client) => client.idCliente === sale.idCliente).activo !==
    "0"
  ) {
    containerButtons.appendChild(edit);
    containerButtons.appendChild(remove);
    li.appendChild(containerButtons);
  }

  listHistory.appendChild(li);
};

// muestra los pagos
const showPayments = (payments, sale) => {
  while (listHistory.firstChild) {
    listHistory.removeChild(listHistory.firstChild);
  }

  payments.forEach((payment) => {
    createPaymentsHTML(payment, sale);
  });
};
// cierra el modal del historial de pagos
const closeModalHistory = () => {
  modalHistory.style.display = "none";
  btnShowModalHistory.removeEventListener("click", showModalHistory);
};
// muestra el modal del historial de pagos
const showModalHistory = (sale) => {
  modalHistory.style.display = "block";
  showPayments(
    dataPagos.filter((p) => p.idVenta === sale.idVenta),
    sale
  );
  isUpdatingPayment = true;
};
// muestra los productos vendidos
function showProductsSale(products, sale) {
  console.log(products);
  while (listSale.firstChild) {
    listSale.removeChild(listSale.firstChild);
  }
  products.forEach((product) => {
    createProductsSaleHTML(product, sale);
  });
}
// muestra el modal de informacion de la venta
const showModal = (products, sale) => {
  modal.style.display = "block";

  btnShowModalPay.addEventListener("click", () => showModalPay(sale));
  btnShowModalHistory.addEventListener("click", () => showModalHistory(sale));

  if (
    dataClients.find((client) => client.idCliente === sale.idCliente).activo ===
    "0"
  ) {
    document.getElementById("divButtonPay").style.display = "none";
  } else {
    document.getElementById("divButtonPay").style.display =
      Number(sale.totalDeVenta) > Number(sale.cantidadPagada) ? "flex" : "none";
  }
  document.getElementById("divButtonHistory").style.display =
    sale.pagosRealizados === "0" ? "none" : "block";
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
// cierra el modal de la informacion de la venta
const closeModal = () => {
  modal.style.display = "none";
};
// crea el html de los clientes
const createClientOptionHTML = (client) => {
  const option = document.createElement("option");
  option.value = client.idCliente;
  option.textContent = client.nombreCompleto;
  selectClient.appendChild(option);
};
// muestra los clientes en el select
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
  if (
    dataClients.find((client) => client.idCliente === sale.idCliente).activo ===
    "1"
  ) {
    containerActions.appendChild(editSale);
  }
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
  const urlPagos = "http://sistema.test/api/pagos.php";

  const promises = [
    fetchDataFromAPI(urlClientes),
    fetchDataFromAPI(urlVentas),
    fetchDataFromAPI(urlProducts),
    fetchDataFromAPI(urlCatalogo),
    fetchDataFromAPI(urlPagos),
  ];

  Promise.all(promises)
    .then((results) => {
      dataClients = results[0];
      dataSales = results[1];
      dataProducts = results[2];
      dataCatalogos = results[3];
      dataPagos = results[4];

      showSales(dataSales);
      showClientsOption(dataClients);
    })
    .catch((error) => {
      // Manejar errores si alguna de las promesas falla
      console.error("Error al obtener datos:", error);
    });
};

function generatePDF() {
  // Datos que se insertarán en el archivo PDF
  const todaySales = dataSales.filter((sale) => {
    let date = sale.fechaVenta.split(" ")[0];
    date = date.split("-").join('/');

    if (
      new Date(date).toLocaleDateString() ===
      new Date().toLocaleDateString()
    ) {
      return sale;
    } 
  });

  const todaySalesArray = todaySales.map(sale => {
    const nameClient = dataClients.find(client => client.idCliente === sale.idCliente).nombreCompleto;
    console.log(sale)
    return [sale.fechaVenta, nameClient, sale.totalDeVenta]
  })

  // Crear un nuevo elemento div para el contenido que deseas convertir a PDF
  const content = document.createElement('div');

  // Título del documento
  const title = document.createElement('h1');
  title.textContent = "Reporte del: " + new Date().toLocaleDateString();
  title.classList.add('title-pdf');
  content.appendChild(title);

  // Tabla con los datos
  const table = document.createElement('table');
  table.classList.add('table-pdf');

  const headerRow = document.createElement('tr');
  ["Fecha y hora", "Nombre del cliente", "Cantidad total de la venta"].forEach(columnName => {
    const th = document.createElement('th');
    th.textContent = columnName;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  todaySalesArray.forEach(sale => {
    const row = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');

    td1.textContent = sale[0];
    td2.textContent = sale[1];
    td3.textContent = '$' + sale[2];

    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    
    table.appendChild(row);
  });

  const empty = document.createElement('p');
  empty.classList.add('empty-pdf')
  empty.textContent = 'No hay ventas registradas';

  if(todaySalesArray.length === 0) {
    content.appendChild(empty);
  } else {
    content.appendChild(table);
  }


  // Opciones para la generación del PDF
  const options = {
    margin: 10,
    filename: 'ventas del dia.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Generar el archivo PDF
  html2pdf().from(content).set(options).save();
}

function exportToExcel() {
  const todaySales = dataSales.filter((sale) => {
    let date = sale.fechaVenta.split(" ")[0];
    date = date.split("-").join('/');

    if (
      new Date(date).toLocaleDateString() ===
      new Date().toLocaleDateString()
    ) {
      return sale;
    } 
  });

  const todaySalesArray = todaySales.map(sale => {
    const nameClient = dataClients.find(client => client.idCliente === sale.idCliente).nombreCompleto;
    console.log(sale)
    return [sale.fechaVenta, nameClient, sale.totalDeVenta]
  })

 

 

  const data = [
    ["Reporte del: ", new Date().toLocaleDateString()],
    ["Fecha", "Nombre del cliente", "Cantidad total de la venta"],
    ...todaySalesArray
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ventas del dia");

  // Crear un Blob con el contenido del archivo Excel
  const wbout = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([wbout], {
    type: "application/octet-stream",
  });

  // Crear un enlace de descarga y simular el clic para descargar el archivo
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Ventas del dia.xlsx";
  document.body.appendChild(a);
  a.click();

  // Limpiar recursos después de la descarga
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

btnExportSales.addEventListener("click", generatePDF);

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
btnCloseModalHistory.addEventListener("click", closeModalHistory);
