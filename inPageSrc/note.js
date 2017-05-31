import {createNoteObj, saveNoteList, getInitAllNoteList} from './config';
import {ElementClassNameUtil, throttle} from './util';
import ElementMouseMove from './mouseDownMove';
import dateFormat from './dateFormat';

const lingGredentBGC = [
  'linear-gradient(to bottom, #DAFFA7, #A5FF65)',
  'linear-gradient(to bottom, #C0D7FF, #86A3FF)',
  'linear-gradient(to bottom, #F3D7FF, #E29EFF)',
  'linear-gradient(to bottom, #FFC9FA, #FF87F6)',
  'linear-gradient(to bottom, #E7E7E7, #B6B6B6)',
  'linear-gradient(to bottom, #D6F7FF, #8FE4FF)'
];
// 调用者自行管理，config不保存这些信息
// 键为唯一值ID, 所有配置信息列表
let noteList = {};
// note dom列表，id为键
const noteDomList = {};
// note 设置dom列表
const noteSetDomList = {};
// note edit eventLis list
const noteDomEditEventLisList = {};
// note setting react eventLis list
const noteDomRectSetEventLisList = {};

/**
 * 根据storage读取的noteList初始化界面上的DOM
 * @param {*} noteList 
 */
const initNoteListByStorage = () => {
  // //--------------------for test--------------------
  // let noteListArr = [];
  // noteListArr.push(createNoteObj());
  // noteListArr.push(createNoteObj());
  // //--------------------for test--------------------
  getInitAllNoteList().then(function(res){
    // let noteDom = null;
    // 可直接存储结构化数据，而不需序列化
    // 开始数据填充
    res = res || {};
    for(let key in res){
      noteList[key] = res[key];
      document.body.appendChild(createANote(res[key]));
    }
    // 发送初始化信息给background环境，表示，页面note初始化
    sendNoteInitMessage();
  }, function(error){
    console.log('storage read error', error);
  });
};

/**
 * 创建note setting dom
 * @param {*} config 
 */
const createNoteSettingDom = (config) => {
  let settingDom = document.createElement('div');
  let htmlTemplate = `
        <form action="">
          <label class="item-label">纸张颜色</label>
          <div class="lc_color_panel" data-id="${config.id}">
            <span class="lc_color_k1 ${config.lingGredentBGCIndex === 0 ? "selected" : ""}" data-index="0">√</span>
            <span class="lc_color_k2 ${config.lingGredentBGCIndex === 1 ? "selected" : ""}" data-index="1">√</span>
            <span class="lc_color_k3 ${config.lingGredentBGCIndex === 2 ? "selected" : ""}" data-index="2">√</span>
            <span class="lc_color_k4 ${config.lingGredentBGCIndex === 3 ? "selected" : ""}" data-index="3">√</span>
            <span class="lc_color_k5 ${config.lingGredentBGCIndex === 4 ? "selected" : ""}" data-index="4">√</span>
            <span class="lc_color_k6 ${config.lingGredentBGCIndex === 5 ? "selected" : ""}" data-index="5">√</span>
          </div>
          <label class="item-label">纸张大小</label>
          <div class="sizeSet" data-id="${config.id}">
            <label for="">长(width):</label> <input type="text" name="width" value="${config.width}">
            <label for="">高(height):</label> <input type="text" name="height" value="${config.height}">
          </div>
        </form>
        <button class="btn-setOk" data-id="${config.id}">完成</button>`;
    settingDom.innerHTML = htmlTemplate;
    settingDom.className = 'lc_noteSet';
    settingDom.style.cssText = `width: ${config.width}px; height: ${config.height}px; top: ${config.pos.top}px; right: ${config.pos.right}px`;
    noteSetDomList[config.id] = settingDom;
    initRectSettingEventLis(config.id);
    return settingDom;
};

/**
 * 创建note dom
 * @param {*} config 
 */
const createNoteDom = (config) => {
  let note = document.createElement('div');
  let html = `<div class="lc_note_item_header" data-id="${config.id}">
                <span class="btn-delete">×</span>
                <span class="btn-close">-</span>
              </div>
              <div class="lc_note_item_body" contenteditable="true">${config.content}</div>
              <div class="lc_note_item_footer">Edit in ${dateFormat(new Date(config.editLastTime), 'yyyy/mm/dd')}
                <a class="set" data-id="${config.id}"></a>
              </div>`;
  note.innerHTML = html;
  note.className = 'lc_note_item';
  note.setAttribute('data-id', config.id);
  note.style.cssText = `background: ${lingGredentBGC[config.lingGredentBGCIndex]}; width: ${config.width}px; height: ${config.height}px; top: ${config.pos.top}px; right: ${config.pos.right}px`;
  noteDomList[config.id] = note;
  return note;
};

