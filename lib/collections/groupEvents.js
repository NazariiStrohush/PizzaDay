groupEvents = new Mongo.Collection('groupEvents');

var owner = function(userId, doc) {
  return doc && doc.userId === userId;
};


Meteor.methods({
	'addEvent': function(eventItem){
		check(eventItem, {
			name: String,
			groupId: String,
			days: Array,
			menues: Array
		});

		return groupEvents.insert(eventItem);
	},
	'getTodayDiscounts': function(groupId){
		var todayDay = new Date();
		return groupEvents.find({groupId: groupId, days: { $in: [todayDay.getDay().toString()] }}).fetch();
	},
	'removeDiscount': function(discountId, groupId){
		check(discountId, String);
		check(groupId, String);

		if(owner(Meteor.userId(), Groups.findOne(groupId))){
			groupEvents.remove(discountId);
		}
	}
});