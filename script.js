// The page and FAQ also work without JavaScript.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
const mobileLayout = window.matchMedia('(max-width: 650px)');

function closeMenu(returnFocus = false) {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
});

navigation.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link || !mobileLayout.matches) return;
  closeMenu();
  // Move keyboard focus to the chosen section before hiding the menu links.
  const destination = document.querySelector(link.getAttribute('href'));
  if (destination) {
    destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu(true);
  }
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.header-inner')) closeMenu();
});

mobileLayout.addEventListener('change', () => {
  closeMenu(mobileLayout.matches && navigation.contains(document.activeElement));
});
document.querySelector('#year').textContent = new Date().getFullYear();
// Enable the collapsible navigation only after its handlers are attached.
document.documentElement.classList.add('js');

// Only the public form endpoint in index.html needs configuration; no API secret.
// Native POST lets Formspree handle delivery, spam challenges, and confirmation.
const contactForm = document.querySelector('#contact-form');
const contactSubmit = document.querySelector('#contact-submit');
const formStatus = document.querySelector('#form-status');
const endpoint = contactForm.getAttribute('action');
const formConfigured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint);
let submitting = false;

function readyContactForm() {
  submitting = false;
  contactSubmit.disabled = !formConfigured;
  contactForm.removeAttribute('aria-busy');
  formStatus.textContent = formConfigured
    ? ''
    : 'Obrazac je u pripremi. Slanje trenutačno nije dostupno.';
}

contactForm.addEventListener('submit', (event) => {
  if (!formConfigured || submitting) {
    event.preventDefault();
    return;
  }
  // Browser validation runs before this event. Keep fields enabled for the POST.
  submitting = true;
  contactSubmit.disabled = true;
  contactForm.setAttribute('aria-busy', 'true');
  formStatus.textContent = 'Otvaramo potvrdu slanja…';
});

// Restore the button when returning from Formspree with the browser Back button.
window.addEventListener('pageshow', readyContactForm);
readyContactForm();
