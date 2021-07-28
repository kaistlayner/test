var http = require('http');
var fs = require('fs');
var url = require('url');
const { Console } = require('console');

var special_list = ['main', 'enter', 'update', 'create_process', 'update_process'];
var debugging = true;

function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">JMJ's WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
};

function move_param(param){
  return param;
}

function is_in(elem, list){
  return list.indexOf(elem) != -1;
}

var app = http.createServer(function(request,response){
  fs.readdir('./data', function(error, filelist){ 
    /*filelist.sort(function(a, b){
      return a < b;
    }); */
    
    var _url = request.url;
    var qs = (_url.split('/?id=')).slice(1);
    _url = qs[0];
    console.log("\nqs: ", qs);
    //if(_url.indexOf('.') == -1) _url += '.html';

    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      if(!is_in(filelist[i], special_list)){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i].toUpperCase()}</a></li>`;}
      i = i + 1;
    }
    list = list+'</ul>';

    if(_url == undefined){
      _url = 'main';
    }
    else if(_url.indexOf('jpg') != -1){
      if(debugging) console.log('jpg case');
      return;
    }
    else if(!is_in(_url, filelist) && is_in(_url, special_list)){
      console.log('wrong url case');
      console.log('url: '+_url);
      response.writeHead(404);
      response.end('page not found 404\n');
      return;
    }
    else if(_url == 'create_process'){
      if(debugging) console.log("\process_create case");
      var input_buf;
      request.on('data', function(data){
        input_buf = data;
      });
      request.on('end', function(){
        var input_str = input_buf.toString();
        args = input_str.split('&');
        var i = 0;
        var arg_dic = {};
        while(i < args.length){
          var cur_arg = args[i].split('=');
          arg_dic[cur_arg[0]] = cur_arg[1];
          i += 1;
        }
        console.log(JSON.stringify(arg_dic));
        fs.writeFile(`data/${arg_dic['title']}`, arg_dic['description'], 'utf8', function(err){
          response.writeHead(302,
            {Location: `/?id=${arg_dic['title']}`});
          response.end();
          return;
        });
      });
    }
    else if(_url == 'update'){
      var des = qs[1];
      var desc = "nothing"
      fs.writeFile(`data/${des}`, desc, 'utf8', function(err){
        response.writeHead(302,
          {Location: `/?id=${des}`});
        response.end();
        return;
      });
    }
    
    if(debugging) console.log("normal case");
    var reading = 'data/'+_url;
    //_url = _url.replace('.html', '');
    var title = _url.toUpperCase();
    if(_url == 'main') title = 'WEB';
    
    if(debugging) console.log("read: "+reading);

    fs.readFile(reading, 'utf8', function(err, desc){
      response.writeHead(200);
      var body;
      if(desc == null){
        response.end("no descr");
        return;
      }
      else if(_url == 'enter'){
        body = `
        <h2>"File Control"</h2>
        <p><a href="/?id=enter">Make file</a>
        <a href="/?id=update/?id=${_url}">Update file</a></p>
        <p>${desc}</p>
        `;
      }
      else if(_url == 'enter2'){
        var i = 0;
        var edit_list = `<form action='localhost:3000/update_process' method='post'>`;
        while(i < filelist.length){
          if(!is_in(filelist[i], special_list)){
            edit_list = edit_list + `
              <input type='button' onclick='
                move_param(filelist[i])
              ' value=${filelist[i]}>
            `;}
          i = i + 1;
        }
        edit_list += '</form>';
        body = `
        <h2>"File Control"</h2>
        <p><a href="/?id=enter">Make file</a>
        <a href="/?id=update/?id=${_url}">Update file</a></p>
        ${edit_list}
        <p>${desc}</p>
        `;
      }
      else{
        body = `
        <h2>"File Control"</h2>
        <p><a href="/?id=enter">Make file</a>
        <a href="/?id=update/?id=${_url}">Update file</a></p>
        <h3>${title}</h3>
        <p>${desc}</p>
        `;
      }
      response.end(templateHTML(title, list, body));
      return;
    });
    
  });
});
app.listen(3000);
