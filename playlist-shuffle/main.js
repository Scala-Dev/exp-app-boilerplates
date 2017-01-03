'use strict';
/* global exp, transition, transitions, slides */

var done = function() {};
var running = false;

function prepare (i) {
  var isFirst = !running;
  running = true;

  if (slides.length === 0) return;
  i = i % slides.length;

  var slide = slides[i];

  if (slide.promise) return;
  else if (slide.next && slide.next.status === 'ready') return;

  var isLast = !exp.app.config.loop && i === slides.length - 1;

  var promise = slide.promise = exp.player.load(slide.options).then(function (app) {
    app.element.style.background = exp.app.config.backgroundColor || '#000000';
    slide.next = app;

    app.first = isFirst;
    app.last = isLast;

    app.element.setAttribute('transition', transition.name);
    transition.prepare(app);
  }).catch(function (error) {
    console.error('Error loading slide in playlist', error);
    if (error && error.stack) console.debug(error.stack);
  }).then(function () {
    delete slide.promise;
  });

  // if we're at the last element and need more, shuffle more
  if (exp.app.config.loop && i === slides.length - 1) {
    var shuffled = shufflePlaylistOfLength(configs.length, configs.slice(0));
    // remove next item if it matches the current slide
    if (shuffled[0] && shuffled[0].index === slide.index) shuffled.shift();

    shuffled.map(function(item) {
      slides.push(item);
    });
  }

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
    console.error('Error playing slide in playlist.', error);
    if (error && error.stack) console.debug(error.stack);
  }).then(digest.bind(null, j, j + 1));

  transition.execute(i !== null ? slides[i].current : null, slides[j].current);
  setTimeout(function() { [j + 1, j + 2, j + 3, j + 4, j + 5].map(prepare); }, 2000);
}

var DONT_REPEAT_FOR = 3;
var pick, discard;

function nextItem(pick, discard) {
  var result = pick.splice(Math.floor((Math.random() * pick.length)), 1)[0];
  discard.push(result);
  if (discard.length > DONT_REPEAT_FOR) pick.push(discard.shift());
  return result;
}

function shufflePlaylistOfLength(n, items) {
  console.log('shuffling ' + n + ' items');
  discard = [];
  pick = items;
  var playlist = [];
  for (var i = 0; i < n; i++) {
    playlist.push(nextItem(pick, discard));
  }
  return playlist;
}

function load () {
  
  if (!exp.app.config.slides) exp.app.config.slides = exp.app.manifest.config.slides;
  if (!exp.app.config.duration) exp.app.config.duration = exp.app.manifest.config.duration;
  if (!exp.app.config.transition) exp.app.config.transition = exp.app.manifest.config.transition;
  if (!exp.app.config.backgroundColor) exp.app.config.backgroundColor = exp.app.manifest.config.backgroundColor;
  if (!exp.app.config.viewportColor) exp.app.config.viewportColor = exp.app.manifest.config.viewportColor;
  if (!exp.app.config.repeatPercentage) exp.app.config.repeatPercentage = exp.app.manifest.config.repeatPercentage;

  // If loop wasn't explicitly set. Infer from playback context.
  if (exp.app.config.loop !== true && exp.app.config.loop !== false) {
    exp.app.config.loop = !exp.app.context.once;
  }

  exp.app.context.once = true;

  document.getElementById('viewport').style.background = exp.app.config.viewportColor || '#FFFFFF';

  window.configs = exp.app.config.slides.map(function (options, index) {
    options = options || {};
    options.container = document.getElementById('playlist');
    options.duration = options.duration || (parseFloat(exp.app.config.duration) * 1000);
    return { options: options, index: index };
  });

  // set repeat count based on percentage of length
  DONT_REPEAT_FOR = Math.round(configs.length * (exp.app.config.repeatPercentage / 100)) || 1;

  window.slides = shufflePlaylistOfLength(configs.length, configs.slice(0));

  if (slides.length === 0) {
    throw new Error('Playlist has no slides.');
  }
  
  if (slides.length === 1 && exp.app.config.loop) {
    slides.push({ options: window.slides[0].options, index: 0 });
  }

  var Transition =  transitions[exp.app.config.transition.name] || transitions.slide;
  window.transition = new Transition(exp.app);

  // load 5 and wait on the first one
  return [0, 1, 2, 3, 4].map(prepare)[0];
}

function play () {
  digest(null, 0);
  return new Promise(function (resolve) { done = resolve; });
}
