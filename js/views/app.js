EmberReddit.ApplicationView = Ember.View.extend({
  didInsertElement: function() {

    // Attach the `keyup` event to the body element,
    // to transition back to the subreddit's index
    // when the escape key is pressed.

    $('body').on('keyup', function(event) {
      if (event.keyCode !== 27) {
        return;
      }
      controller.transitionToRoute('subreddit');
    });
  }
});
