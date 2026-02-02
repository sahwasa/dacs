# ui_common.js 설명

## 스크립트 포함
```html
<script src="ui_common.js"></script>
```

## 모듈 종류

- PopupManager : dialog 요소를 위한 팝업 닫기 공통 모듈입니다.

## 1. PopupManager

dialog 요소를 위한 팝업 닫기 공통 모듈입니다.

### 주요 기능

- 닫기 버튼 클릭 시 팝업 닫기
- ESC 키로 팝업 닫기
- 닫기 전/후 콜백 함수 지원
- 프로그래밍 방식으로 팝업 제어

### 기본 사용법

#### 1. HTML 구조
```html
<dialog id="myDialog">
  <div class="pop_tit">
    <h2>팝업 제목</h2>
    <button class="btn_cross">닫기</button>
  </div>
  <div class="pop_cont">
    <!-- 팝업 내용 -->
  </div>
  <div class="pop_foot">
    <button class="btn_cancel">취소</button>
    <button class="btn_confirm">확인</button>
  </div>
</dialog>
```

#### 2. 팝업 열기
```javascript
document.getElementById('myDialog').showModal();
```

#### 3. 설정 옵션

##### closeBtnSelectors
닫기 버튼 CSS 선택자 (기본값: `'.pop_tit .btn_cross, .pop_foot .btn_cancel'`)
```javascript
PopupManager.config.closeBtnSelectors = '.close-btn, .btn-close';
PopupManager.refresh(); // 변경 후 반드시 호출
```

##### enableEscKey
ESC 키로 팝업 닫기 활성화 여부 (기본값: `true`)
```javascript
PopupManager.config.enableEscKey = false; // ESC 키 비활성화
```

##### onBeforeClose
팝업이 닫히기 전에 실행되는 콜백 함수
```javascript
PopupManager.config.onBeforeClose = function(dialog) {
  // false를 반환하면 팝업이 닫히지 않음
  return confirm('정말 닫으시겠습니까?');
};
```

##### onAfterClose
팝업이 닫힌 후에 실행되는 콜백 함수
```javascript
PopupManager.config.onAfterClose = function(dialog) {
  console.log('팝업이 닫혔습니다:', dialog.id);
  
  // 폼 초기화
  const form = dialog.querySelector('form');
  if (form) form.reset();
};
```

#### API

##### PopupManager.close(dialogId)
프로그래밍 방식으로 팝업 닫기
```javascript
// ID로 닫기
PopupManager.close('myDialog');

// 엘리먼트로 닫기
const dialog = document.querySelector('dialog[open]');
PopupManager.close(dialog);
```

##### PopupManager.refresh()
동적으로 추가된 닫기 버튼에 이벤트 재바인딩
```javascript
// 새로운 팝업을 동적으로 추가한 경우
document.body.insertAdjacentHTML('beforeend', '<dialog>...</dialog>');
PopupManager.refresh();
```

#### 사용 예시

##### 1. 기본 사용
```javascript
// 별도 설정 없이 기본 기능만 사용
document.getElementById('openBtn').addEventListener('click', function() {
  document.getElementById('myDialog').showModal();
});
```

##### 2. 닫기 전 콜백
```javascript
PopupManager.config.onBeforeClose = function(dialog) {
  const hasUnsavedData = dialog.querySelector('input')?.value;
  
  if (hasUnsavedData) {
    return confirm('저장되지 않은 데이터가 있습니다. 정말 닫으시겠습니까?');
  }
  
  return true;
};
```

##### 3. 특정 팝업만 확인 메시지
```javascript
PopupManager.config.onBeforeClose = function(dialog) {
  // 편집 폼 팝업만 확인
  if (dialog.id === 'editForm') {
    const isDirty = dialog.dataset.modified === 'true';
    if (isDirty) {
      return confirm('변경사항이 저장되지 않았습니다. 닫으시겠습니까?');
    }
  }
  return true;
};
```

##### 4. 닫기 후 콜백
```javascript
PopupManager.config.onAfterClose = function(dialog) {
  // 폼 초기화
  const form = dialog.querySelector('form');
  if (form) form.reset();
  
  // 애널리틱스 전송
  if (typeof gtag !== 'undefined') {
    gtag('event', 'popup_close', {
      popup_id: dialog.id
    });
  }
  
  // body 클래스 제거
  document.body.classList.remove('popup-open');
};
```

##### 5. 여러 설정 한번에 변경
```javascript
Object.assign(PopupManager.config, {
  closeBtnSelectors: '.btn-cancel, .btn-close, .popup-close',
  enableEscKey: true,
  onBeforeClose: function(dialog) {
    console.log('닫기 시작:', dialog.id);
    return true;
  },
  onAfterClose: function(dialog) {
    console.log('닫기 완료:', dialog.id);
  }
});

PopupManager.refresh(); // 변경사항 적용
```

##### 6. 커스텀 닫기 버튼 변경 또는 추가
```javascript
// 프로젝트에서 사용하는 닫기 버튼 변경
PopupManager.config.closeBtnSelectors = '.pop_tit .btn_cross, .pop_foot .btn_cancel, .custom-close';
PopupManager.refresh();
```

#### 주의사항

- `dialog` 요소만 지원합니다
- 설정 변경 후 `PopupManager.refresh()`를 호출해야 닫기 버튼 이벤트가 재바인딩됩니다
- `onBeforeClose`에서 `false`를 반환하면 팝업이 닫히지 않습니다
- 동적으로 팝업을 추가한 경우 `PopupManager.refresh()`를 호출하세요

#### 브라우저 지원

`dialog` 요소를 지원하는 모던 브라우저에서 사용 가능합니다.
- Chrome 37+
- Edge 79+
- Firefox 98+
- Safari 15.4+