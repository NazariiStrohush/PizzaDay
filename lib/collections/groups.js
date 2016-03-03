Groups = new Mongo.Collection("groups");

Meteor.methods({
	'groupCreate': function(groupItem){
		check(groupItem, {
			logo: String,
			name: String,
			users: Array
		});
		//console.log(Meteor.user().services.google.name);
		var groupItem = _.extend(groupItem, {
      		userId: Meteor.userId(),
      		userName: Meteor.user().services.google.name,
      		date: new Date()
    	});
    	return Groups.insert(groupItem);
	}
})