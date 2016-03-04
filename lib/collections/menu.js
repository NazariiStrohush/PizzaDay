Menu = new Mongo.Collection('menu');

Meteor.methods({
	'addMenuItem': function(menuItem){
		check(menuItem, {
			name: String,
			cost: Number,
			groupId: String
		});
		
		var menuItem = _.extend(menuItem, {
			userId: Meteor.userId(),
			userName: Meteor.user().profile.name,
      		date: new Date()
		});

		return Menu.insert(menuItem);
	}
});