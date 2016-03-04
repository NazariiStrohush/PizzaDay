Template.groupManage.events({
	'click .menuAdd': function(e){
		e.preventDefault();


		var menuItem = {
			name: $(e.target).parents().find('.menuName').val(),
			cost: parseInt($(e.target).parents().find('.menuCost').val()),
			groupId: this.groupId
		};
		
		Meteor.call('addMenuItem', menuItem, function(err, res){
			if(err)
				console.log(err);
			/*else
				console.log(res);*/
		});
	}
});