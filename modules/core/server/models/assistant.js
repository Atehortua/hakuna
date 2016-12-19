'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
require('mongoose-function')(mongoose);
var Schema = mongoose.Schema;

/**
 * Datos Schema
 */
var linkSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    categoria:{
        type: String,
        required: true
    },
    favorito:{
        type: Boolean,
        required: true
    },
    visible:{
        type: Boolean,
        required: true
    }
});

mongoose.model('AssistantDb', linkSchema);
