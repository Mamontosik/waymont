(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var toggle = document.querySelector('.mobile-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });
    document.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Открыть меню');
      });
    });
  }

  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('reveal--visible'); });
  }

  var triggers = document.querySelectorAll('.js-lightbox-trigger');
  if (triggers.length) {
    var lightboxEl = null;

    function openLightbox(src, alt, trigger) {
      var lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Увеличенный скриншот: ' + (alt || ''));
      lb.innerHTML =
        '<button type="button" class="lightbox__close" aria-label="Закрыть">&times;</button>' +
        '<img class="lightbox__img" src="' + src + '" alt="' + (alt || '') + '">';
      document.body.appendChild(lb);
      document.body.style.overflow = 'hidden';

      var focusable = lb.querySelectorAll('button');
      var firstEl = focusable[0];
      var lastEl = focusable[focusable.length - 1];

      requestAnimationFrame(function () {
        lb.classList.add('lightbox--open');
        if (firstEl) firstEl.focus();
      });
      lightboxEl = lb;
      lb._trigger = trigger;

      lb.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          } else if (!e.shiftKey && document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      });

      lb.addEventListener('click', function (e) {
        if (e.target === lb || e.target.classList.contains('lightbox__close')) {
          closeLightbox();
        }
      });
      document.addEventListener('keydown', onKeyDown);
    }

    function closeLightbox() {
      if (!lightboxEl) return;
      var trigger = lightboxEl._trigger;
      lightboxEl.classList.remove('lightbox--open');
      document.body.style.overflow = '';
      setTimeout(function () {
        if (lightboxEl && lightboxEl.parentNode) {
          lightboxEl.parentNode.removeChild(lightboxEl);
        }
        if (trigger) trigger.focus();
        lightboxEl = null;
      }, 300);
      document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') closeLightbox();
    }

    triggers.forEach(function (el) {
      var open = function () {
        var img = el.matches('img') ? el : el.querySelector('img');
        if (img) openLightbox(img.currentSrc || img.src, img.alt || '', el);
      };
      el.addEventListener('click', open);
      if (!el.matches('button')) {
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
          }
        });
      }
    });
  }

})();
