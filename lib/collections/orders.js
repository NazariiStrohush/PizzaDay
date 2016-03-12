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
		check(groupId, String);
		if(Groups.findOne(groupId).status == 1){
			var ordersInfo = Orders.findOne({groupId: groupId}, {sort: {date: -1, limit: 1}}); 
			var allOrders = Order.find({ordersId: ordersInfo._id}).fetch();		
			var totalSum = allOrders.reduce(function(sum, curr){
				return sum + curr.sum;
			}, 0); 
			var todayDay = new Date(); 
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

			var ownerIndex = null;

			allOrders.forEach(function(item, index, array){
				if(item.userId == ordersInfo.userId)
					ownerIndex = index;
			});

			var ownerOrder = allOrders.splice(ownerIndex, 1)[0];
			//console.log(ownerOrder);
			var ownerText = ownerOrder.userName + ' ваше замовленя: </br>';
			
			ownerOrder.arr.forEach(function(subItem, subIndex, subArray){	
					var temp = ownerOrder.arr[subIndex];
					
					temp.costWithDiscount = temp.cost - (totalDiscount * (temp.cost / totalSum));
					ownerOrder.sumWithDiscount = ownerOrder.sum - (totalDiscount * (ownerOrder.sum / totalSum));
					
					var tempOrder = (subIndex + 1) + '. ' + subItem.name + ' ' +  subItem.quantity + 'x ' + 
						( (subItem.cost !== subItem.costWithDiscount) ?  '<strike>' + subItem.cost + '</strike> ' : '') +
						subItem.costWithDiscount + ' = ' + (subItem.costWithDiscount * subItem.quantity) + '</br>';

					ownerText += tempOrder;
				});

			ownerText += ' А також список всіх інших замовлень: </br>';
			var text = '';

			//SSR.compileTemplate('mailToAll', Assets.getText('mailToAll.html'));

			allOrders.forEach(function(item, index, array){
				text = '';
		
				text += item.userName + ' ваше замовлення оформлено' + '. Ви замовляли: </br>';
				ownerText += item.userName + ': ';

				item.arr.forEach(function(subItem, subIndex, subArray){	
					var temp = array[index].arr[subIndex];
					
					temp.costWithDiscount = temp.cost - (totalDiscount * (temp.cost / totalSum));
					array[index].sumWithDiscount = array[index].sum - (totalDiscount * (array[index].sum / totalSum));
					
					var tempOrder = (subIndex + 1) + '. ' + subItem.name + ' ' +  subItem.quantity + 'x ' + 
						( (subItem.cost !== subItem.costWithDiscount) ?  '<strike>' + subItem.cost + '</strike> ' : '') +
						subItem.costWithDiscount + ' = ' + (subItem.costWithDiscount * subItem.quantity) + '</br>';
					
					text += tempOrder;
					ownerText += tempOrder;
				});
				ownerText += 'До оплати: ' + item.sumWithDiscount + '$</br>';
				text += 'До оплати: ' + item.sumWithDiscount + '$';
				//var html = SSR.render("mailToAll", allOrders);
				Email.send({
			      to: item.userEmail,
			      from: "admin@pizzaday.com",
			      subject: "Ваше замовлення",
			      text: text
			    });
			});
			ownerText += 'В загальному до оплати враховуючи знижки: ' + (totalSum - totalDiscount);
			Email.send({
			      to: ownerOrder.userEmail,
			      from: "admin@pizzaday.com",
			      subject: "Всі замовлення",
			      text: ownerText
			});
			Groups.update(groupId, {$set: {status: 0}});
		}
	}
});