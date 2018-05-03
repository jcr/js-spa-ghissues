/*
 * JavaScript SPA Task
 *
 * Repository search
 * Load/Error handling
 * 
 * SearchLayout - Layout for the repository search page
 *   display the search form and the issues list
 *
 * Provides 2 regions:
 *  - search    The search form
 *  - issues    The issues list
 *
 * Author:      Jules Clement <jules@ker.bz>
 * Date:        June 2015
 */

'use strict';

var SearchLayout = Backbone.Marionette.LayoutView.extend({
    template: "#repositorysearch-template",
    tagName: 'section',
    id: 'repositorysearch',
    regions: {
        search: 'header',
        issues: 'article'
    },
    initialize: function (options) {
        //console.log('SEARCH new\t\t\t\t'+this.cid);
        _.bindAll(this, 'showResults', 'showError');
        this.listenTo(app.params, 'change', this.update);
    },
    /* Repository search, show search form */
    onBeforeShow: function () {
        //console.log('SEARCH onBeforeShow\t\t'+this.cid);
        this.searchFormView = new SearchForm({model: app.params});
        this.showChildView('search', this.searchFormView);
        if (app.currentRepository) this.update();
    },
    showResults: function () {
        //console.log('SEARCH showResults\t\t'+this.cid);
        this.issuesListLayout = new IssuesListLayout({
            model: app.params,
            repository: app.repository
        });
        this.showChildView('issues', this.issuesListLayout);
    },
    showError: function (jqXHR, textStatus, errorThrown) {
        this.showChildView('issues', new Message({
            style: textStatus,
            message: 'Repository ' + textStatus + ': ' + errorThrown
        }));
    },
    /* On params changes, update list results */
    update: function () {
        //console.log('SEARCH update\t\t\t'+this.cid);
        if (app.currentRepository) app.currentRepository.done(this.showResults).fail(this.showError);
    }
});
