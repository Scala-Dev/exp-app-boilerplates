'use strict';
/* global exp, transition, transitions, slides */

function prepare (i) {
  if (slides.length === 0) return;
  i = i % slides.length;
  if (slides[i].promise) return;
  else if (slides[i].next && slides[i].next.status === 'ready') return;
  slides[i].promise = exp.player.load(slides[i].options).then(function (app) {
    app.element.setAttribute('transition', transition.name);
    app.element.style.background = exp.app.config.backgroundColor || '#000000';
    slides[i].next = app;
    transition.prepare(slides[i].next);
  }).catch(function (error) {
    console.error('Error loading slide in slideshow', error);
    if (error && error.stack) console.debug(error.stack);
  }).then(function () {
    delete slides[i].promise;
  });
}

function digest (i, j) {
  if (slides.length === 0) return;
  j = j % slides.length;
  if (!slides[j].next || slides[j].next.status !== 'ready') {
    prepare(j + 1);
    return setTimeout(digest.bind(null, i, j + 1), 1000);
  }
  slides[j].current = slides[j].next; slides[j].next = null;
  slides[j].current.play().catch(function (error) {
    console.error('Error playing slide in slideshow.', error);
    if (error && error.stack) console.debug(error.stack);
  }).then(digest.bind(null, j, j + 1));
  transition.execute(i !== null ? slides[i].current : null, slides[j].current);
  setTimeout(function() { [j + 1, j + 2, j + 3, j + 4, j + 5].map(prepare); }, 2000);
}

function load () {
  document.getElementById('viewport').style.background = exp.app.config.viewportColor || '#FFFFFF';
  window.slides = exp.app.config.slides.map(function (options) {
    options = options || {};
    options.container = document.getElementById('slideshow');
    options.duration = options.duration || (parseFloat(exp.app.config.duration) * 1000);
    return { options: options };
  });
  if (slides.length === 1) slides.push({ options: window.slides[0].options });
  if (slides.length === 0) return;
  var Transition =  transitions[(exp.app.config.transition || {}).name] || transitions.slide;
  window.transition = new Transition(exp.app);
  [0, 1, 2, 4, 5].map(prepare);
}

function play () { digest(null, 0); return new Promise(function () {}); }
