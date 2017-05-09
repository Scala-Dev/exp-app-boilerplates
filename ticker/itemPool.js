/*
 * Class responsible for maintaining the pool of items scheduled to be shown from
 * a given feed. Gets data from the feed on a regular interval and updates the items array.
 */
(function() {
  window.ItemPool = function ItemPool(feed) {
    this.feed = feed;
    this.items = [];

    this.initialFetch = this.getNextItems();
    this.index = 0;
  };

  ItemPool.prototype.getNextItems = function() {
    var that = this;

    return this.feed.getData()
      .then(function(result) {
        that.nextItems = result.items;
      });
  }

  ItemPool.prototype.next = function() {
    if (this.items.length === 0 && this.nextItems.length === 0) {
      throw 'Cant get next item from empty pool';
    }

    if (this.index === 0 && this.nextItems) {
      this.items = this.nextItems;
      this.nextItems = undefined;
      this.getNextItems();
    }

    var item = this.items[this.index];

    this.index = this.index === this.items.length - 1 ?
      0 :
      this.index + 1;

    return item;
  }
})(window);
