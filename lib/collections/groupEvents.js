groupEvents = new Mongo.Collection('groupEvents');

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
	}
});