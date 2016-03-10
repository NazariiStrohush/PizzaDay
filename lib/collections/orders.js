Orders = new Mongo.Collection("orders");
Order = new Mongo.Collection("order");

Meteor.methods({
	'createOrders': function(ordersItem){
		check(ordersItem, {
			groupId: String
		});

		ordersItem = _.extend(ordersItem, {date: new Date(), usersId: []});

		var ordersId = Orders.insert(ordersItem);
		return {
			id: ordersId, 
			groupId: ordersItem.groupId
		}

	},
	'addUserOrder': function(ordersItems, sum, groupId){
		check(ordersItems, Array);
		check(sum, Number);
		check(groupId, String);

		var ordersInfo = Orders.findOne({groupId: groupId}, {sort: {date: -1, limit: 1}});

		console.log(ordersInfo);

		var ordersItem = {
			sum: sum, 
			groupId: groupId, 
			ordersId: ordersInfo._id, 
			userId: Meteor.userId(),
			userName: Meteor.user().profile.name,
			userEmail: Meteor.user().services.google.email,
			date: new Date(),
			arr: ordersItems
		};

		console.log(ordersItem);

		Orders.update(ordersInfo._id, {$addToSet: {
			usersId: Meteor.userId()
		}});

		return Order.insert(ordersItem);
	},
	'calculateSummaryCost': function(groupId){
		var ordersInfo = Orders.findOne({groupId: groupId}, {sort: {date: -1, limit: 1}}); //OK
		var allOrders = Order.find({ordersId: ordersInfo._id}).fetch();		//OK
		var totalSum = allOrders.reduce(function(sum, curr){		//OK
			return sum + curr.sum;
		}, 0); //OK
		var todayDay = new Date(); //OK
		var groupEventsArr = groupEvents.find({groupId: groupId, days: { $in: [todayDay.getDay().toString()] }}).fetch();
		var menuDiscountIds = [];
		groupEventsArr.forEach(function(item){
			item.menues.forEach(function(item){
				menuDiscountIds.push(item.menuId);
			});
		});
		var orderedMenu = Menu.find({_id: {$in: menuDiscountIds}}).fetch();
		var totalDiscount = orderedMenu.reduce(function(sum, curr){
			return sum + curr.cost;
		}, 0);

		allOrders.forEach(function(item, index, array){
			item.arr.forEach(function(subItem, subIndex, subArray){
				var temp = array[index].arr[subIndex];
				temp.costWithDiscount = temp.cost - (totalDiscount * (temp.cost / totalSum)); 
			});
		});

		
		//console.log(allOrders);
	}
});