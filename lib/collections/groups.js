Groups = new Mongo.Collection("groups");

var owner = function(userId, doc) {
  return doc && doc.userId === userId;
};

Meteor.methods({
	'groupCreate': function(groupItem){
		check(groupItem, {
			logo: String,
			name: String,
			users: Array
		});
		//console.log(Meteor.user().services.google.name);
		var groupItem = _.extend(groupItem, {
      		userId: Meteor.userId(),
      		userName: Meteor.user().services.google.name,
      		date: new Date(),
      		status: 0,
      		orderId: ''
    	});
    	return Groups.insert(groupItem);
	},
  'setStatus': function(params){
    check(params, {
      groupId: String,
      status: Number
    });

    return Groups.update(params.groupId, {$set: {status: params.status}});
  },
  'setOrderId': function(params){
      check(params, {
      groupId: String,
      orderId: String
    });

    Groups.update(params.groupId, {$set:{orderId: params.orderId}});
  },
  'addUserToGroup': function(userItem, groupId){
    check(userItem, {
      userId: String,
      userName: String
    });
    check(groupId, String);

    if(owner(Meteor.userId(), Groups.findOne(groupId))){
      Groups.update(groupId, {$addToSet: {users: userItem}});
    }
  }

});