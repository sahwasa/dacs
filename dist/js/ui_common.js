/**
 * ============================================================================
 * PopupManager - Dialog 팝업 닫기 공통 모듈
 * ============================================================================
 * 
 * @description
 * dialog 요소의 닫기 기능을 통합 관리하는 공통 모듈입니다.
 * 닫기 버튼 클릭, ESC 키, 프로그래밍 방식 닫기를 지원하며,
 * 팝업별로 beforeClose/afterClose 콜백을 설정할 수 있습니다.
 * 
 * @author [AI님]
 * @since 2024-02-02
 * @version 1.0.0
 * 
 * ============================================================================
 * 필수 HTML 구조
 * ============================================================================
 * <dialog id="myDialog">
 *   <div class="pop_tit">
 *     <h2>팝업 제목</h2>
 *     <button class="btn_cross">닫기</button>
 *   </div>
 *   <div class="pop_cont">
 *     <!-- 팝업 내용 -->
 *   </div>
 *   <div class="pop_foot">
 *     <button class="btn_cancel">취소</button>
 *     <button class="btn_confirm">확인</button>
 *   </div>
 * </dialog>
 * 
 * ============================================================================
 * 기본 사용법
 * ============================================================================
 * 
 * 1. 팝업 열기
 *    document.getElementById('myDialog').showModal();
 * 
 * 2. 팝업 닫기 (프로그래밍 방식)
 *    PopupManager.close('myDialog');
 *    또는
 *    const dialog = document.querySelector('dialog[open]');
 *    PopupManager.close(dialog);
 * 
 * 3. 닫기 버튼으로 닫기
 *    .btn_cross 또는 .btn_cancel 버튼 클릭 시 자동으로 닫힘
 * 
 * 4. ESC 키로 닫기
 *    팝업이 열려있을 때 ESC 키를 누르면 자동으로 닫힘
 * 
 * ============================================================================
 * 콜백 설정
 * ============================================================================
 * 
 * 방법 1: setCallback으로 미리 설정 (권장 - 닫기 버튼에도 적용됨)
 * -------
 * PopupManager.setCallback('myDialog', {
 *   beforeClose: function(dialog) {
 *     console.log('닫기 전 실행');
 *     return confirm('정말 닫으시겠습니까?'); // false 반환 시 닫기 취소
 *   },
 *   afterClose: function(dialog) {
 *     console.log('닫은 후 실행');
 *     dialog.querySelector('form').reset();
 *   }
 * });
 * 
 * 방법 2: close 호출 시 직접 전달 (특정 상황에서만 사용)
 * -------
 * document.getElementById('saveBtn').addEventListener('click', function() {
 *   PopupManager.close('myDialog', {
 *     beforeClose: function(dialog) {
 *       console.log('저장 버튼으로 닫기');
 *       return true;
 *     },
 *     afterClose: function(dialog) {
 *       alert('저장되었습니다!');
 *     }
 *   });
 * });
 * 
 * 방법 3: 공통 콜백 재사용 (ui_temp.js 참고)
 * -------
 * PopupManager.setCallback('editDialog', {
 *   ...commonCallbacks.confirmClose,  // 닫기 확인
 *   ...commonCallbacks.formReset      // 폼 초기화
 * });
 * 
 * ============================================================================
 * 설정 변경
 * ============================================================================
 * 
 * 1. 닫기 버튼 선택자 변경
 *    PopupManager.config.closeBtnSelectors = '.close-btn, .btn-close';
 *    PopupManager.refresh(); // 변경 후 반드시 호출!
 * 
 * 2. ESC 키 비활성화
 *    PopupManager.config.enableEscKey = false;
 * 
 * 3. 동적으로 추가된 팝업에 이벤트 재바인딩
 *    PopupManager.refresh();
 * 
 * ============================================================================
 * API 메서드
 * ============================================================================
 * 
 * PopupManager.close(dialogId, options)
 *   - 팝업을 닫습니다
 *   - @param {string|HTMLElement} dialogId - 팝업 ID 또는 dialog 요소
 *   - @param {Object} options - beforeClose, afterClose 콜백
 *   - @return {boolean} 성공 여부
 * 
 * PopupManager.setCallback(dialogId, options)
 *   - 팝업별 콜백을 설정합니다
 *   - @param {string} dialogId - 팝업 ID
 *   - @param {Object} options - beforeClose, afterClose 콜백
 * 
 * PopupManager.removeCallback(dialogId)
 *   - 설정된 콜백을 제거합니다
 *   - @param {string} dialogId - 팝업 ID
 * 
 * PopupManager.refresh()
 *   - 닫기 버튼에 이벤트를 재바인딩합니다
 *   - config.closeBtnSelectors 변경 후 또는 동적 팝업 추가 시 호출
 * 
 * PopupManager.config
 *   - closeBtnSelectors: 닫기 버튼 CSS 선택자
 *   - enableEscKey: ESC 키 활성화 여부
 * 
 * ============================================================================
 * 실전 예시
 * ============================================================================
 * 
 * // 예시 1: 입력 폼 팝업 (저장 확인)
 * PopupManager.setCallback('editForm', {
 *   beforeClose: function(dialog) {
 *     const input = dialog.querySelector('input');
 *     if (input && input.value) {
 *       return confirm('저장하지 않고 닫으시겠습니까?');
 *     }
 *     return true;
 *   },
 *   afterClose: function(dialog) {
 *     dialog.querySelector('form').reset();
 *   }
 * });
 * 
 * // 예시 2: 삭제 확인 후 새로고침
 * PopupManager.setCallback('deleteConfirm', {
 *   afterClose: function(dialog) {
 *     if (dialog.dataset.confirmed === 'true') {
 *       location.reload();
 *     }
 *   }
 * });
 * 
 * // 예시 3: 저장 버튼 클릭 시 (admin_code 샘플 참고)
 * $('#p_codeAdmin').on('click', 'button[type="submit"]', function() {
 *   // 저장 로직 실행...
 *   
 *   PopupManager.close('p_codeAdmin', {
 *     beforeClose: function(dialog) {
 *       console.log(dialog.id + ' : 서브밋 전 실행');
 *       return true;
 *     },
 *     afterClose: function(dialog) {
 *       console.log(dialog.id + ' : 서브밋 후 실행');
 *     }
 *   });
 * });
 * 
 * ============================================================================
 * 주의사항
 * ============================================================================
 * - dialog 요소만 지원합니다
 * - beforeClose에서 false를 반환하면 팝업이 닫히지 않습니다
 * - setCallback으로 설정한 콜백은 닫기 버튼, ESC 키에도 적용됩니다
 * - close()로 전달한 콜백은 해당 호출에만 적용되며, 설정된 콜백과 병합됩니다
 * - config 변경 후에는 반드시 PopupManager.refresh()를 호출하세요
 * 
 * ============================================================================
 */

