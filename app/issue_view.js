/*
 * JavaScript SPA Task
 *
 * Routing / New pages
 *
 * Author:      Jules Clement <jules@ker.bz>
 * Date:        June 2015
 */

'use strict';

/* Display Issue details */
var IssueView = Backbone.Marionette.ItemView.extend({
    template: '#issue-template',
    tagName: 'article',
    id: 'issue'
});

/* Issue details header + navigation */
var IssueHeaderView = Backbone.Marionette.ItemView.extend({
    template: '#issueheader-template',
    tagName: 'header',
    serializeData: function() {
        return {
            //issue: this.model.toJSON(),
            repository: this.model.repository.toJSON()
        };
    }
});
