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
			//console.log(eventMenuItems.array());
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

		//console.log(eventItem);

	    Meteor.call('addEvent', eventItem, function(err, res){
	    	if(err)
	    		console.log(err);
	    	/*else
	    		console.log(res);*/
	    })
	},

	'click .ordering': function(e){
			
			var ordersItem = {
				groupId: this.groupId,
			};

			Meteor.call('setStatus', {groupId: this.groupId, status: 1});

			/*Meteor.call('getTodayDiscounts', this.groupId, function(err, res){
				if(err)
					console.log(err);
			});*/
		    Meteor.call('createOrders', ordersItem, function(err, res){
		    	if(err)
		    		console.log(err);
		    	/*else {
		    		Meteor.call('setOrderId', {groupId: res.groupId, orderId: res.id});
		    	}*/
		    });
		},
	'click .notOrdering': function(e){
		
		var ordersItem = {
			groupId: this.groupId,
		};

		Meteor.call('setStatus', {groupId: this.groupId, status: 0});
		Meteor.call('setOrderId', {groupId: this.groupId, orderId: ''});
	}
});
Template.groupManage.helpers({
	getDayName: function(){
		var daysArr = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
			return this.days.reduce(function(conc, curr) {
  				return conc.concat(', ', daysArr[curr]);
		}, '').substring(1);
	},
	getStatus: function(){
		var statusArr = ['Неактивна', 'Замовлення', 'Замовлено', 'Доставляється', 'Доставлено'];
			/*console.log(this.status);
			console.log(this.groupInfo.status);
			console.log(this);*/
			return statusArr[this.groupInfo];
	},
	groupOwner: function() {
    	return this.groupInfo.userId == Meteor.userId();
  	}
});