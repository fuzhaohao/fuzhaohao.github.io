//用于生成uuid
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

$(function() {
    var $key = $('#key'); // file name    eg: the file is image.jpg,but $key='a.jpg', you will upload the file named 'a.jpg'
    var $userfile = $('#userfile'); // the file you selected

    // upload info
    var $selectedFile = $('.selected-file');
    var $progress = $(".progress");
    var $uploadedResult = $('.uploaded-result');

    $("#userfile").change(function() { // you can ues 'onchange' here to uplpad automatically after select a file
        $uploadedResult.html('');
        var selectedFile = $userfile.val();
        if (selectedFile) {
            // randomly generate the final file name
            var ramdomName = guid() + $userfile.val().match(/\.?[^.\/]+$/);
            $key.val("jssdk/" + ramdomName);
            $selectedFile.html('文件：' + selectedFile);
        } else {
            return false;
        }
        var f = new FormData(document.getElementById("testform"));
        axios({
          url: 'http://up-z0.qiniu.com',
          method: 'post',
          data: f,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: function(e) {
            if (e.lengthComputable) {
              var percent = e.loaded / e.total * 100;
              $progress.html('上传：' + e.loaded + "/" + e.total + " bytes. " + percent.toFixed(2) + "%");
            }
          }
        }).then((res) => {
          if(res.status==200 && res.statusText == 'OK') {
            console.log("上传成功");
            var str = '<span>已上传：' + res.data.key + '</span>';
            if (res.data.key && res.data.key.match(/\.(jpg|jpeg|png|gif)$/)) {
              str += '<a href="' + domain + res.data.key + '" target="_blank"><img src="' + domain + res.data.key + '"/></a>';
            }
            $uploadedResult.html(str);
          }
        }).catch( (error) => {
          console.log(error);
          alert(error);
          $uploadedResult.html('上传失败：' + res.responseText);
        })
        return false;
    });
});