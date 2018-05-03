/*
 * JavaScript SPA Task
 *
 * GitHub Repository collection
 *
 * Take a 'user' argument of type User
 *
 * Author:      Jules Clement <jules@ker.bz>
 * Date:        June 2015
 */

'use strict';

var Repositories = Backbone.Collection.extend({
    urlRoot:    GHapi+'/users',
    model:      Repository,
    initialize: function (models, options) {
        this.user = options.user;
    },
    /* Returns as many repositories as possible in 1 shot.
     GitHub API limit is 100 results per call, to get 'all' user repositories
     we would need to iterate following the Link header an cash all results... */
    fetch: function (options) {
        options || (options = {});
        options.data = {
            per_page: 100
        };
        return Backbone.Collection.prototype.fetch.call(this, options);
    },
    /*
     * It seems like a flaw/bug/design error in Marionette/Backbone inspectors?
     * In short, they use 'watchers' as a key to store some Watch.JS obj in a 
     *  serialized response from the API. It use to ( I banged my head on that
     *  an afternoon mid-June '15) some fetch calls fail if the collection/model
     *  to be retreived already had a 'watchers' attribute.
     * Now it simply overrides the model data with it's watchers objects...
     * Thanks to https://github.com/marionettejs/marionette.inspector/commit/8b35f9d5cf1626331243044d01a421095dd94891 and few other things it doesn't "explode" anymore, nonetheless
     * I (strongly) believe there is something kinda wrong in here.
     */
    parse: function (resp) {
        return _.each(resp, function (r) { r.watchers = null; });
    },
    url: function () {
        return this.urlRoot + '/' + this.user.get('login') + '/repos';
    }
});
