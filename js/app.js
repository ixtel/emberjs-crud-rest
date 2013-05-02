App = Ember.Application.create({ LOG_TRANSITIONS: true});

App.Router.map(function() {
  this.route("index", { path: "/" });
  this.route("about", { path: "/about" });


  
  this.resource("locations", function(){
      console.log("Inside locations....");
      this.route("new", {path:"/new"});
      this.route("edit", {path: "/:location_id" });
  });

  // this.route("locations", {path:"/locations"});
  // this.route("locations.edit", {path: "/locations/:location_id" });

});

App.ApplicationController = Ember.Controller.extend({
  
  // some property of our controller.
  globalString: 'this is the application string',

});

App.Adapter = DS.RESTAdapter.extend({
  serializer: DS.RESTSerializer.extend({
    primaryKey: function (type){
      return '_id';
   }
  })
});

App.Store = DS.Store.extend({
  revision: 12,
  adapter: 'App.Adapter'
});

DS.RESTAdapter.reopen({
  url: 'http://localhost:3000'
});


App.Location = DS.Model.extend({
    latitude: DS.attr('string'),
    longitude: DS.attr('string'),
    accuracy: DS.attr('string')

});



App.LocationsIndexRoute = Ember.Route.extend({

  setupController: function(controller) {
    // Set the IndexController's `title`
    controller.set('content', App.Location.find());
  },

  renderTemplate: function() {
    console.log("Rendering locationsRouteTemplate");
    this.render('locations.index',{into:'application'});
  }

});

App.LocationsEditRoute = Ember.Route.extend({

  setupController: function(controller, model) {
      this.controllerFor('locations.edit').setProperties({isNew: false,content:model});
  },

  renderTemplate: function() {
    this.render('locations.edit',{into:'application'});
  }

});

App.LocationsNewRoute = Ember.Route.extend({
  // model: function() {
  //   return App.Location.createRecord();
  // },
  setupController: function(controller, model) {
      //var controller = this.controllerFor('locations.edit');
      this.controllerFor('locations.edit').setProperties({isNew: true,content:App.Location.createRecord()});
      // controller.set('content',App.Location.createRecord());
      // controller.set('isNew',true);
  },
  renderTemplate: function() {
    this.render('locations.edit',{into:'application'});
  }

});


// App.LocationsNewController = Ember.ObjectController.extend({
//   addItem: function(location) {
//     //this.get("store").commit();
//     //this.get("target").transitionTo("locations");
//     location.transaction.commit();
//     this.get("target").transitionTo("locations");
//   },

//   isNewObject: function() {
//     var model = this.get('content');
//     return (!model.id);
//   }.property(),

//   dataFromController: function() {
//   	return "dataFromControllerValue";
//   }.property()

// });

App.LocationsEditController = Ember.ObjectController.extend({
  updateItem: function(location) {
    location.transaction.commit();
    this.get("target").transitionTo("locations");
  },

  isNew: function() {
    console.log("calculating isNew");
    return this.get('content').get('id');
  }.property()

 // isNewObject: function() {
 //    var model = this.get('content');
 //    return (!model.id);
 //  }.property(),


});


App.LocationsIndexController = Ember.ArrayController.extend({
  removeItem: function(location) {
    location.on("didDelete", this, function() {
		console.log("record deleted");
    });

    location.deleteRecord();
    location.transaction.commit();
  }
});


App.NavView = Ember.View.extend({
    tagName: 'li',
    classNameBindings: ['active'],

    didInsertElement: function () {
          this._super();
          this.notifyPropertyChange('active');
          var _this = this;
          this.get('parentView').on('click', function () {
              _this.notifyPropertyChange('active');
          });
    },

    active: function() {
      return this.get('childViews.firstObject.active');
    }.property()
  });

