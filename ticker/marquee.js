(function() {

  window.expMarquee = function(element, getText, config) {
    (function playText() {
      var itemEl = makeItemEl(getText(), config);
      animateItem(element, itemEl, config, playText);
    })();
  }

  function makeItemEl(text, config) {
    var itemEl = document.createElement('div');

    itemEl.classList.add('item');
    itemEl.textContent = text;
    itemEl.style.fontFamily = config.font || 'Roboto';
    itemEl.style.color = config.fontColor || '#7e57c2';

    return itemEl;
  }

  function animateItem(parent, item, config, afterAnimate) {
    var itemLeft = parent.offsetWidth;
    var scrollSpeed = config.scrollSpeed === undefined ? 25 : config.scrollSpeed;
    var buffer = config.buffer === undefined ? 50 : config.buffer;
    var pixelsPerMillisecond = scrollSpeed / 100;
    var buffer = parent.offsetWidth * buffer / 100; // buffer in pixels to leave after the text we're scrolling

    function updateItemLeft() {
      item.style.transform = 'translateX(' + itemLeft + 'px)';
    }

    function itemPassedRightEdge() {
      return itemLeft < parent.offsetWidth - item.offsetWidth - buffer;
    }

    function itemPassedLeftEdge() {
      return itemLeft < -1 * item.offsetWidth;
    }

    updateItemLeft();
    parent.appendChild(item);

    var start = new Date();
    var callbackCalled = false;

    (function updatePosition() {
      var timeElapsed = new Date() - start;
      itemLeft = parent.offsetWidth - pixelsPerMillisecond * timeElapsed;
      updateItemLeft();

      // if this element has scrolled fully onto screen next element can begin scrolling in from right
      if (!callbackCalled && itemPassedRightEdge()) {
        afterAnimate();
        callbackCalled = true;
      }

      if (itemPassedLeftEdge()) {
        parent.removeChild(item);
      } else {
        requestAnimationFrame(updatePosition);
      }
    })();
  }
})();
