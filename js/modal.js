const btnShowModal = document.getElementById('showModal');
const btnCloseModal = document.getElementById('closeModal');
const modal = document.getElementById('modal');

btnShowModal.addEventListener('click', () => {
    modal.style.display = 'flex';
})
btnCloseModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'none';
})

