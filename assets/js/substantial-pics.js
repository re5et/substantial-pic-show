(function(){

  var sp = {

    items: [],

    user: $('user'),

    hashtag: $('hashtag'),

    handleResponse: function(tweets){
      tweets.each(function(tweet){
        sp.items.push({
          image: sp.getImageUrl(tweet),
          user: sp.getMentionedUser(tweet),
          hashtag: sp.getHashTag(tweet)
        })
      });
      sp.request.options.data.page++;
      if(tweets.length != 0){
        sp.request.send();
      }
      else{
        sp.setupWall();
      }
    },

    itemAdded: function(items){
      items.each(function(e, i){
        e.node.setStyle("background", "url('"+sp.items[(e.y)].image+"') no-repeat center center");
      });
    },

    itemSelected: function(id){
      var item = sp.items[id];
      screenName = item.user.screen_name;
      sp.user.set({
        text: 'featuring @'+screenName,
        href: 'http://twitter.com/'+screenName
      });
      sp.hashtag.set({
        text: '#'+item.hashtag,
        href: 'http://twitter.com/search?q=%23'+item.hashtag
      });
      if(screenName == undefined){
        sp.user.hide();
      }
      else{
        sp.user.show();
      }
    },

    getImageUrl: function(tweet){
      return tweet.entities.urls[0].expanded_url;
    },

    getMentionedUser: function(tweet){
      var user = false
      tweet.entities.user_mentions.each(function(mention){
        if(mention.screen_name != 'Substantial'){
          user = mention;
        }
      });
      return user;
    },

    getHashTag: function(tweet){
      return tweet.entities.hashtags[0].text
    },

    setupWall: function(){
      var wall = new Wall("wall", {
        "draggable":true,
        "autoposition":true,
        "speed":500,
        "inertia":true,
        "preload":true,
        "transition":Fx.Transitions.Expo.easeInOut,
        "width":718,
        "height":510,
        "rangex":[0, sp.items.length],
        "rangey":[0,1]
      });

      wall.setCallOnUpdate(sp.itemAdded);
      wall.setCallOnChange(sp.itemSelected);
      wall.initWall();
      wall.getListLinksPoints("coda-list");
    },

    init: function(){
      sp.request = new Request.JSONP({
        url: 'http://api.twitter.com/1/statuses/user_timeline/substantialpics.json',
        data: {
          include_entities: true,
          page: 0,
          count: 20
        },
        onSuccess: sp.handleResponse
      }).send();
    }

  };

  $(window).addEvent('domready', sp.init);

})();
