// 글로벌 로딩 오버레이 관리
const LoadingOverlay = {
  element: null,
  activeRequests: 0,

  init() {
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.id = 'ajax-loading-overlay';
      this.element.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        z-index: 9999;
        cursor: wait;
        display: none;
      `;
      document.body.appendChild(this.element);
    }
  },

  show() {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.element.style.display = 'block';
    }
  },

  hide() {
    this.activeRequests--;
    if (this.activeRequests === 0) {
      this.element.style.display = 'none';
    }
  }
};

// 초기화
LoadingOverlay.init();

// jQuery AJAX 글로벌 이벤트 (jQuery 사용 시)
$(document).ajaxStart(function() {
  LoadingOverlay.show();
}).ajaxComplete(function() {
  LoadingOverlay.hide();
});

// 또는 fetch API 래퍼 (바닐라 JS 사용 시)
const originalFetch = window.fetch;
window.fetch = function(...args) {
  LoadingOverlay.show();
  return originalFetch.apply(this, args)
    .finally(() => {
      LoadingOverlay.hide();
    });
};