/* ==========================================================================
   WayMont — плавное раскрытие FAQ в секции «Инструкция».

   Нужен только браузерам без поддержки ::details-content (см. css/instructions.css,
   там раскрытие анимируется через grid-template-rows).
   Там, где CSS умеет анимировать раскрытие сам, скрипт ничего не делает.
   При отключённом JavaScript аккордеон продолжает работать как обычный <details>.
   ========================================================================== */
(function () {
  'use strict';

  var items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  // Современные браузеры анимируют раскрытие чистым CSS — вмешиваться не нужно.
  if (window.CSS && CSS.supports && CSS.supports('selector(::details-content)')) return;

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  items.forEach(function (item) {
    var body = item.querySelector('.faq__a');
    if (!body) return;

    item.addEventListener('toggle', function () {
      if (!item.open || reduce) return;

      var height = body.scrollHeight;
      body.style.overflow = 'hidden';

      var anim = body.animate(
        [
          { height: '0px', opacity: 0 },
          { height: height + 'px', opacity: 1 }
        ],
        { duration: 300, easing: 'ease' }
      );

      anim.onfinish = function () {
        body.style.overflow = '';
      };
    });
  });
})();
