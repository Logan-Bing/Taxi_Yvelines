const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const navLink = document.querySelector('.nav-link')

if (burger && nav) {
    burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    burger.classList.toggle('active')
  });
}
if (navLink && nav && burger) {
  navLink.addEventListener('click', () => {
    nav.classList.remove('active');
    document.body.classList.remove('no-scroll');
    burger.classList.remove('active')
  })
}
