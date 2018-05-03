/*
 * JavaScript SPA Task
 *
 * Repository search
 * Issue pagination
 *
 * Layout for the Issues list display.
 *
 * Provides two regions:
 *  - listing   the issues list table
 *  - pager     listing pager
 *
 * Author:      Jules Clement <jules@ker.bz>
 * Date:        June 2015
 */

'use strict';
var IssuesListLayout = Backbone.Marionette.LayoutView.extend({
    template: '#issueslist-template',
    tagName: 'section',
    id: 'issueslist',
    regions: {
        listing: 'content',
        pager: 'footer'
    },
    initialize: function() {
        //console.log('ISSUESLIST new\t\t\t\t\t'+this.cid);
        _.bindAll(this, 'showIssues', 'showError');
        this.issues = new Issues([], {
            repository: this.options.repository,
            params: this.model
        });
    },
    /*
     * Load/Error handling, before showing this view, display
     * Spinner, and fetch issue.
     * Show issues list or error after fetch complete.
     */
    onBeforeShow: function () {
        console.log('ISSUESLIST onBeforeShow\t\t\t'+this.cid);
        this.showChildView('listing', new Spinner());
        this.issues.fetch().done(this.showIssues).fail(this.showError);
    },
    showError: function (jqXHR, textStatus, errorThrown) {
        //console.log('ISSUESLIST error', this);
        this.error = new Message({
            style: textStatus,
            message: 'Issues ' + textStatus + ': ' + errorThrown
        });
        this.showChildView('listing', this.error);
    },
    showIssues: function () {
        this.issuesView = new IssuesView({collection: this.issues});
        this.pagerView = new IssuesPagerView({model: this.issues});
        this.showChildView('listing', this.issuesView);
        this.showChildView('pager', this.pagerView);
    }
});