/**
 * 创建一个note dom，包括其设置界面的dom
 * @param {*} config 
 */
const createANote = (config) => {
  let container = document.createElement('div');
  container.className = 'noteContainer';
  container.appendChild(createNoteDom(config));
  container.appendChild(createNoteSettingDom(config));
  initNoteDomContentEditListener(config.id);
  bindNoteToMousemove(config.id);
  return container;
};

/**
 * 将note进行鼠标拖动绑定，同时进行set dom对应的dom同步移动
 * @param {*} id 
 */
const bindNoteToMousemove = (id) => {
  let noteDom = noteDomList[id];
  let noteSetDom = noteSetDomList[id];
  let mouseMoveObj = new ElementMouseMove(document.body, noteDom, noteDom);
  mouseMoveObj.addMoveListenerCallback(data => {
    noteSetDom.style.left = data.x + 'px';
    noteSetDom.style.top = data.y + 'px';
    updateNotePosition(id, data);
  });
};

/**
 * 无参型note创建函数，主要用于外部调用创建一个note
 * 
 */
const createNote = () => {
  var config = createNoteObj();
  noteList[config.id] = config;
  document.body.appendChild(createANote(config));
  // 存储最新的数据
  saveNoteList(noteList);
}

/**
 * 旋转指定note至setting界面('背面')
 * @param {*} id
 */
const rotateToSetting = (id) => {
  let noteDom = noteDomList[id];
  let noteSetDom = noteSetDomList[id];

  ElementClassNameUtil.removeClassName(noteDom, 'lc_noteItem_show');
  ElementClassNameUtil.removeClassName(noteSetDom, 'lc_noteSet_hidden');
  
  ElementClassNameUtil.addClassName(noteDom, 'lc_noteItem_rotate_toHidden');
  ElementClassNameUtil.addClassName(noteSetDom, 'lc_noteSet_rotate_toShow');
  setTimeout(function(){
    // 动画结束，去除动画过度class
    ElementClassNameUtil.removeClassName(noteDom, 'lc_noteItem_rotate_toHidden');
    ElementClassNameUtil.removeClassName(noteSetDom, 'lc_noteSet_rotate_toShow');  

    // 设置当前状态class
    ElementClassNameUtil.addClassName(noteDom, 'lc_noteItem_hidden');
    ElementClassNameUtil.addClassName(noteSetDom, 'lc_noteSet_show');
  }, 670);
};

/**
 * 旋转指定note至note的display界面
 * @param {*} id 
 */
const rotateToNoteDisplay = (id) => {
  let noteDom = noteDomList[id];
  let noteSetDom = noteSetDomList[id];

  ElementClassNameUtil.removeClassName(noteDom, 'lc_noteItem_hidden');
  ElementClassNameUtil.removeClassName(noteSetDom, 'lc_noteSet_show');

  ElementClassNameUtil.addClassName(noteDom, 'lc_noteItem_rotate_toShow');
  ElementClassNameUtil.addClassName(noteSetDom, 'lc_noteSet_rotate_toHidden');
  setTimeout(function() {
    // 动画结束，去除原动画过度class
    ElementClassNameUtil.removeClassName(noteDom, 'lc_noteItem_rotate_toShow');
    ElementClassNameUtil.removeClassName(noteSetDom, 'lc_noteSet_rotate_toHidden');

    // 设置当前状态class
    ElementClassNameUtil.addClassName(noteDom, 'lc_noteItem_show');
    ElementClassNameUtil.addClassName(noteSetDom, 'lc_noteSet_hidden');

    setHandler({type: 'save', id: id});
  }, 670);
};

/**
 * 更新noteList, 更新对应的note dom以及set dom
 * @param {*} config 
 * @param {*} id 
 */
