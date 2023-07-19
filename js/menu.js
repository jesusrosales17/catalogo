const iconMenu = document.getElementById('iconMenu');
const menu = document.getElementById('menu');

iconMenu.addEventListener('click', () => {
    menu.classList.toggle('active');

    if (menu.classList.contains('active')) {
        iconMenu.src = '../images/exit.png';
        iconMenu.classList.add('active');
    } else {
        iconMenu.src = '../images/menu.png';
        iconMenu.classList.remove('active');

    }
}); 
