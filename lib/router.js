Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/', {
	name: 'home'
});

Router.route('/groupManage/:id', {
	waitOn: function(){
		//console.log(this.params.id);
		return [
			Meteor.subscribe('group', this.params.id), 
			Meteor.subscribe('menu', this.params.id), 
			Meteor.subscribe('groupEvents', this.params.id),
			Meteor.subscribe('orders', this.params.id),
			Meteor.subscribe('order', this.params.id)
		];
	},
	data: function (){
		return {
			groupId: this.params.id,
			menu: function(){
				return Menu.find();
			},
			groupInfo: function(){
				//console.log(Groups.find());
				return Groups.findOne();
			},
			groupEvents: function(){
				//console.log(Groups.find());
				return groupEvents.find();
			},
			order: function(){
				//console.log(Groups.find());
				return order.find();
			}
		}
	},
	name: 'groupManage'
});

Router.route('/groupCreate', {
	waitOn: function(){
		return [Meteor.subscribe('allUsers')/*, Meteor.subscribe('groups')*/];
	},
	data: function (){
		return {
			allUsers: function(){
				return Meteor.users.find();
			}
		}
	},
	name: 'groupCreate'
});