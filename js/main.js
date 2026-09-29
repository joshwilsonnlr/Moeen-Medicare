/* Lumina Physiotherapy — Interactions */

document.addEventListener('DOMContentLoaded', () => {
  // Sticky nav
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Scroll reveal — skip already-visible critical sections
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => {
    // Immediately show elements already in (or near) the viewport on load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      el.classList.add('visible');
    } else {
      observer.observe(el);
    }
  });

  // Appointment form (works with Formspree)
  const form = document.getElementById('appointment-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#c45c5c';
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;

      const btn = form.querySelector('.form-submit-btn');
      const originalText = btn ? btn.textContent : '';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
      }

      try {
        const action = form.getAttribute('action');
        // If still using placeholder, show success for demo
        if (!action || action.includes('YOUR_FORM_ID')) {
          form.style.display = 'none';
          const success = document.getElementById('form-success');
          if (success) {
            success.hidden = false;
            success.classList.add('visible');
          }
          return;
        }

        const response = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.style.display = 'none';
          const success = document.getElementById('form-success');
          if (success) {
            success.hidden = false;
            success.classList.add('visible');
          }
        } else {
          alert('Something went wrong. Please try again or call us directly.');
          if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
          }
        }
      } catch (err) {
        alert('Something went wrong. Please try again or call us directly.');
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
