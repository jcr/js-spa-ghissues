/*
 * JavaScript SPA Task
 *
 * Some helper functions
 *
 * Author:      Jules Clement <jules@ker.bz>
 * Date:        June 2015
 */

'use strict';

/*
 * Simple 'QueryString'-like parser
 * returns a hash...
 */
var QueryParse = function (queryString, splitChar) {
    if (!queryString) return {};
    return _.object(_.compact(_.map(
        queryString.split(splitChar || '&'),
        function(item) { return item.split('='); }
    )));
};

/*
 * Some basic views...
 */
var Message = Backbone.Marionette.ItemView.extend({
    template:   '#message-template',
    id:         'message',
    initialize: function (options) {
        this.model = new Backbone.Model({
            message: options.message,
            style: options.style || 'info'
        });
    }
});

var Spinner = Backbone.Marionette.ItemView.extend({
    template:   '#spinner-template',
    id:         'spinner',
    onRender: function() {
        this.$el.animate({left: "+="+($(app.main.el).width()-40)+"px"}, 3000);
    }
});
