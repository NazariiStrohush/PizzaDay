var userOrder = new ReactiveArray([]);

Template.groupMenu.helpers({
	'menuItems': function(){
		return Menu.find();
	},
	'ifOrdering': function(status){
		//console.log(status);
		return (status == 1) ? true : false;
	},
	'isOrderCart': function(){
		userOrder.depend();
		//console.log(userOrder.length);
		return (userOrder.length > 0) ? true : false;
	},
	'isCreator': function(){
		return (Template.parentData(1).groupInfo().userId == Meteor.userId()) || (this.userId == Meteor.userId());
	}
});

Template.groupMenu.events({
	'click .addTocart': function(e){
		e.preventDefault();
		var quantity = $(e.target).parent().prev().find(".quantity");
		//console.log($(e.target).parent().prev().find(".quantity").val());
		var orderItem = {
			itemId: this._id,
			quantity: quantity.val(),
			cost: this.cost,
			name: this.name
		};

		$(quantity).prop("disabled", "true");

		if (_.findWhere(userOrder, orderItem) == null) {
	    		userOrder.push(orderItem);
	    		$(quantity).prop("disabled", "true");
	    		$(e.target).text("Видалити")
	  				.removeClass("addTocart btn-info")
	    			.addClass("btn-danger removeCartItem");
			}
		//console.log(userOrder);
	},
	'click .removeCartItem': function(e){
		e.preventDefault();
		
		var quantity = $(e.target).parent().prev().find(".quantity");
		$(quantity).val('1');

		var orderItem = {
			itemId: this._id,
			quantity: quantity.val(),
			cost: this.cost,
			name: this.name
		};

		$(quantity).prop("disabled", "true");

		userOrder.splice(userOrder.lastIndexOf(orderItem), 1);
	    		
	    		$(quantity).removeAttr("disabled");
	    		$(e.target).text("Додати")
	    			.addClass("addTocart btn-info")
	    			.removeClass("btn-danger removeCartItem");
		//console.log(userOrder);
	},
	'click .confirmOrder': function(e){
		e.preventDefault();
		console.log(this.groupId);
		Meteor.call('addUserOrder', 
			userOrder.array(), 
			userOrder.array().reduce(function(sum, current) {
				return sum + current.cost * current.quantity;
			}, 0), 
			this.groupId,
			function(err, res){
				if(err)
					console.log(err);
				/*else
					console.log(res);*/
			});

/*		$(quantity).prop("disabled", "true");

		userOrder.splice(userOrder.lastIndexOf(orderItem), 1);
	    		
	    		$(quantity).removeAttr("disabled");
	    		$(e.target).text("Додати")
	    			.addClass("addTocart btn-info")
	    			.removeClass("btn-danger removeCartItem");*/
		//console.log(userOrder);
	}
});