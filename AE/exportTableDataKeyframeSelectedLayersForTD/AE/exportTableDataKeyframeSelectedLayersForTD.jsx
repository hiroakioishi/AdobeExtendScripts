
// 参照リンク
// Create a txt file in Extendscript
// https://community.adobe.com/t5/after-effects/create-a-txt-file-in-extendscript/m-p/9645024
// property object
// https://ae-scripting.docsforadobe.dev/properties/property/

// --------------------------------------------------------
// 設定
// --------------------------------------------------------
// フレームレート
var FRAME_RATE   = 30.0;
// 合計秒数
var TOTAL_SECOND = 24.0;


// --------------------------------------------------------
// txtファイルの作成
// --------------------------------------------------------
// スクリプトのディレクトリパスを取得
var txtExportDir = File($.fileName).path;

var fObj= new Folder();
fObj= fObj.selectDlg('保存先を選択してください');
if (fObj != null)
{
    txtExportDir = fObj.fsName;
}
else
{
    alert('スクリプトファイルがあるディレクトリにファイルを出力します.');
}

frameRate = prompt('動画のフレームレート', 30);
FRAME_RATE = eval(frameRate);

totalSeconds = prompt('動画の合計秒数', 24);
TOTAL_SECOND = eval(totalSeconds);

// JSONファイル
var date = new Date();
var dateTxt = date.getFullYear() +
    ('00' + (date.getMonth() + 1)).slice(-2) +
    ('00' + (date.getDate())).slice(-2) +
    ('00' + (date.getHours())).slice(-2) +
    ('00' + (date.getMinutes())).slice(-2) +
    ('00' + (date.getSeconds())).slice(-2);
var txtFile = new File(txtExportDir + encodeURI('/') + encodeURI('walkingPositionData_'+dateTxt+'.txt'));

var content = getKeyframesTableDataObject();
// ファイルに書き込み
writeFile(txtFile, content);

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

function getKeyframesTableDataObject()
{
    var jsonRoot = new Object();
    var layers = [];

    var myLayers = app.project.activeItem.selectedLayers;

    if (myLayers.length > 0)
    {
        var dt = 1.0 / FRAME_RATE;

        var txt = '';
        
        for (var t = 0.0; t < TOTAL_SECOND; t += dt)
        {
            for (var i = 0; i < myLayers.length; i++)
            {            
                if (myLayers[i].inPoint <= t && myLayers[i].outPoint >= t)
                {
                    txt += myLayers[i].position.valueAtTime(t, true)[0] + '\t';
                    txt += myLayers[i].position.valueAtTime(t, true)[1] + '\t';
                }                 
            }
            txt += '\n';
        }
    }
    return txt;

    /*
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
    */
}




