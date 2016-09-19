'use strict';
/* global exp, transition, transitions, slides */

var done = function() {};
var running = false;

function prepare (i) {
  var isFirst = !running;
  running = true;

  if (slides.length === 0) return;
  i = i % slides.length;

  if (slides[i].promise) return;
  else if (slides[i].next && slides[i].next.status === 'ready') return;

  var isLast = !exp.app.config.loop && i === slides.length - 1;

  var promise = slides[i].promise = exp.player.load(slides[i].options).then(function (app) {
    app.element.style.background = exp.app.config.backgroundColor || '#000000';
    slides[i].next = app;

    app.first = isFirst;
    app.last = isLast;

    app.element.setAttribute('transition', transition.name);
    transition.prepare(app);
  }).catch(function (error) {
    console.error('Error loading slide in slideshow', error);
    if (error && error.stack) console.debug(error.stack);
  }).then(function () {
    delete slides[i].promise;
  });

  return promise;
}

function digest (i, j) {
  if (slides.length === 0) return;
  if (!exp.app.config.loop && j >= slides.length) return done();

  j = j % slides.length;

  if (!slides[j].next || slides[j].next.status !== 'ready') {
    prepare(j + 1);
    return setTimeout(digest.bind(null, i, j + 1), 1000);
  }

  slides[j].current = slides[j].next;
  slides[j].next = null;

  slides[j].current.play().catch(function (error) {
    console.error('Error playing slide in slideshow.', error);
    if (error && error.stack) console.debug(error.stack);
  }).then(digest.bind(null, j, j + 1));

  transition.execute(i !== null ? slides[i].current : null, slides[j].current);
  setTimeout(function() { [j + 1, j + 2, j + 3, j + 4, j + 5].map(prepare); }, 2000);
}

function load () {

  // If loop wasn't explicitly set. Infer from playback context.
  if (exp.app.config.loop !== true && exp.app.config.loop !== false) {
    exp.app.config.loop = !exp.app.context.once;
  }

  exp.app.context.once = true;


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

  // load 5 and wait on the first one
  return [0, 1, 2, 3, 4].map(prepare)[0];
}

function play () {
  digest(null, 0);
  return new Promise(function (resolve) { done = resolve; });
}
