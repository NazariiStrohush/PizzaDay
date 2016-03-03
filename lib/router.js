Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/', {
	name: 'home'
});

Router.route('/groupManage/:id', {
	waitOn: function(){
		//console.log(this.params.id);
		return [Meteor.subscribe('group', this.params.id)/*, Meteor.subscribe('menu', {id: this.params.id})*/];
	},
	data: function (){
		return {
			allUsers: function(){
				return Meteor.users.find();
			},
			menu: function(){
				return [];
			},
			groupInfo: function(){
				//console.log(Groups.find());
				return Groups.findOne();
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