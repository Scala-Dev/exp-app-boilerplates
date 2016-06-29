/*jshint -W084 */
/* globals exp, moment, Ember, Masonry */
'use strict';


var App, masonry;
var re = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

function sortedIndex(array, value) {
  var low = 0,
    high = array.length;

  while (low < high) {
    var mid = (low + high) >>> 1;
    if (array[mid].timestamp > value) low = mid + 1;
    else high = mid;
  }

  return low;
}

function firstUrl(urls) {
  return urls && urls.length > 0 ? urls[0].url : null;
}

function youtubeUrl(urls) {
  var url = firstUrl(urls);
  var matches = re.exec(url);
  var id = matches && matches.length > 1 ? matches[1] : null;

  return id ? 'https://www.youtube.com/embed/' + id + '?enablejsapi=1&iv_load_policy=3&modestbranding=1&showinfo=0&controls=0&loop=1&playlist=' + id : null;
}


// format feed data
function format(item) {
  var data = {};
  data.id = item.id;
  data.text = item.text;
  data.timestamp = item.date;

  // set text style class
  data.textClass = 'caption';

  // format the date
  if (item.date) data.date = moment(item.date).fromNow();

  // get a single asset url
  if (data.src = youtubeUrl(item.videos)) {
    data.isYoutube = true;
  } else if (data.src = firstUrl(item.videos)) {
    data.isVideo = true;
  } else if (data.src = firstUrl(item.images)) {
    data.isImage = true;
  } else {
    data.textClass = 'quote';
  }

  return data;
}


// refresh masonry layout after images and videos have loaded
function layout() {
  if (!masonry) {
    masonry = new Masonry('#grid', {
      itemSelector: '.grid-item',
      percentPosition: true,
      columnWidth: '.grid-sizer'
    });
  }

  masonry.reloadItems();
  masonry.layout();

  Ember.$('video, img').one('load canplaythrough error', function() {
    masonry.reloadItems();
    masonry.layout();
  });
}


function load() {
  var config = exp.app.config;
  var interval = parseInt(config.poll || 600, 10);

  // set body colors
  var body = document.querySelector('body');
  body.style.backgroundColor = config.primaryColor;
  body.style.color = config.secondaryColor;
  body.style.fill = config.secondaryColor;

  App = Ember.Application.create({});

  App.ApplicationRoute = Ember.Route.extend({

    items: Ember.A([]),

    getFeed: function() {
      var route = this;
      if (route.get('feed')) return;

      // get the feed query
      return exp.getFeed(config.feed.uuid).then(function(feed) {
        route.set('feed', feed);
      });
    },

    getLogo: function() {
      if (!config.logo || !config.logo.uuid || config.logo.url) return;

      // get the logo details
      return exp.getContent(config.logo.uuid).then(function(content) {
        config.logo.url = content.getUrl();
      });
    },

    beforeModel: function() {
      return Promise.all([this.getFeed(), this.getLogo()]);
    },

    model: function() {
      var route = this;

      // get the feed data
      return route.get('feed').getData().then(function(data) {
        return data.items;
      });
    },

    renderItems: function(items) {
      var existingItems = this.items;

      // add new items
      var add = [];
      items.forEach(function(item) {
        // skip existing items
        for (var i = 0; i < existingItems.length; i++) {
          if (existingItems[i].id === item.id) return;
        }

        add.push(format(item));
      });

      if (add.length > 0) {
        add.forEach(function(toAdd) {
          var index = sortedIndex(existingItems, toAdd.timestamp);
          existingItems.insertAt(index, toAdd);
        });
      }

      var remove = [];
      existingItems.forEach(function(existingItem) {
        // update old items
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (existingItem.id === item.id) {
            if (item.text) Ember.set(existingItem, 'text', item.text);
            if (item.date) Ember.set(existingItem, 'date', moment(item.date).fromNow());
            return;
          }
        }

        remove.push(existingItem);
      });

      // remove old items
      if (remove.length > 0) {
        remove.forEach(function(toRemove) {
          for (var i = 0; i < existingItems.length; i++) {
            if (existingItems[i].id === toRemove.id)
              return existingItems.removeAt(i);
          }
        });
      }

    },

    setupController(controller, model) {
      var route = this;
      var feed = route.get('feed');

      controller.set('config', config);
      controller.set('items', route.items);

      controller.set('isFacebook', 'scala:feed:facebook' === feed.document.subtype);
      controller.set('isInstagram', 'scala:feed:instagram' === feed.document.subtype);
      controller.set('isTwitter', 'scala:feed:twitter' === feed.document.subtype);
      controller.set('isRSS', 'scala:feed:rss' === feed.document.subtype);

      route.renderItems(model, feed.document.maxResults);

      // configure polling
      route.schedule(function() {
        console.log('refreshing feed data');

        route.model().then(function(model) {
          route.renderItems(model, feed.document.maxResults);

          Ember.run.scheduleOnce('render', this, layout);
        });
      });
    },

    schedule: function(f) {
      return Ember.run.later(this, function() {
        f.apply(this);
        this.set('timer', this.schedule(f));
      }, interval * 1000);
    },

    actions: {
      didTransition: function() {
        Ember.run.scheduleOnce('afterRender', this, layout);
      }
    }

  });

}
