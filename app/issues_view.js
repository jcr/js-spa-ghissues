/*
 * JavaScript SPA Task
 *
 * Issues list
 *
 * Author:      Jules Clement <jules@ker.bz>
 * Date:        June 2015
 */

'use strict';

/*
 * Repository search
 * Generate a row (1 issue) for the issues list
 */
var IssueRowView = Backbone.Marionette.ItemView.extend({
    template: '#issuerow-template',
    tagName: "tr",
    serializeData: function() {
        return {
            issue: this.model.toJSON(),
            repository: this.model.collection.repository.toJSON()
        };
    }
});

/*
 * Repository search
 * Render a collection of Issues in a tabular way
 */
var IssuesView = Backbone.Marionette.CompositeView.extend({
    template:   "#issues-template",
    tagName:    "table",
    id:         "issues-list",
    childView:  IssueRowView,
    childViewContainer: "tbody",
    getTemplate: function () {
        if (this.collection.isEmpty()) {
            return "#noissues-template";
        } else {
            return this.template;
        }
    }
});

/*
 * Issues Pager
 * Take an Issues.state as a model
 */
var IssuesPagerView = Backbone.Marionette.ItemView.extend({
    template: '#issuespager-template',
    events: {
        'click a': 'changePage'
    },
    // initialize: function() {
    //     this.listenTo(this.model, 'sync', this.render);
    // },
    serializeData: function () {
        return this.model.state.toJSON();
    },
    // TODO: cleanup / do not rely on innerText , target hash page should be ok for all
    changePage: function (e) {
        e.preventDefault();
        var page;
        if (e.target.rel) {
            var p = QueryParse(e.target.hash, '/');
            page = p.page;
        } else {
            page = e.target.innerText;
        }
        app.params.set('page', page);
        return false;
    }
});