const updateNote = (config, id) => {
  if (!config) return;
  let originConfig = noteList[id];
  // 更新dom
  Object.keys(config).map(key => {
    if (key === 'lingGredentBGCIndex'){
      noteDomList[id].style.background = lingGredentBGC[config[key]];
    }else if (key === 'width'){
      noteDomList[id].style.width = noteSetDomList[id].style.width = config[key] + 'px';
    }else if (key === 'height'){
      noteDomList[id].style.height = noteSetDomList[id].style.height = config[key] + 'px';
    }
  });
  config = Object.assign({}, noteList[id], config);
  noteList[id] = config;
  // 存储最新的数据
  saveNoteList(noteList);
}

/**
 * 用户输入，更新当前note by id 同时部署函数节流
 * 最后更改时间不进行dom同步更新，只进行保存，页面reload时进行展示
 * @param {*} content 
 * @param {*} id 
 */
const updateNoteContent = throttle((content, id) => {
  noteList[id].content = content;
  noteList[id].editLastTime = new Date().getTime();

  // save content
  saveNoteList(noteList);
}, 500);

/**
 * 移除一个note by id，分别从配置List，dom List，dom set List中移除
 * @param {*} id 
 */
const removeANote = (id) => {
  let targetNote = noteDomList[id];
  let targetSetNote = noteSetDomList[id];
  // delete dom
  targetNote.parentNode.removeChild(targetNote);
  targetSetNote.parentNode.removeChild(targetSetNote);
  // 清除事件监听
  noteDomEditEventLisList[id]();
  // delete data
  delete noteList[id];
  delete noteDomList[id];
  delete noteSetDomList[id];

  // save delete
  saveNoteList(noteList);
  sendNoteDeleteMessage();
};

const editHandler = (event) => {
  let target = event.target;
  updateNoteContent(target.innerHTML, target.previousElementSibling.getAttribute('data-id'));
};
const initNoteDomContentEditListener = (id) => {
  noteDomList[id].addEventListener('keyup', editHandler);
  noteDomEditEventLisList[id] = () => {
    noteDomList[id].removeEventListener('focus', editHandler);
  }
};

// setting event management
const setHandler = (() => {
  const customConfigTemp = {};

  const chooseColor = (colorId, id) => {
    customConfigTemp[id] = customConfigTemp[id] || {};
    customConfigTemp[id].lingGredentBGCIndex = colorId;

    // 更新dom
    let noteSettindDom = noteSetDomList[id];
    let panes = noteSettindDom.querySelectorAll('span');
    ElementClassNameUtil.removeClassName(noteSettindDom.querySelector('span.selected'), 'selected');
    ElementClassNameUtil.addClassName(panes[colorId], 'selected');
  }
  const setRect = (name, value, id) => {
    customConfigTemp[id] = customConfigTemp[id] || {};
    customConfigTemp[id][name] = value;
  }
  const save = (id) => {
    updateNote(customConfigTemp[id], id);
  }
  return (event) => {
    let target = event.target;
    // 此处进行派发
    switch(event.type){
      case 'change':
        setRect(target.name, target.value, target.parentNode.getAttribute('data-id'));
        break;
      case 'click':
        if (/[\w]*lc_color_k[\w]*/.test(target.className)){
          chooseColor(target.getAttribute('data-index'), target.parentNode.getAttribute('data-id'));
        }
        break;
      case 'save':
        save(event.id);
    }
  };
})();
const updateNotePosition = throttle((id, pos) => {
  noteList[id].pos.top = pos.y;
  noteList[id].pos.right = document.body.getBoundingClientRect().width - pos.x - noteList[id].width;
  saveNoteList(noteList);
}, 300);
const initRectSettingEventLis = (id) => {
  let inputs = noteSetDomList[id].querySelectorAll('input');
  let callbacks = [];
  Array.prototype.map.call(inputs, (input) => {
    input.addEventListener('change', setHandler);
    callbacks.push(() => {input.removeEventListener('change', setHandler);});
  });
  // noteSetDomList[id].addEventListener('change', setHandler);
  noteDomRectSetEventLisList[id] = () => {
    callbacks.map(function(cb){
      cb();
    });
  }
};

const getNoteListLength = () => {
  return Object.keys(noteList).length;
};

const sendNoteDeleteMessage = () => {
  chrome.runtime.sendMessage(null, {type: 'noteDelete', num: getNoteListLength()});
};
const sendNoteInitMessage = () => {
  chrome.runtime.sendMessage(null, {type: 'noteInit', num: getNoteListLength()});
}

export {initNoteListByStorage, updateNote, createNote, rotateToSetting, rotateToNoteDisplay, updateNoteContent, removeANote, setHandler, getNoteListLength};
