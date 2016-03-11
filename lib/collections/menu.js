Menu = new Mongo.Collection('menu');

var owner = function(userId, doc) {
  return doc && doc.userId === userId;
};

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
	},
	'removeMenuItem': function(menuId, groupId){
		check(menuId, String);
		check(groupId, String);
		if(owner(Meteor.userId(), Menu.findOne(menuId)) || owner(Meteor.userId(), Groups.findOne(groupId))){
			return Menu.remove(menuId);
		}
	}
});