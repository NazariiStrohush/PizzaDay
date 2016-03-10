var usersArray = new ReactiveArray([]);
Template.groupCreate.events({
	'click .usersAll': function(e){
		e.preventDefault();
		var userItem = {
			userId: this._id,
			userName: this.services.google.name
		};
		if (_.findWhere(usersArray, userItem) == null) {
    		usersArray.push(userItem);
		}
		//console.log(usersArray);
	},
	'click .usersAdded': function(e){
		e.preventDefault();
		var userItem = {
			userId: this._id,
			userName: this.userName
		};
		usersArray.splice(usersArray.lastIndexOf(userItem), 1);
		//console.log(usersArray);
	},
	'click .send': function(e){
		e.preventDefault();
		var groupItem = {
			logo: $(e.target).parents().find(".groupLogo").val(),
			name: $(e.target).parents().find(".groupName").val(),
			users: usersArray.array()
		}
		//console.log(groupItem);
		Meteor.call('groupCreate', groupItem, function(err, res){
			if(err) {
				console.log(err);
			}
			else {
				Router.go('groupManage', {id: res});
			}
		//console.log(usersArray);
		});
	}
});

Template.groupCreate.rendered = function(){
	var userItem = {
		userId: Meteor.userId(),
		userName: Meteor.user().profile.name
	}

	usersArray.push(userItem);
};

Template.groupCreate.helpers({
	addedUsers: function(){
		//console.log(usersArray);
		return usersArray.list();
	}
});
