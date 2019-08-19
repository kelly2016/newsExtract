
var returnAnalysisRst = null;// global json object storing the ltp server return value

$(document).ready(function () {

  //-----main view-----
  var analysisBtn, // the button for active analysis
    analysis = null, // function to start analysis
    readySentView = null, // function to set the sent view
    readyXmlView = null,
    readyParaView = null,
    maskObj = document.getElementById("mask"),
    manualObj = document.getElementById("usingManual"),
    loadingObj = document.getElementById("loadingTag"),
    loadingOriHtml = loadingObj.innerHTML,
    analysisPanelObj = document.getElementById("analysisPanel"),
    setLoadingPos = null, // function to set loading tag position
    SELECT_SENTS = {
      "sample": "他叫汤姆去拿外衣。\n他点头表示同意我的意见。\n我们即将以昂扬的斗志迎来新的一年。\n国内专家学者40余人参加研讨会。",
      "sdptree": "妈妈把旧窗帘撕成了抹布。\n这价格比我预料的稍高一些。\n解放军更早在四月就进入学生运动的发起地、彷如地震震央的北京大学。\n投资环境的改善，吸引了国内外大财团、大企业的雄厚资金、先进经验、先进技术接踵而至。",
      "sdpgraph": "早起使人健康。\n他设法穿过了森林。\n快死的叶子发黄而卷曲。\n他有个儿子才上小学。",
      "paraPolity": "巴希尔强调，政府坚决主张通过和平和政治途径结束目前的武装冲突，在全国实现和平。他强烈呼吁以约翰·加朗为首的反政府武装力量回到国家的怀抱。在谈到周边关系时，巴希尔说，苏丹政府将采取行动改善与周边国家的关系。",
      "paraSports": "大连万达俱乐部在决赛后，因对裁判员判罚不满，而拒绝领奖和不出席新闻发布会。这种行为不仅不符合体育精神，不符合足球比赛的规范，也有损于大连万达俱乐部和中国足球的形象。对此，中国足球协会特通报批评。大连万达俱乐部应认真检查，吸取教训，并准备接受亚足联可能给予的处罚。"
    },
    sentSelectDomObj = document.getElementById("sentSelect"),
    textareaEnterNum = 0,
    getEnterNumFromStr = null, // function to get Enter number
    analysisBtn = $("#analysis"),
    startAnalysis=null,
    isLoading=false;

    function displayLoadingPage() {
      maskObj.style.display = "block";
      analysisPanel.style.display = "none";
      manualObj.style.display = "none";
      loadingObj.innerHTML = loadingOriHtml;
      loadingObj.style.display = "block";
      setLoadingPos();
      //this.blur(); // make the button blur . focusing status looks not-beautiful
    }

    startAnalysis=function(){
      console.log('isLoading:'+isLoading)

      if(isLoading===true){
        return
      }
      isLoading=true;

      displayLoadingPage();

      //可能UI会出现延时？没有setTimeout的情况下，Loading不能够及时显示。
      setTimeout(function(){
        try{
          analysis();
        }catch(e){
          console.log(e)
          if(e.err===1){

            manualObj.style.display = "block";
            manualObj.innerText='请输入内容'

            loadingTag.style.display="none"

            // maskObj.style.display = "none";
          }
        }
        setTimeout(function() {
          isLoading = false
        })
        
      },20)
    }
    
  analysis = function () {

    var requestArgs = [],
      postData,
      targetURL;

    //requestArgs["api_key"] = "U2G658z15u6Q4RpksQHC9KDevunLIypIHc5nPr5U";
    //requestArgs["api_key"] = "Q2MnjbFfyamoCi2YrdcdgXautrLHWENlskDEOrPI";
    requestArgs["api_key"] = "b9D0w08oEOkGTAsF1sxfJK6DOXCQtECRtlSlCqlA";
    requestArgs["pattern"] = "all";
    requestArgs["format"] = "json";
    requestArgs["text"] = encodeURI($("#inputText").val());
    postData = (function () {
      var tmpStrArray = [];
      for (key in requestArgs) {
        tmpStrArray.push([key, requestArgs[key]].join("="));
      }
      return tmpStrArray.join("&");
    })();
    //targetURL = "http://ltpapi.voicecloud.cn/analysis/" ;
    //targetURL = "http://192.168.21.36:8887/analysis/" ;
    targetURL = "https://api.ltp-cloud.com/analysis/";

    getDataFun()

    function getDataFun() {
      var paragraphs = $("#inputText").val()
      var paragraphArr = paragraphs.split('\n')
        .filter(function (item) { return item })
        .map(function (item) {
          return item.replace(/。|……|？|！|；/g, "$&\n").split('\n')
            .filter(function (item) { return item })
        })
      var sentenceArr = [].concat.apply([], paragraphArr)

      if (sentenceArr.length === 0) {
        throw {
          err:1,
          msg:'empty array'
        }
      }

      // debugger;

      (function getData(semgraphparserErr, times) {
        if (times > 1) return

        //
        //暂时存储每次xhr请求，以及请求完成后所得的Ajax数据
        var resObjs = {
          posArr: [],
          dpArr: [],
          sdpArr: [],
          nerArr: [],
          sdgpArr: [],
          srlArr: []
        };
        //每条句子4次请求
        sentenceArr.forEach(function (item) {
          resObjs.posArr.push(
            //新接口
            // http://172.17.183.169:10000/api/v1/nlp/cws
            // https://api.yfc.yunfutech.com/
            $.ajax({
              url: "https://api.yfc.yunfutech.com/api/v1/nlp/pos",
              data: JSON.stringify({
                "text": item
              }),
              contentType: "application/json;charset=utf-8",
              async: false,
              type: 'POST'
            })
          )
        });
        sentenceArr.forEach(function (item) {
          resObjs.dpArr.push(
            //新接口
            // http://172.17.183.169:10000/api/v1/nlp/cws
            $.ajax({
              url: "https://api.yfc.yunfutech.com/api/v1/nlp/dp",
              data: JSON.stringify({
                "text": item
              }),
              contentType: "application/json;charset=utf-8",
              async: false,
              type: 'POST'
            })
          )
        });
        sentenceArr.forEach(function (item) {
          resObjs.sdpArr.push(
            //新接口
            // http://172.17.183.169:10000/api/v1/nlp/cws
            $.ajax({
              url: "https://api.yfc.yunfutech.com/api/v1/nlp/sdp",
              data: JSON.stringify({
                "text": item
              }),
              contentType: "application/json;charset=utf-8",
              async: false,
              type: 'POST'
            })
          )
        });
        sentenceArr.forEach(function (item) {
          resObjs.nerArr.push(
            //新接口
            // http://172.17.183.169:10000/api/v1/nlp/cws
            $.ajax({
              url: "https://api.yfc.yunfutech.com/api/v1/nlp/ner",
              data: JSON.stringify({
                "text": item
              }),
              contentType: "application/json;charset=utf-8",
              async: false,
              type: 'POST'
            })
          )
        });

        sentenceArr.forEach(function (item) {
          resObjs.sdgpArr.push(
            //新接口
            // http://172.17.183.169:10000/api/v1/nlp/cws
            $.ajax({
              url: "https://api.yfc.yunfutech.com/api/v1/nlp/sdgp",
              data: JSON.stringify({
                "text": item
              }),
              contentType: "application/json;charset=utf-8",
              async: false,
              type: 'POST'
            })
          )
        });

        sentenceArr.forEach(function (item) {
          resObjs.srlArr.push(
            //新接口
            // http://172.17.183.169:10000/api/v1/nlp/cws
            $.ajax({
              url: "https://api.yfc.yunfutech.com/api/v1/nlp/srl",
              data: JSON.stringify({
                "text": item
              }),
              contentType: "application/json;charset=utf-8",
              async: false,
              type: 'POST'
            })
          )
        });

        // console.log(resObjs.sdgpArr)

        var tempWordsArr;
        var allGottenObjs = [];
        //先遍历键
        for (var i = 0; i < Object.keys(resObjs).length; i++) {
          //四个接口中每一个接口的第i个数据的值
          currentKey = Object.keys(resObjs)[i];
          if (tempWordsArr === undefined) {
            tempWordsArr = [];
          } else {
            tempWordsArr = tempWordsArr
          }
          //将每个接口所得的值进行合并，每个索引对饮的条目合并为一个条目
          for (var j = 0; j < resObjs[currentKey].length; j++) {
            var currentObj = JSON.parse(resObjs[currentKey][j].responseText);
            allGottenObjs.push(currentObj);
          }

          // allAjaxDataArr.push(tempWordsArr.concat());
          // console.log(tempWordsArr);
          // console.log(allAjaxDataArr);
          // tempWordsArr=undefined;
        }

        var objGroup = [];
        // console.log(allGottenObjs);
        for (var i = 0; i < allGottenObjs.length; i++) {
          var sentenceCount = sentenceArr.length;//句子总量
          // var apiCount=allAjaxDataArr.length/sentenceArr.length//请求的接口数量
          //0，4，8，12
          //1，5，9，13
          //1,1+n,1+2n,1+3n
          for (var j = 0; j < sentenceCount; j++) {
            if (i % sentenceCount === j) {
              objGroup[j] === undefined ? objGroup[j] = [] : 0;
              objGroup[j].push(allGottenObjs[i]);
            }
          }
        }
        // console.log(objGroup);//一个数组，每个索引对应每条句子；需要把每个索引中的对象进行合并

        //每条句子预期返回的数据（需要由以上4次请求所得的数据合并而成）
        //该函数用于返回一个新对象
        function getTempObj() {
          return {
            offset:'',
            cont: '',
            id: '',
            ne: '',
            parent: '',
            pos: '',
            relate: '',
            sem: [],
            semparent: NaN,
            semrelate: ''
          }
        };
        var singleObjGroup = [];
        //此处尝试合并对象
        for (var i = 0; i < objGroup.length; i++) {
          //遍历当前对象数组中的每个索引
          // console.log(objGroup[i]);
          for (var j = 0; j < objGroup[i].length; j++) {
            var tempWord = { words: [] }
            for (var k = 0; k < objGroup[i][j].words.length; k++) {
              //遍历索引下每个词
              currentWord = objGroup[i][j].words[k];
              // console.log(currentWord);
              // console.log(objGroup[i][j].words[k])
              // 写死j
              // console.log(objGroup[i][2].words[k])

              var semObj = {
                semparent: objGroup[i][2].words[k].parent,
                semrelate: objGroup[i][2].words[k].relation
              }

              var singleWord = mergeObj(objGroup[i][0].words[k], objGroup[i][1].words[k], semObj, { sem: objGroup[i][2].words[k] }, objGroup[i][3].words[k], objGroup[i][4].words[k], objGroup[i][5].words[k])
              for (var m = 0; m < objGroup[i][3].nes.length; m++) {
                if (singleWord.id === objGroup[i][3].nes[m].offset) {
                  switch (objGroup[i][3].nes[m].ne) {
                    case 'nh': singleWord.ne = 'S-Nh'; break;
                    case 'ni': singleWord.ne = 'S-Ni'; break;
                    case 'ns': singleWord.ne = 'S-Ns'; break;
                  }
                }
              }

              // console.log(singleWord)
              var tempObj = getTempObj();
              tempObj.cont = singleWord.text;
              tempObj.id = singleWord.id;
              tempObj.ne = singleWord.ne;
              tempObj.parent = singleWord.parent;
              tempObj.pos = singleWord.pos;
              tempObj.relate = singleWord.relation;
              tempObj.sem = singleWord.parents;
              tempObj.offset=singleWord.offset;
              tempObj.semparent = singleWord.semparent;
              tempObj.semrelate = singleWord.semrelate;

              if (singleWord.roles.length > 0) {
                tempObj.arg = singleWord.roles;
                // console.log(tempObj.arg)
              }

              // console.log(tempObj)
              // 合并后的对象插入到singleObjGroup数组中。
              tempWord.words.push(tempObj)
              // console.log(tempWord)
            }
            singleObjGroup[i] === undefined ? singleObjGroup[i] = [] : 0;
            singleObjGroup[i].push(tempWord);

          }
        }
        //上方for循环次数过多导致目标数组中数组长度为预计长度的4倍，暂时做如下处理
        for (var i = 0; i < singleObjGroup.length; i++) {
          singleObjGroup[i].length = singleObjGroup[i].length / Object.keys(resObjs).length;
          for(var j=0;j<singleObjGroup[i][0].words.length;j++){
            if(singleObjGroup[i][0].words[j].arg){
              singleObjGroup[i][0].words[j].arg.forEach(function (item) {
                var postion = getPosition(item, singleObjGroup[i][0].words)
                item.beg = postion.beg
                item.end = postion.end
              })
            }
          }
        }
        var tempSingleObjGroup = JSON.parse(JSON.stringify(singleObjGroup));
        // console.log(tempSingleObjGroup);
        var newGroup = []
        for (var i = 0; i < tempSingleObjGroup.length; i++) {
          newGroup.push(tempSingleObjGroup[i][0]);
        }
        // console.log(JSON.stringify(newGroup));

        $.when.apply(this, newGroup).then(function () {
          var semgraphparserErr = false
          // if (ajaxArr.length === 1) {
          //   if (arguments[0] === '{}') semgraphparserErr = true
          //   resArr = [JSON.parse(arguments[0])]
          // } else {
          //   var resArr = [].map.call(arguments, function (item) {
          //     if (item[0] === '{}') semgraphparserErr = true
          //     return JSON.parse(item[0])
          //   })
          // }

          // JSON.stringify(resArr)
          var resArr = newGroup

          if (semgraphparserErr) {
            setTimeout(function functionName() {
              getData(semgraphparserErr, times++)
            }, 1000)
            return;
          }

          try {
            var returnVal = generateData(paragraphArr, resArr)
            // console.log(JSON.stringify(returnVal))
            returnAnalysisRst = returnVal;
            //sent view update
            readySentView();
            //xml view update
            readyXmlView(returnVal);
          } catch (e) {
            ajaxFailFun({ responseText: e.message }, '解析出错')
          }
        }, ajaxFailFun)
      })(false, 0)
    }

    function generateData(paragraphArr, resWordsArr) {
      var data = []
      var k = 0
      paragraphArr.forEach(function (item, i) {
        if (!data[i]) data[i] = []
        item.forEach(function (item, j) {
          data[i][j] = resWordsArr[k].words
          k++
        })
      })

      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
          var tmpArr = []
          for (var k = 0; k < data[i][j].length; k++) {
            var word = data[i][j][k]
            var tmp = {
              id: word.id,
              cont: word.cont,
              pos: word.pos,
              ne: word.ne,
              parent: word.parent,
              relate: word.relate,
              semparent: word.semparent,
              semrelate: word.semrelate,
              arg: word.arg || [],
              sem: word.sem || []
            }
            tmpArr.push(tmp)
          }
          data[i][j] = tmpArr
        }
      }

      return data
    }

    function ajaxFailFun(errorInfo, errorType) {
      console.log(errorInfo);
      loadingObj.innerHTML = ['<p class="text-error">',
        '发送分析请求失败！请点击<code>分析</code>重试.',
        '</p>'].join('');
      loadingObj.innerHTML += '<p>' + errorType;
      loadingObj.innerHTML += errorInfo.responseText;
      setTimeout(function() {
        isLoading = false
      })
    }

    //优化合并对象的函数，使其一次性可接受多个对象
    function mergeObj(objs) {
      if (objs === undefined || arguments.length === 0) { return {} }
      var obj3 = {}
      // for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
      // for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
      for (var i = 0; i < arguments.length; i++) {
        for (var attrname in arguments[i]) {
          obj3[attrname] = arguments[i][attrname]
        }
      }
      return obj3;
    }

    //ajax
    // $.ajax({
    //     url : targetURL,
    //     type : "POST",
    //     dataType : "json",
    //     data : postData,
    //     timeout : 10000 ,
    //     success : function (returnVal) {
    //         returnAnalysisRst = returnVal;
    //         //sent view update
    //         readySentView() ;
    //         //xml view update
    //         readyXmlView(returnVal) ;
    //     },
    //     error : function (errorInfo , errorType) {
    //         console.log(errorInfo);
    //         loadingObj.innerHTML = ['<p class="text-error">' ,
    //                                 '发送分析请求失败！请点击<code>分析</code>重试.' ,
    //         '</p>'].join('') ;
    //         loadingObj.innerHTML += '<p>' + errorType ;
    //         loadingObj.innerHTML += errorInfo.responseText ;
    //     }
    // });
    //update the UI : display the loading page
    return false;
  }

  readySentView = function () {
    initDom(DRAW_PARENT_ID, returnAnalysisRst); //init the sent view
    //update UI ! it is necessary to update it before drawing the canvas
    maskObj.style.display = "none";
    analysisPanel.style.display = "block";
    //active the sent view
    $("#sent-tab").tab('show');
    //! `lastOpendEle` is a global variable ! For switch animating !
    //~ first , make the first text item be the lastOpenedEle to init the draw state
    lastOpenedEle = document.getElementById(DRAW_PARENT_ID).getElementsByTagName("DIV")[0];
    //! draw canvas for first line .
    drawCanvas(lastOpenedEle);
    //! set label explanation panel content . according to current demo draw data .
    updateLabelExplanationPanelContent();
    //! important ! subsequent switching animate rely on this setting
    lastOpenedEle.parentNode.getElementsByTagName("CANVAS")[0].parentNode.style.height = CANVAS_HEIGHT + "px";
    // analysisBtn[0].removeAttribute("disabled");
    // analysisBtn.bind("click", startAnalysis);
  }

  readyParaView = function () {
    // has build a bad function ! - -
    selectParaPartToDrawByValue($("input[name=paraDisItem]:checked").val());
  }
  readyXmlView = function (returnJsonObj) {
    var xmlDOM = LTPRstParseJSON2XMLDOM(returnJsonObj),
      str = parseXMLDOM2String(xmlDOM),
      formatedStr = formatDOMStrForDisplay(str);
    $("#xml_area").val(formatedStr);
  }

  setLoadingPos = function () {
    var parentNode = maskObj,
      pWidth = parentNode.offsetWidth,
      left;
    if (pWidth != 0) {
      left = (pWidth - loadingObj.offsetWidth) / 2;
      loadingObj.style.left = left + "px";
    }
  }
  //---------------Event Bind----------------
  analysisBtn.bind("click", startAnalysis);
  $("#viewTab a").click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    var targetId = e.target.getAttribute("id");
    //! If change to other tab except for sent-tab , we close the panel to restore the main content .
    if (targetId != "sent-tab") labelExplanationPanel.closePanel();
    if (targetId == "para-tab") selectParaPartToDrawByValue($("input[name=paraDisItem]:checked").val());
  });

  $(sentSelectDomObj).bind("change", function () {
    $("#inputText").val(SELECT_SENTS[$(this).val()]);
  })

  $("#load-local-xml-btn").bind("click", function (e) {
    var localXML = parseString2XMLDOM($("#xml_area").val()),
      localJson = LTPRstParseXMLDOM2JSON(localXML);
    if (localJson != [] && localJson != undefined) {
      returnAnalysisRst = localJson;
      readySentView();
    }
    return false;
  })
  $(window).bind("resize", function (e) {
    if (demo != null) {
      demo.move(0, 0);
    }
    setLoadingPos();
  });
  //----------------First Call--------------------------
  initNerIntro();
  $("#inputText").val(SELECT_SENTS[sentSelectDomObj.value]);
});

function getPosition (word, arr) {
  var position = {}
  for (let i = 0; i < arr.length; i++) {
    var item = arr[i]
    if (word.offset === item.offset) position.beg = i
    if (word.offset + word.length === item.offset + item.cont.length) position.end = i
  }
  return position
}
