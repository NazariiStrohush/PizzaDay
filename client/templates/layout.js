Template.layout.helpers({
	'registered': function(){
		return Meteor.user() ? true : false;
	}
})