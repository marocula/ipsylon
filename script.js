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
// Request JSON so Formspree responds without taking visitors off the website.
const contactForm = document.querySelector('#contact-form');
const contactSubmit = document.querySelector('#contact-submit');
const submitLabel = document.querySelector('#contact-submit-label');
const formStatus = document.querySelector('#form-status');
const contactFields = contactForm.querySelectorAll('input, textarea');
const endpoint = contactForm.getAttribute('action');
const formConfigured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint);
let submitting = false;

function setFormBusy(busy) {
  submitting = busy;
  contactSubmit.disabled = busy || !formConfigured;
  contactForm.setAttribute('aria-busy', String(busy));
  submitLabel.textContent = busy ? 'Slanje…' : 'Pošaljite upit';
  contactFields.forEach((field) => { field.readOnly = busy; });
}

function showFormStatus(message, state) {
  formStatus.textContent = message;
  formStatus.dataset.state = state;
}

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!formConfigured || submitting || !contactForm.reportValidity()) return;

  const body = new FormData(contactForm);
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  setFormBusy(true);
  showFormStatus('Vaš upit se šalje. Molimo pričekajte.', 'pending');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      const messages = {
        403: 'Slanje nije odobreno. Javite nam se e-poštom ili pokušajte kasnije.',
        422: 'Upit nije prihvaćen. Provjerite unesene podatke i pokušajte ponovno.',
        429: 'Slanje trenutačno nije dostupno. Pokušajte kasnije ili nam se javite e-poštom.',
      };
      showFormStatus(messages[response.status] || 'Upit nije prihvaćen. Pokušajte kasnije ili nam se javite e-poštom.', 'error');
      return;
    }

    // An HTML challenge page or unexpected response is not a confirmation.
    const result = await response.json();
    if (!result || typeof result !== 'object' || result.ok === false || result.errors?.length) {
      throw new Error('Unconfirmed submission');
    }

    contactForm.reset();
    showFormStatus('Hvala vam! Vaš upit je uspješno poslan. Javit ćemo vam se uskoro.', 'success');
  } catch {
    // A lost response does not prove the message failed. Never retry automatically.
    showFormStatus('Nismo uspjeli potvrditi slanje. Vaš tekst je sačuvan u obrascu. Provjerite vezu ili nam se javite e-poštom.', 'error');
  } finally {
    window.clearTimeout(timeout);
    setFormBusy(false);
    formStatus.focus({ preventScroll: true });
  }
});

setFormBusy(false);
showFormStatus(formConfigured ? '' : 'Obrazac je u pripremi. Slanje trenutačno nije dostupno.', 'pending');
