// 팝업 닫기 공통 모듈
(function() {
  'use strict';
  
  // 설정 옵션
  const config = {
    closeBtnSelectors: '.pop_tit .btn_cross, .pop_foot .btn_cancel',
    enableEscKey: true,  // esc키로 닫기 여부
    onBeforeClose: null, // 닫기 전 콜백
    onAfterClose: null   // 닫기 후 콜백
  };
  
  // 이벤트 핸들러 저장용
  const eventHandlers = new Map();
  console.log(eventHandlers)
  
  // 팝업 닫기 함수
  function closePopup(dialogElement, triggerCallbacks) {
    if (!dialogElement || dialogElement.tagName !== 'DIALOG') {
      return false;
    }    
    // 닫기 전 콜백 실행
    if (triggerCallbacks && typeof config.onBeforeClose === 'function') {
      const shouldClose = config.onBeforeClose(dialogElement);
      if (shouldClose === false) return false;
    }    
    dialogElement.close();
    
    // 닫기 후 콜백 실행
    if (triggerCallbacks && typeof config.onAfterClose === 'function') {
      config.onAfterClose(dialogElement);
    }    
    return true;
  }
  
  // 클릭 핸들러
  function handleCloseClick(e) {
    const dialog = e.currentTarget.closest('dialog');
    
    if (dialog && dialog.hasAttribute('open')) {
      e.preventDefault();
      closePopup(dialog, true);
    }
  }
  
  // 클릭 이벤트 바인딩 해제
  function unbindCloseButtons() {
    eventHandlers.forEach(function(handler, btn) {
      btn.removeEventListener('click', handler);
    });
    eventHandlers.clear();
  }
  
  // 클릭 이벤트 바인딩
  function bindCloseButtons() {
    // 기존 바인딩 해제
    unbindCloseButtons();
    
    const closeButtons = document.querySelectorAll(config.closeBtnSelectors);
    
    closeButtons.forEach(function(btn) {
      btn.addEventListener('click', handleCloseClick);
      eventHandlers.set(btn, handleCloseClick);
    });
  }
  
  // 초기 바인딩
  bindCloseButtons();
  
  // ESC 키 처리
  if (config.enableEscKey) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const openDialogs = document.querySelectorAll('dialog[open]');
        
        if (openDialogs.length > 0) {
          openDialogs.forEach(function(dialog) {
            closePopup(dialog, true);
          });
        }
      }
    });
  }
  
  // 외부에서 설정 변경 가능하도록 전역 객체 노출
  window.PopupManager = {
    config: config,
    close: function(dialogId) {
      const dialog = typeof dialogId === 'string' 
        ? document.getElementById(dialogId) 
        : dialogId;
      return closePopup(dialog, true);
    },
    refresh: bindCloseButtons  // 동적으로 추가된 버튼에 이벤트 재바인딩
  };
  
})();