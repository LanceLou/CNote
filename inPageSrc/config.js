import uuidV4 from 'uuid/v4';
const defconfig = {
  width: 220,
  height: 180
};

// 每块note设置独立化，不存在全局的用户设置和存储
const getInitAllNoteList = () => {
  let pageUrl = window.location.href;
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.get(pageUrl + 'note_list', function (data) {
      if (data) {
        resolve(data[pageUrl + 'note_list']);
      } else {
        reject(false);
      }
    });
  });
};

/**
 * 存储当前的noteList对象
 */
const saveNoteList = (noteList) => {
  let pageUrl = window.location.href;
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.set({
      [pageUrl + 'note_list']: noteList
    }, function (res) {
      console.log('saved success');
    });
  });
}

// 获取note落地的随机位置
const getRandomPos = () => {
  let scrollTop = window.scrollY;
  return {
    top: scrollTop + Math.random() * 50,
    right: Math.random() * 50
  };
};

/**
 * 根据用户config创建一个note描述对象
 * @param {*} config 
 */
function createNoteObj() {
  var lingGredentBGCIndex = Math.floor(Math.random() * 6);
  var defaultConfig = {
    id: uuidV4(),
    content: '',
    lingGredentBGCIndex: lingGredentBGCIndex,
    width: defconfig.width,
    height: defconfig.height,
    pos: getRandomPos(),  //页面位置
    editLastTime: new Date().getTime(),
    archTargetPos: {top: 0, left: 0},  //未知参数，暂存
    isSetTarget: false //未知参数，暂存
  };
  return Object.assign(defaultConfig);
}

export {createNoteObj, saveNoteList, getInitAllNoteList};

