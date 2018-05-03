/*
 * JavaScript SPA Task
 *
 * Routing / New pages
 *
 * Author:      Jules Clement <jules@ker.bz>
 * Date:        June 2015
 */

'use strict';

var Router = Backbone.Marionette.AppRouter.extend({
    initialize: function (options) {
        this.container = options.container;
        this.listenTo(app.params, 'change', this.updateUrl);
    },
    /* update URL (add/record page in history) */
    updateUrl: function () {
        if (!app.params.get('repository') || !app.params.changed) return;
        var nav = '#' + app.params.get('username')+
                '/' + app.params.get('repository');
        if (app.params.get('per_page') != app.params.defaults.per_page) {
            nav += '/per_page=' + app.params.get('per_page');
        }
        if (app.params.changed.page && app.params.get('page') != 1) {
            nav += '/page=' + app.params.get('page');
        }
        console.warn('ROUTER nav '+nav, app.params.changed, app.params.attributes);
        this.navigate(nav);
    },
    reset: function () {
        app.params.set(app.params.defaults);
        app.currentRepository = null;
    },

    routes: {
        "": 'search',
        ":username/:repository/issue/:number": 'showIssue',
        ":username/:repository(/*extra)": 'showSearch'
    },

    search: function () {
        //console.info('ROUTER main');
        this.reset();
        this.layout = new SearchLayout();
        this.container.show(this.layout);
    },
    /* Navigate to Issue detail page */
    showIssue: function (username, repository, number) {
        //console.info('ROUTER issue '+username+'/'+repository+'/'+number);
        app.params.set({username: username, repository: repository});
        this.navigate('#' + username + '/' + repository + '/issue/' + number);
        this.layout = new IssueLayout({number: number});
        this.container.show(this.layout);
    },
    /* Stateful URLs, go to Repository search */
    showSearch: function (username, repository, extra) {
        if (this.layout) this.layout.destroy();
        //console.info('ROUTER search '+username+'/'+repository+' - '+extra);
        var params = {username: username, repository: repository};
        var extras = QueryParse(extra, '/') || {};
        params.per_page = extras.per_page || app.params.defaults.per_page;
        params.page = extras.page || app.params.defaults.page;
        app.params.set(params);
        this.layout = new SearchLayout();
        this.container.show(this.layout);
    }
});
