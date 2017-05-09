'use strict';

var itemPool;

function textForItem(item) {
  return item.text;
}

function load () {
  if (exp.app.config.feed) {
    return exp.getFeed(exp.app.config.feed.uuid)
      .then(function(feed) {
        itemPool = new ItemPool(feed);

        return itemPool.initialFetch;
      });
  } else {
    throw 'No feed present';
  }
}

function play () {
  expMarquee(document.getElementById('marquee'), function() {
    return textForItem(itemPool.next());
  }, exp.app.config);

  document.getElementsByTagName('body')[0].style.backgroundColor = exp.app.config.backgroundColor || '#ffffff';
}


function unload () {
  // clean up any mess we made
}
