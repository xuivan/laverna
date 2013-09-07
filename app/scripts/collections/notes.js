/*global define*/
define(['underscore', 'models/note', 'backbone', 'localStorage'], function (_, Note, Backbone) {
    'use strict';

    var Notes = Backbone.Collection.extend({
        model: Note,

        localStorage: new Backbone.LocalStorage('vimarkable.notes'),

        /**
         * Filter the list of all notes that are favorite
         */
        getFavorites: function () {
            return this.filter(function (note) {
                return note.get('isFavorite') === 1;
            });
        },

        /**
         * Only active notes
         */
        getActive: function () {
            return this.without.apply(this, this.getTrashed());
        },

        /**
         * Filter the list of notes that are removed to trash
         */
        getTrashed: function () {
            return this.filter(function (note) {
                return note.get('trash') === 1;
            });
        },

        /**
         * Search
         */
        search : function(letters){
            if(letters === '') {
                return this;
            }

            var pattern = new RegExp(letters, 'gi');
            return this.filter(function(model) {
                return pattern.test(model.get('title'));
            });
        },

        /**
         * Pagination
         * @var int perPage
         * @var int page
         * @var string filter
         */
        pagination : function (perPage, page, filter) {
            if (filter === 'active') {
                this.reset(this.getActive());
            }

            var collection = this;
            page = page - 1;

            collection = _(collection.rest(perPage * page));
            collection = _(collection.first(perPage));

            return collection.map( function(model) {
                return model;
            });
        }
    });

    return Notes;
});
