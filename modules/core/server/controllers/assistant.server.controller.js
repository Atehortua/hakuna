'use strict';

var mongoose = require('mongoose'),
    AssistantDb = mongoose.model('AssistantDb'),
    _ = require('lodash');



exports.findLinks = function(req,res){
    AssistantDb.find().exec(function(err, links) {
        if (err) {
            return res.render('error', {
                status: 500
            });
        } else {
            return res.jsonp(links);
        }
    });
};

exports.add = function(req,res){
    var link = new AssistantDb(req.body)
    var status = {};
    link.save(function(err) {
        status = {link: link, status: true}
        if (err) {
            console.log("Problemas :( ", err)
            status.status = false;
            return res.jsonp(status)
        } else {
            console.log("Se guardo exitosamente la grafica", link);
            return res.jsonp(status)
        }
    });
};

exports.update = function(req,res){
    var linkUpdate = req.body;
    console.log(linkUpdate._id)
    AssistantDb.findOne({_id: linkUpdate._id},function(err,link){
        if(link !== null){
            link.name = linkUpdate.name;
            link.categoria = linkUpdate.categoria;
            link.link = linkUpdate.link;
            link.favorito = linkUpdate.favorito;
            link.visible = linkUpdate.visible;

            link.save(function(err){
                if(!err){
                    console.log("Se actuliazo exitosamente el link", link);
                    return res.jsonp({status:true});
                }else{
                    return res.jsonp({status:false});
                }
            });
        }else{
            return res.jsonp({status:false});
        }
    });
};


exports.destroy = function(req,res){
    var deleteLink = req.params.id;
    AssistantDb.findOne({_id: deleteLink},function(err,link){
        if(link){
            link.remove(function(err){
                if(!err){
                    console.log("Se elimino exitosamente el link ",link)
                    return res.jsonp({status:true,link:link});
                }else{
                    console.log("Problema", err)
                    return res.jsonp({status:false,link:link});
                }
            })
        }else{
            console.log("No se elimino el linl")
            return res.jsonp({status:false});
        }
    })
};
