/*
 * JavaScript SPA Task
 *
 * Models for our SPA
 *
 * Author:      Jules Clement <jules@ker.bz>
 * Date:        June 2015
 */

'use strict';

var GHapi = 'https://api.github.com';

var Params = Backbone.Model.extend({
    defaults: {
        page:       1,
        username:   null,
        repository: null,
        per_page:   "30" /* Default GitHub pagination value for issues list */
    }
});

/**
 * Let's define Models for "objects" we're
 * gonna use from GitHub (see also *collections.js)
 */

var User = Backbone.Model.extend({
    urlRoot: GHapi+'/users',
    idAttribute: 'login'
});

var Repository = Backbone.Model.extend({
    urlRoot: GHapi+'/repos',
    idAttribute: 'name',
    initialize: function (options) {
        this.user = options.user;
    },
    url: function () {
        return this.urlRoot + '/' + this.user.get('login') + '/'
            + this.get('name');
    }
});

var Issue = Backbone.Model.extend({
    urlRoot: GHapi+'/repos',
    initialize: function(options) {
        this.repository = options.repository;
    },
    url: function () {
        return this.urlRoot + '/' + this.repository.get('full_name')
            + '/issues/' + this.get('number');
    }
});
