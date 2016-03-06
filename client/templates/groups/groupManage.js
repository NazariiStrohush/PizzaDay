var eventMenuItems = new ReactiveArray([]);
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
	},
	'click .addDiscount': function(e){
			var eventMenuItem = {
				groupId: this.groupId,
				menuId: $(e.target).parents().find('.eventMenuItems').val()
			};
			if (_.findWhere(eventMenuItems, eventMenuItem) == null) {
	    		eventMenuItems.push(eventMenuItem);
			}
			console.log(eventMenuItems.array());
	},
	'click .saveEvent': function(e){
		var daysOfWeek = $(e.target).parents().find('.day input:checked').map(function(){
	      return $(this).val();
	    });
		
		var eventItem = {
			name: $(e.target).parents().find('.eventName').val(),
			groupId: this.groupId,
			days: daysOfWeek.get(),
			menues: eventMenuItems.array()
		}

		console.log(eventItem);

	    Meteor.call('addEvent', eventItem, function(err, res){
	    	if(err)
	    		console.log(err);
	    	else
	    		console.log(res);
	    })
	}

});
Template.groupManage.helpers({
	getDayName: function(){
		var daysArr = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
			return this.days.reduce(function(conc, curr) {
  				return conc.concat(', ', daysArr[curr]);
		}, '').substring(1);
	}
});