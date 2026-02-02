// 팝업 닫기 공통 모듈
(function() {
  'use strict';
  
  // 설정 옵션
  const config = {
    closeBtnSelectors: '.pop_tit .btn_cross, .pop_foot .btn_cancel',
    ignoreSubmitSelectors: '.search_form', // submit 무시할 form
    enableEscKey: true,  // esc키로 닫기 여부
    onBeforeClose: null, // 닫기 전 콜백
    onAfterClose: null   // 닫기 후 콜백
  };
  
  // 팝업 닫기 함수
  function closePopup(dialogElement, triggerCallbacks) {
    if (!dialogElement || dialogElement.tagName !== 'DIALOG') {
      return false;
    }
    
    // 닫기 전 콜백 실행
    if (triggerCallbacks && config.onBeforeClose) {
      const shouldClose = config.onBeforeClose(dialogElement);
      if (shouldClose === false) return false;
    }
    
    dialogElement.close();
    
    // 닫기 후 콜백 실행
    if (triggerCallbacks && config.onAfterClose) {
      config.onAfterClose(dialogElement);
    }
    
    return true;
  }
  
  // 클릭 이벤트 처리
  document.addEventListener('click', function(e) {
    const target = e.target;
    
    // 설정된 선택자와 매칭되는지 확인
    if (target.matches(config.closeBtnSelectors)) {
      const dialog = target.closest('dialog');
      
      if (dialog && dialog.hasAttribute('open')) {
        e.preventDefault();
        closePopup(dialog, true);
      }
    }
  });
  
  // submit 이벤트 처리 - 검색 form은 제외
  document.addEventListener('submit', function(e) {
    const form = e.target;
    
    // 무시할 form인지 체크
    if (form.matches(config.ignoreSubmitSelectors)) {
      console.log
      return; // 검색 form은 그냥 진행
    }
    
    // 팝업 내부의 submit인 경우만 처리
    const dialog = form.closest('dialog');
    if (dialog && dialog.hasAttribute('open')) {
      // 적용 버튼 등의 submit은 팝업을 닫음
      e.preventDefault();
      // form 데이터 처리 후 닫기
      // TODO: 여기서 form 데이터 처리 로직 추가 가능
      closePopup(dialog, true);
    }
  });
  
  // ESC 키 처리
  if (config.enableEscKey) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const openDialogs = document.querySelectorAll('dialog[open]');
        openDialogs.forEach(function(dialog) {
          closePopup(dialog, true);
        });
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
    }
  };
  
})();