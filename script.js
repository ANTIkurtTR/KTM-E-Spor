console.log("KTM E-Spor Responsive v1.0");

// Hamburger menü kontrolü
const toggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  toggle.classList.toggle('open');
});

// Navbar scroll efekti
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if(window.scrollY > 50){
    nav.style.background = '#000';
    nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
  } else {
    nav.style.background = '#111';
    nav.style.boxShadow = 'none';
  }
});
