const btnCloseModal = document.getElementById('closeModal');
const modal = document.getElementById('modal');

const showModal = (client) => {
  modal.style.display = 'flex';
  document.getElementById('spanNameClient').textContent = client.nombreCompleto;
  document.getElementById('spanYear').textContent = client.fechaAlta.split(' ')[0];
  document.getElementById('spanNumberPhone').textContent = client.telefono;
}

function getBirthdayThisYear(birthday) {
    const today = moment();
    const birthdate = moment(birthday, 'YYYY-MM-DD');
    birthdate.year(today.year());
   
    return birthdate.format('YYYY-MM-DD');
  }

document.addEventListener('DOMContentLoaded', async function() {
    const response = await fetch('http://sistema.test/api/clientes.php');
    const result = await response.json();
    
    const events = result.map((client) => {
        return {
            title: client.nombreCompleto,
            start: getBirthdayThisYear(client.fechaNacimiento),
            client
        }
    });

    console.log(events)
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'es',
      events,
      validRange: {
        start: moment().startOf('year').format('YYYY-MM-DD'), // Desde el inicio del año actual (enero)
        end: moment().endOf('year').format('YYYY-MM-DD')      // Hasta el final del año actual (diciembre)
      },
        eventClick: function(info) {
          showModal(info.event.extendedProps.client);
        }
    });
    calendar.render();
  });

btnCloseModal.addEventListener('click', () => modal.style.display = 'none');