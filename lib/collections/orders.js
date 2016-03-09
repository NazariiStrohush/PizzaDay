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
	'addUserOrder': function(ordersItem, sum, groupId){
		check(ordersItem, Array);
		check(sum, Number);
		check(groupId, String);

		var ordersInfo = Orders.findOne({groupId: groupId}, {sort: {date: -1, limit: 1}});

		ordersItem = _.extend(ordersItem, {
			sum: sum, 
			groupId: groupId, 
			ordersId: ordersInfo._id, 
			userId: Meteor.userId(),
			date: new Date()
		});
		
		Orders.update(ordersInfo._id, {$addToSet: {
			usersId: Meteor.userId()
		}});

		return Order.insert(ordersItem);
	}
});