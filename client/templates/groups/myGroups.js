Template.myGroupsList.helpers({
	'ifCreator': function () {
		return this.userId == Meteor.userId();
	}
});