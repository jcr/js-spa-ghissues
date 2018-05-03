/*
 * JavaScript SPA Task
 *
 * Feature 7: Use Marionette
 *
 * Author:      Jules Clement <jules@ker.bz>
 * Date:        June 2015
 */

'use strict';

var App = Backbone.Marionette.Application.extend({
    currentRepository: null,
    regions: {
        main: 'main'
    },
    initialize: function () {
        this.params = new Params();
        this.user = new User();
        this.repository = new Repository({user: this.user});
        this.listenTo(this, 'start', function () { Backbone.history.start(); });
        this.listenTo(this.params, 'change:username', this.updateUsername);
        this.listenTo(this.params, 'change:repository', this.updateRepository);
        this.listenTo(this.params, 'change:per_page', this.updateState);
    },
    /*
     * Feature 1: Repository search
     *
     * This is where the App 'magic' happens.
     * We watch for this.params update to maintain the app 'internal state'
     * If requirements are met, we fetch this.repository and keep the fetch
     *   promise in this.currentRepository
     */
    updateUsername: function () {
        //console.log('APP updateUsername', this.params.attributes);
        if (this.params.get('username')) {
            this.user.set('login', this.params.get('username'));
        } else {
            this.user.clear();
        }
    },
    updateRepository: function () {
        //console.log('APP updateRepository', this.params.attributes);
        if (this.params.get('username') && this.params.get('repository')) {
            this.repository.set('name', this.params.get('repository'));
            this.currentRepository = this.repository.fetch().promise();
        } else {
            this.currentRepository = null;
            this.repository.clear();
        }
    },
    /*
     * If per_page parameter change and page isn't '1', reset it
     *   to avoid fetching a, potentially, non-existing page
     */
    updateState: function () {
        if (this.params.get('page') != 1) {
            this.params.set('page', 1);
        }
    }
});

/*****************************************
 *
 * Let's dance with Marionette, shall we?
 *
 */

var app = new App();
app.router = new Router({container: app.main});
app.start();
