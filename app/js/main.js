const mySwiper = new Swiper('.swiper-container', {
  loop: true,
  autoplay: 5000,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
})

const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__menu');
const body = document.querySelector('body');
const links = menu.querySelectorAll('.header__link');
const previewScroll = document.querySelector('.preview__scroll');

previewScroll.addEventListener('click', (event) => {
  document.getElementById('about').scrollIntoView({
    behavior: 'smooth'
  });

});

const toggleMenu = () => {
  burger.classList.toggle('active');
  menu.classList.toggle('visible');
  body.classList.toggle('lock');
};

burger.addEventListener('click', toggleMenu);

const scrollTo = (event) => {
  event.preventDefault();

  const id = event.target.getAttribute('href').slice(1);
  document.getElementById(id).scrollIntoView({
    behavior: 'smooth'
  });

  if (window.innerWidth <= 768 && menu.classList.contains('visible')) {
    toggleMenu();
  }
};

links.forEach((link) => {
  link.addEventListener('click', scrollTo);
});


const mixer = mixitup('.media__images');