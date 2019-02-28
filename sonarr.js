const request = require('request');
var config = require("./config.js");

const manualImport_options = {
    url: config.base_url+'/api/manualimport?folder=/downloads/tg/',
    headers: {
        'X-API-Key': config.api_key,
    }
};

var doImport_options = {
    
    url: config.base_url+'/api/command',
    method: 'POST',
    json: true,
    //body: JSONObject,
    headers: {
        'X-API-Key': config.api_key,
    }
}

function doImport_callback(error, response, body) {
    console.log(response.statusCode);
    console.log(body);
}

function manualImport_callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    const data = JSON.parse(body);
    var command = {
        "name":"manualImport",
        "files":[],
        "importMode":"Move"
    };
    for (var item in data) {
        if(data[item].rejections.length===0) {
            var file = {};
            file.path=data[item].path;
            file.folderName=data[item].folderName;
            file.seriesId=data[item].episodes[0].seriesId;
            file.episodeIds=[];
            for (var episode in data[item].episodes) {
                file.episodeIds[episode]=data[item].episodes[episode].id;
            }
            file.quality=data[item].quality;
            file.revision=data[item].revision;
            command.files.push(file);
        }
    }
    console.log(body);
    console.log(JSON.stringify(command));
    doImport_options.body = command;
    request(doImport_options,doImport_callback);
  }
}

request(manualImport_options, manualImport_callback);
