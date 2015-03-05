/**
 * Created by Administrator on 14-3-4.
 */

function sendRequest(url, req) {
    var dfd = $.Deferred();
    $.ajax({
        url: url,
        req: req
    }).done(function(resp){
        dfd.resolve(JSON.parse(resp));
    }).fail(function(resp){
        dfd.resolve(JSON.parse(resp));
    });
    return dfd;
}

function sendSingleObjRequest(url, req){
    var dfd = $.Deferred();
    $.ajax({
        url: url,
        req: req
    }).done(function(resp){
        try{
            var result = JSON.parse(resp);
            dfd.resolve(result);
        }catch(e){
            console.log(e);
            dfd.reject();
        }
    }).fail(function(resp){
        dfd.resolve(JSON.parse(resp));
    });
    return dfd;
}
