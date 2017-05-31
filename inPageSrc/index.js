/**
 * ------------------------------
 * 页面入口函数，初始化整个proj啦啦
 * @author LanceLou
 * ------------------------------
 */
import {initNoteListByStorage, updateNote, createNote, rotateToSetting, rotateToNoteDisplay, updateNoteContent, removeANote, setHandler, getNoteListLength} from './note';

/**
 * 设置按钮点击handler
 * @param {*} target 
 */
const setClickHandler = (target) => {
  rotateToSetting(target.getAttribute('data-id'));
};

/**
 * 关闭设置窗口handler
 * @param {*} target 
 */
const closeSetHandler = (target) => {
  rotateToNoteDisplay(target.getAttribute('data-id'));
};

/**
 * 添加note handler
 * @param {*} target 
 */
const addNoteHandler = (target) => {

}

const initEventLis = () => {
  // popup图标点击事件监听 from chrome
  /**/
  // createNote();
  // createNote();
  chrome.runtime.onMessage.addListener(function(data, dender, sendResponse){
    createNote();
    sendResponse({type: 'noteAdd', "num": getNoteListLength()});
  });
  
  // 全局范围监听点击事件
  document.body.addEventListener('click', function(event){
    let target = event.target;
    if (/[\w]*lc_color_k[\w]*/.test(target.className)){
      setHandler(event);
    }
    switch(target.className) {
      case 'set':
        setClickHandler(target);
        break;
      case 'btn-setOk':
        closeSetHandler(target);
        break;
      case 'btn-delete':
        removeANote(target.parentNode.getAttribute('data-id'));
        break;
    }
  });

  // document.body.addEventListener('change', function(event){
  //   console.log(event.target);
  // });
};
const init = () => {
  initNoteListByStorage();
  initEventLis();
}

init();
