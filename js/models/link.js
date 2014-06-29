// Our Link model
EmberReddit.Link = Ember.Object.extend({
  /*
    It seems reddit will return the string "default" or "self" when there's no thumbnail
    present.

    This computed property will convert "default" or "self" to null to avoid rendering a broken
    image link.
  */
  thumbnailUrl: function() {
    var thumbnail = this.get('thumbnail');
    return ((thumbnail === 'default') || (thumbnail === 'self')) ? null : thumbnail;
  }.property('thumbnail'),

  image: function() {
    var url = this.get('url');
    if (!url) { return false; }
    if (url.match(/\.(jpeg|jpg|gif|png)$/) !== null) { return true; }
    if (url.match(/imgur\.com\//) !== null) { return true; }
    return false;
  }.property('url'),

  embed: function() {
    var result = this.get('media_embed.content');
    if (!result) return null;

    return result.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  }.property('media_embed.content'),

  imageUrl: function() {
    var url = this.get('url');
    if (!url) return false;
    if (url.match(/imgur\.com\//) !== null) return url + ".jpg";
    return url;
  }.property('url')

});
