
function getIndex(list, id_user) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id_user === id_user) {
            return i;
        }
    }

    return -1;
}


var userApi = Vue.resource('/user{/id_user}');

Vue.component('user-form', {
    props: ['users', 'userAttr'],
    data: function() {
        return {
            name: '',
            id_user: '',
            password:'',
            email:''
        }
    },
    watch: {
        userAttr: function(newVal, oldVal) {
            this.name = newVal.name;
            this.id_user = newVal.id_user;
            this.password = newVal.password;
            this.email = newVal.email;
        }
    },
    template:
        '<div>' +

        '</div>',
    methods: {
        save: function() {
            var user = { name: this.name };

            if (this.id_user) {
                userApi.update({id_user: this.id_user}, user).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.users, data.id_user);
                        this.users.splice(index, 1, data);
                        this.name = ''
                        this.id_user = ''
                    })
                )
            } else {
                userApi.save({}, user).then(result =>
                    result.json().then(data => {
                        this.users.push(data);
                        this.name = ''
                    })
                )
            }
        }
    }
});

Vue.component('user-row', {
    props: ['user', 'editMethod', 'users'],
    template: '<div>' +
        '<i><p><b>ID:</b>({{ user.id_user }})  </i></p>'+
        '  <b>Name:</b> {{ user.name }}  '+
        '  <b>Password:</b>{{ user.password }}  '+
        '  <b>Email:</b>{{ user.email }}  ' +
        '</div>',
    methods: {
        edit: function() {
            this.editMethod(this.user);
        },
        del: function() {
            userApi.remove({id_user: this.user.id_user}).then(result => {
                if (result.ok) {
                    this.users.splice(this.users.indexOf(this.user), 1)
                }
            })
        }
    }
});

Vue.component('users-list', {
    props: ['users'],
    data: function() {
        return {
            user: null
        }
    },
    template:
        '<div style="position: relative; width: 600px;">' +
        '<user-form :users="users" :userAttr="user" />' +
        '<user-row v-for="user in users" :key="user.id_user" :user="user" ' +
        ':editMethod="editMethod" :users="users" />' +
        '</div>',
    created: function() {
        userApi.get().then(result =>
            result.json().then(data =>
                data.forEach(user => this.users.push(user))
            )
        )
    },
    methods: {
        editMethod: function(user) {
            this.user = user;
        }
    }
});

var app = new Vue({
    el: '#app1',
    template: '<users-list :users="users" />',
    data: {
        users: []
    }
});
