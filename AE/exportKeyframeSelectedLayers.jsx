
// https://community.adobe.com/t5/after-effects/create-a-txt-file-in-extendscript/m-p/9645024

// https://ae-scripting.docsforadobe.dev/properties/property/

// --------------------------------------------------------
// 設定
// --------------------------------------------------------
var FRAME_RATE = 30.0;
var TOTAL_SECOND = 24.0;

// --------------------------------------------------------
// ライブラリ読み込み
// --------------------------------------------------------
var path = ((File($.fileName)).path); // this is the path of the script
// now build a path to another js file
// e.g. json lib https://github.com/douglascrockford/JSON-js
var libfile = File(path +'./libs/json2.js');
if(libfile.exists)
{
    $.evalFile(libfile);
}

// --------------------------------------------------------
// JSONファイルの作成
// --------------------------------------------------------
// スクリプトのディレクトリパスを取得
var scriptFolderPath = File($.fileName).path;
// JSONファイル
var date = new Date();
var dateTxt = date.getFullYear() +
    ('00' + (date.getMonth() + 1)).slice(-2) +
    ('00' + (date.getDate())).slice(-2) +
    ('00' + (date.getHours())).slice(-2) +
    ('00' + (date.getMinutes())).slice(-2) +
    ('00' + (date.getSeconds())).slice(-2);
var jsonFile = new File(scriptFolderPath + encodeURI('/motionData_'+dateTxt+'.json'));
// AEで選択したレイヤーのポジションデータを取得し, JSONデータに変換
var content = getKeyframesJsonObject();
// ファイルに書き込み
writeFile(jsonFile, JSON.stringify(content, null, '\t'));

alert('Complete.');

function writeFile(fileObj, fileContent, encoding)
{
    encoding = encoding || 'utf-8';
    fileObj = (fileObj instanceof File) ? fileObj : new File(fileObj);
    var parentFolder = fileObj.parent;
    if (!parentFolder.exists && !parentFolder.create())
    {
        throw new Error('Cannot create file in path ' + fileObj.fsName);
    }
    fileObj.encoding = encoding;
    fileObj.open('w')
    fileObj.write(fileContent)
    fileObj.close();
    return fileObj;
}

function getKeyframesJsonObject()
{
    var jsonRoot = new Object();
    var layers = [];

    var myLayers = app.project.activeItem.selectedLayers;

    if (myLayers.length > 0)
    {
        var dt = 1.0 / FRAME_RATE;

        var txt = '';
        txt = 'frame,layerName,px,py\n';

        for (var i = 0; i < myLayers.length; i++)
        {
            var layer = {};
            layer.name = myLayers[i].name;
            layer.keys = [];
                        
            var frame = 0;
            for (var t = 0.0; t < TOTAL_SECOND; t += dt)
            {
                var key = new Object();
                key.frame = frame;
                var position = new Object();
                position.x = myLayers[i].position.valueAtTime(t, true)[0];
                position.y = myLayers[i].position.valueAtTime(t, true)[1];

                key.position = position;

                layer.keys.push(key);

                frame++;
            }
            layers.push(layer);
        }

        jsonRoot.totalsecond = TOTAL_SECOND;
        jsonRoot.framerate = FRAME_RATE;
        jsonRoot.layers = layers;
        
        return jsonRoot; 
    }
    else
    {
        alert("No layers selected.");
        return null;
    }
    return null;
}




