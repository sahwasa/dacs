/**
 * @file jqGrid UI Extension API
 * @description
 *  - jqGrid 공통 확장 유틸
 *  - 고정형 레이아웃에서 그리드 width/height 자동 조절
 *  - popup(popover) 내부 그리드 자동 리사이즈 지원
 *
 * @author 반미선
 *
 * @created 2026-01-15
 *
 * @lastModified 2026-01-15
 * @lastModifiedBy 반미선
 *
 * @changeLog
 *  - 2026-01-15 | 반미선 | 최초 작성
 *
 * @usage
 *  - gridComplete 시 $(this).gridResize() 호출
 *  - jqGrid option:
 *      _resizeParent     : 그리드를 감싸는 부모 selector
 *      _resizeInPopover  : popover 내부 그리드 여부
 *      _autoHeight       : row 수 기반 height 자동 조절
 *      _maxAutoHeight    : 자동 height 최대값(px)
 */
 $.extend(true, $.jgrid.defaults, {
   _resizeParent: '.tbl_wrap', //그리드를 감싼 부모 DIV를 지정
   _resizeInPopover: false, // popup 안에 있는 그리드 일 때 on/off
   _autoHeight: false,      // 높이 자동 조절 on/off
   _maxAutoHeight: null,    // 최대 높이 (px) – 필요 없으면 null
});
$.jgrid.extend({
   gridResize: function () {
    return this.each(function () {
      const $grid = $(this);
      const $uiGrid = $grid.closest('.ui-jqgrid');      
      /* ======================
       * 1. HEIGHT RESIZE
       * ====================== */
      if ($grid.jqGrid('getGridParam', '_autoHeight')) {
        const rowCount = $grid.jqGrid('getGridParam', 'reccount');
        if (rowCount === 0) {
            $grid.jqGrid('setGridHeight', 'auto');
            return;
         }
        const $firstRow = $uiGrid.find('tr.jqgrow:first');
        if ($firstRow.length) {
         const rowHeight = $firstRow.outerHeight(true);
         const headerH = $uiGrid.find('.ui-jqgrid-hdiv').outerHeight(true) || 0;
         const pagerH  = $uiGrid.find('.ui-jqgrid-pager').outerHeight(true) || 0;

         let totalHeight = rowCount * rowHeight + headerH + pagerH;

          // 최대 높이 제한
          const maxHeight = $grid.jqGrid('getGridParam', '_maxAutoHeight');
          if (maxHeight && totalHeight > maxHeight) {
            totalHeight = maxHeight;
          }

          $grid.jqGrid('setGridHeight', totalHeight);
        }
      }
      /* ======================
       * 2. WIDTH RESIZE
       * ====================== */
      const parentSel = $grid.jqGrid('getGridParam', '_resizeParent');
      if (parentSel) {
        const parent = $uiGrid.closest(parentSel)[0];
        if (parent) {
          const width = parent.getBoundingClientRect().width;
          if (width > 0) {
            $grid.jqGrid('setGridWidth', Math.floor(width), true);
          }
        }
      }
      /* ======================
       * 3. POPOVER AUTO RESIZE
       * ====================== */
      if ($grid.jqGrid('getGridParam', '_resizeInPopover')) {
        $grid.autoPopoverResize();
      }
    });
  },
   autoPopoverResize: function () {
      return this.each(function () {
         const $grid = $(this);

         // 옵션 체크
         if (!$grid.jqGrid('getGridParam', '_resizeInPopover')) return;

         // 중복 바인딩 방지
         if ($grid.data('_popoverResizeBound')) return;
         $grid.data('_popoverResizeBound', true);

         // 자신을 감싸는 popover 자동 탐색
         const popover = $grid.closest('[popover]')[0];
         if (!popover) return;

         const resize = () => {
            requestAnimationFrame(() => { $grid.gridResize(); });
         };

         popover.addEventListener('toggle', function (e) {
            if (e.newState === 'open') {resize();}
         });

         // 이미 열린 상태면 즉시
         if (popover.matches(':popover-open')) { resize(); }
      });
  },

});
