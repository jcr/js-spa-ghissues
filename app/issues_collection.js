/*
 * JavaScript SPA Task
 *
 * GitHub Issue collection
 *
 * Author:      Jules Clement <jules@ker.bz>
 * Date:        June 2015
 */

'use strict';

/**
 * This is a "composite" collection that maintain an "internal"
 * state (this.state).
 * This state gives information on the last set of data retreived (fetch)
 *  - page:     the page last retreived
 *  - url:      repository issues list url with params
 *  - links:    contains (not mandatory) first, next, prev, last pages "number"
 *
 * Takes 1 arguments
 *  - params            of type Params for "page" and "per_page" options
 * Uses the global app.repository
 *  - repository        of type Repository
 */
var Issues = Backbone.Collection.extend({
    urlRoot:    GHapi+'/repos',
    model:      Issue,
    initialize: function (models, options) {
        this.repository = options.repository;
        this.params = options.params;
        this.state = new Backbone.Model();
    },

    /*
     * Issue pagination
     * pass on page and per_page option from collection params
     */
    fetch: function (options) {
        options || (options = {});
        options.data = {
            page: this.params.get('page'),
            per_page: this.params.get('per_page'),
            state: 'all' /* issues status (all / open / closed) */
        };
        return Backbone.Collection.prototype.fetch.call(this, {
            success: this.updateState,
            data: options.data
        });
    },
    /* On success, parse GitHub responseHeader 'Link' and update state */
    updateState: function (self, data, req) {
        var links = ParseGHLink(req.xhr.getResponseHeader('Link'));
        /* Always append number of items per_page in link (be URL-stateful) */
        var url = self.repository.get('full_name')
                + '/per_page=' + self.params.get('per_page');
        self.state.set({links: links, url: url, page: self.params.get('page')});
    },
    url: function () {
        return this.urlRoot + '/' + this.repository.get('full_name') + '/issues';
    }
});

/*
 * Specialized function to parse GitHub responseHeader 'Link'
 * returns a hash with pages number for first, last, prev, etc...
 *
 * In a way that's were we break the recommended use of their API
 *  when it comes to crawling pages.
 * https://developer.github.com/guides/traversing-with-pagination/#basics-of-pagination
 * In another, it's good enough since passing the page=X parameter to fetch
 *  issues fetch seems fairly reliable.
 */
var ParseGHLink = function (linkHeader) {
    if (!linkHeader) return {};
    var links = _.object(_.compact(_.map(linkHeader.split(', '), function(item) {
        var link = item.split(';');
        var qs = QueryParse(link[0].slice(link[0].indexOf('?')+1, -1));
        /* trim the ' rel="' and last " from link[1] (the key) */
        return [link[1].slice(6, -1), qs.page];
    })));
    return links;
};