(function() {
  'use strict';
  
  // 설정 옵션
  const config = {
    closeBtnSelectors: '.pop_tit .btn_cross, .pop_foot .btn_cancel',
    enableEscKey: true
  };
  
  // 팝업별 콜백 저장소
  const popupCallbacks = new Map();

  // 이벤트 핸들러 저장용
  const eventHandlers = new Map();
  
  /**
   * 팝업 닫기 함수
   * @param {HTMLElement} dialogElement - dialog 요소
   * @param {Object} options - beforeClose, afterClose 콜백 객체
   * @return {boolean} 닫기 성공 여부
   */
  function closePopup(dialogElement, options) {
    if (!dialogElement || dialogElement.tagName !== 'DIALOG') {
      return false;
    }   

    options = options || {};

    // beforeClose 콜백 실행
    if (options.beforeClose && typeof options.beforeClose === 'function') {
      const shouldClose = options.beforeClose(dialogElement);
      if (shouldClose === false) return false;
    }
    
    dialogElement.close();
    
    // afterClose 콜백 실행
    if (options.afterClose && typeof options.afterClose === 'function') {
      options.afterClose(dialogElement);
    }
    
    return true;
  }
  
  /**
   * 클릭 이벤트 핸들러
   */
  function handleCloseClick(e) {
    const dialog = e.currentTarget.closest('dialog');
    
    if (dialog && dialog.hasAttribute('open')) {
      e.preventDefault();
      
      const callbacks = popupCallbacks.get(dialog.id);
      closePopup(dialog, callbacks);
    }
  }
  
  /**
   * 클릭 이벤트 바인딩 해제
   */
  function unbindCloseButtons() {
    eventHandlers.forEach(function(handler, btn) {
      btn.removeEventListener('click', handler);
    });
    eventHandlers.clear();
  }
  
  /**
   * 클릭 이벤트 바인딩
   */
  function bindCloseButtons() {
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
            const callbacks = popupCallbacks.get(dialog.id);
            closePopup(dialog, callbacks);
          });
        }
      }
    });
  }
  
  /**
   * PopupManager 전역 객체
   */
  window.PopupManager = {
    config: config,
    
    /**
     * 팝업 닫기
     * @param {string|HTMLElement} dialogId - 팝업 ID 또는 dialog 요소
     * @param {Object} options - beforeClose, afterClose 콜백
     * @return {boolean} 닫기 성공 여부
     */
    close: function(dialogId, options) {
      const dialog = typeof dialogId === 'string' 
        ? document.getElementById(dialogId) 
        : dialogId;
      
      const savedCallbacks = popupCallbacks.get(dialog?.id);
      const mergedOptions = savedCallbacks 
        ? Object.assign({}, savedCallbacks, options)
        : options || {};
      
      return closePopup(dialog, mergedOptions);
    },
    
    /**
     * 닫기 버튼 이벤트 재바인딩
     * config 변경 후 또는 동적 팝업 추가 시 호출
     */
    refresh: bindCloseButtons,
    
    /**
     * 팝업별 콜백 설정
     * @param {string} dialogId - 팝업 ID
     * @param {Object} options - beforeClose, afterClose 콜백
     */
    setCallback: function(dialogId, options) {
      popupCallbacks.set(dialogId, options);
    },
    
    /**
     * 팝업별 콜백 제거
     * @param {string} dialogId - 팝업 ID
     */
    removeCallback: function(dialogId) {
      popupCallbacks.delete(dialogId);
    }
  };
  
})();