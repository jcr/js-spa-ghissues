/*
 * JavaScript SPA Task
 *
 * Routing / New pages
 *
 * Author:      Jules Clement <jules@ker.bz>
 * Date:        June 2015
 */

'use strict';

/*
 * Layout for the Issue detail page.
 *
 * Provides 2 regions:
 *  - header    app navigation
 *  - issue     Issue display
 */
var IssueLayout = Backbone.Marionette.LayoutView.extend({
    template: '#issuedetail-template',
    tagName: 'section',
    id: 'issuedetail',
    regions: {
        header:  'header',
        content: 'article'
    },
    initialize: function (options) {
        _.bindAll(this, 'getIssue', 'showIssue', 'showError',
                  'showIssueError', 'showRepositoryError');
        this.issue = new Issue({repository: app.repository, number: options.number});
    },

    onBeforeShow: function () {
        this.showChildView('content', new Spinner());
        app.currentRepository.done(this.getIssue).fail(this.showRepositoryError);
    },
    getIssue: function (data, textStatus, jqXHR) {
        //console.log('ISSUE '+textStatusb);
        this.issue.fetch().then(this.showIssue, this.showIssueError);
    },
    showIssueError: function (jqXHR, textStatus, errorThrown, type) {
        this.issueHeaderView = new IssueHeaderView({model: this.issue});
        this.showChildView('header', this.issueHeaderView);
        this.showError('Issue ' + textStatus + ': ' + errorThrown);
    },
    showRepositoryError: function (jqXHR, textStatus, errorThrown, type) {
        this.showError('Repository ' + textStatus + ': ' + errorThrown);
    },
    showError: function (message) {//jqXHR, textStatus, errorThrown, type) {
        this.showChildView('content', new Message({
            style: 'error',
            message: message
        }));
    },
    showIssue: function (collection, response, options) {
        this.issueHeaderView = new IssueHeaderView({model: this.issue});
        this.showChildView('header', this.issueHeaderView);
        this.issueView = new IssueView({model: this.issue});
        this.showChildView('content', this.issueView);
    }
});
