const burger = document.querySelector('.header_burger')
const header = document.querySelector('.header')
const menu = document.querySelector('.header_menu_list')

burger.addEventListener('click', e =>{
    burger.classList.toggle('active')
    header.classList.toggle('active')
    menu.classList.toggle('active')

});