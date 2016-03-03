Meteor.publish('allUsers', function(){
	return Meteor.users.find();
});

Meteor.publish('groups', function(){
	return Groups.find();
});

Meteor.publish('group', function(id){
	//console.log(id);
	check(id, String);
	return Groups.find({_id: id});
});