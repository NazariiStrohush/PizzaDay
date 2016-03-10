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
				menuId: $(e.target).parents().find('.eventMenuItems').val(),
				menuName: $(e.target).parents().find('.eventMenuItems option:selected').text()
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
		    Meteor.call('createOrders', ordersItem, function(err, res){
		    	if(err)
		    		console.log(err);
		    });
		},
	'click .notOrdering': function(e){
		
		var ordersItem = {
			groupId: this.groupId,
		};

		Meteor.call('setStatus', {groupId: this.groupId, status: 0});
		Meteor.call('setOrderId', {groupId: this.groupId, orderId: ''});
	},
	'click .delivering': function(e){
		Meteor.call('calculateSummaryCost', this.groupId);
	},
	'click .discountList': function(e){
		e.preventDefault();
		var menuItem = {
			menuId: this._id,
			menuName: this.menuName
		};
		eventMenuItems.splice(eventMenuItems.lastIndexOf(menuItem), 1);
	}
});
Template.groupManage.helpers({
	getDayName: function(){
		var daysArr = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
		//console.log(this);
			return this.days.reduce(function(conc, curr) {
  				return conc.concat(', ', daysArr[curr]);
		}, '').substring(1);
	},
	getStatus: function(){
		var statusArr = ['Тільки перегляд', 'Виконуються замовлення', 'Замовлено', 'Доставляється', 'Доставлено'];
			return statusArr[this.groupInfo().status];
	},
	groupOwner: function() {
    	return this.groupInfo().userId == Meteor.userId();
  	},
  	addedEventMenuItems: function(){
  		return eventMenuItems.list();
  	}
});