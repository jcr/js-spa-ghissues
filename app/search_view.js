/*
 * JavaScript SPA Task
 *
 * Repository search
 *
 * The view for our search form
 * Take a Params as model
 *
 * Author:      Jules Clement <jules@ker.bz>
 * Date:        June 2015
 */

'use strict';

var SearchForm = Backbone.Marionette.ItemView.extend({
    template: '#search-template',
    ui: {
        username:   'input[name="username"]',
        repository: 'input[name="repository"]',
        per_page:   'input[name="per_page"]'
    },
    events: {
        'submit': 'search',
        'change input[name="username"]': 'lookupUser'
    },
    initialize: function (options) {
        _.bindAll(this, 'listRepositories', 'fillRepositories', 'search');
        this.user = app.user;
        this.repositories = new Repositories(null, {user: this.user});
        this.listenTo(this.model, 'change', this.render);
        console.log('SEARCHFORM new '+this.cid);
    },

    /*
     * Repository search
     * Submit the search, save form inputs in app.params
     */
    search: function (e) {
        e.preventDefault();
        /* Gather values for the following fields, returns a hash */
        var values = _.object(_.compact(_.map(
            this.ui, function (item, name) { return [ name, item.val() ]; }
        )));
        console.log('SEARCHFORM submit', values);
        app.params.set(values);
        return false;
    },

    /*
     * Improved selection
     *
     * This is limited to the first 100 repositories found
     *
     * lookupUser, on username change, empty repository field, fetch user, then
     * listRepositories, get repositories for user, then
     * fillRepositories, autocomplete repository input field
     */
    lookupUser: function (e) {
        var that = this;
        this.ui.username.removeAttr('class');
        this.user.set('login', e.target.value);
        return this.user.fetch().then(
            this.listRepositories,
            function (jqXHR, textStatus, errorThrown) {
                $(that.ui.username).addClass('invalid');
                console.error('User ' + textStatus + ': ' + errorThrown);
            }
        );
    },
    listRepositories: function () {
        var that = this;
        this.ui.username.addClass('valid');
        this.ui.repository.removeAttr('class');
        return this.repositories.fetch().then(
            this.fillRepositories,
            function (jqXHR, textStatus, errorThrown) {
                $(that.ui.repository).addClass('invalid');
                console.error('User repositories ' + textStatus + ': ' + errorThrown);
            }
        );
    },
    fillRepositories: function (data, testStatus, jqXHR) {
        var that = this;
        this.ui.repository.val('');
         $(this.ui.repository).autocomplete({
            source: _.map(data, function (d) { return d.name; }),
            autoFocus: true,
            minLength: 0,
            select: function (e, ui) {
                $(that.ui.repository).val(ui.item.value);
                $(that.ui.repository).addClass('valid');
                $(that.ui.repository).trigger('submit');
            }
        }).autocomplete("search");
    }
});
