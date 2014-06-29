EmberReddit.Router.map(function() {
  this.resource("subreddit", { path: "/r/:subreddit_id" }, function() {
    this.resource('link', { path: '/:link_id'} );
  });
});

EmberReddit.LinkRoute = Ember.Route.extend({
  model: function(params) {
    return this.modelFor('subreddit').findLinkById(params.link_id);
  }
});

EmberReddit.SubredditRoute = Ember.Route.extend({
  model: function(params) {
    return EmberReddit.Subreddit.list().findProperty('id', params.subreddit_id);
  },

  afterModel: function(model) {
    return model.loadLinks();
  }
});

EmberReddit.ApplicationRoute = Ember.Route.extend({
  setupController: function(applicationController) {
    applicationController.set('subreddits', EmberReddit.Subreddit.list());
  }
});

EmberReddit.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('subreddit', EmberReddit.Subreddit.defaultSubreddit());
  }
});
