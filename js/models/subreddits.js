var defaultSubreddits = [
  'aww',
  'ArchitecturePorn',
  'foodporn',
  'funny',
  'sushi',
  'videos'
];


EmberReddit.Subreddit = Ember.Object.extend({
  loadedLinks: false,

  title: function() {
    return "/r/" + this.get('id');
  }.property('id'),

  /*
    Load the links associated with this subreddit.

    It returns a promise that will resolve to be the list of links from reddit. A special case is that
    if we've already loaded the links, we resolve to that right away rather than loading them a second
    time.
  */
  loadLinks: function() {
    var subreddit = this;
    return Em.Deferred.promise(function (p) {

      if (subreddit.get('loadedLinks')) {
        // We've already loaded the links, let's return them!
        p.resolve(subreddit.get('links'));
      } else {

        // If we haven't loaded the links, load them via JSON
        p.resolve($.getJSON("http://www.reddit.com/r/" + subreddit.get('id') + "/.json?jsonp=?").then(function(response) {
          var links = Em.A();
          response.data.children.forEach(function (child) {
            child.data.subreddit = subreddit;
            links.pushObject(EmberReddit.Link.create(child.data));
          });
          subreddit.setProperties({links: links, loadedLinks: true});
          return links;
        }));
      }
    });
  },

  findLinkById: function(id) {
    return this.loadLinks().then(function (links) {
      return links.findProperty('id', id);
    });
  }

});

/*
   Note: `reopenClass` sounds scary but it's pretty simple. We're just defining class level methods
   instead of instance methods. That way we can say `EmberReddit.Subreddit.list()` to get a list of
   subreddits.
*/
EmberReddit.Subreddit.reopenClass({

  /*
    This class method returns a list of all our subreddits.
    We store them in a class variable
    so they will only be created and referenced once.
  */
  list: function(id) {
    // If we've already loaded the list, return it
    if (this._list) { return this._list; }

    var list = Em.A();
    defaultSubreddits.forEach(function (id) {
      list.pushObject(EmberReddit.Subreddit.create({id: id}));
    });

    // Remember what we've created so we don't request it twice.
    this._list = list;
    return list;
  },

  /*
    Returns the default subreddit to show if the user hasn't selected one.
  */
  defaultSubreddit: function() {
    return this.list()[0];
  }

});

