/**
   jquery extension api 정의
   고정형 레이아웃 일때 사용
   gridComplete 시 gridResize(), popup 안에 있는 그리드 일 때 gridInPopResize()
 */
 $.extend(true, $.jgrid.defaults, {
   _resizeParent: '.tbl_wrap', //그리드를 감싼 부모 DIV를 지정
   _resizeInPopover: false, // popup 안에 있는 그리드 일 때 on/off
   _autoHeight: false,      // 높이 자동 조절 on/off
   _maxAutoHeight: null    // 최대 높이 (px) – 필요 없으면 null
});
$.jgrid.extend({
   refreshGrid: function(data) {
      this.jqGrid('clearGridData');
      this.jqGrid('setGridParam', { data: data });
      this.trigger('reloadGrid');
   },
   reloadGrid: function() {
      this.trigger('reloadGrid');
   },
   // Resizes the specific grid based on its parent container
   gridResize: function () {
    return this.each(function () {
      const $grid = $(this);
      const $uiGrid = $grid.closest('.ui-jqgrid');      
      /* ======================
       * 1. HEIGHT RESIZE
       * ====================== */
      if ($grid.jqGrid('getGridParam', '_autoHeight')) {
        const rowCount = $grid.jqGrid('getGridParam', 'reccount');

        const $firstRow = $uiGrid.find('tr.jqgrow:first');
        if ($firstRow.length) {
          const rowHeight = $firstRow.outerHeight(true);
          let totalHeight = rowCount * rowHeight;
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
        const parent = $grid.closest(parentSel)[0];
        if (parent) {
          const width = parent.getBoundingClientRect().width;
          if (width > 0) {
            $grid.jqGrid('setGridWidth', Math.floor(width));
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

  //기존 리사이즈 코드
   gridResizing: function(width) {
      return this.each(function() {
         var $grid = $(this);
         var $parent = $grid.parents('.tbl_wrap');
        

         // 1. Calculate Width
        var newWidth = $parent.width() - 2;
        var newWidth = width;

         // 2. Calculate Height dynamically
         // Find the wrapper created by jqGrid (usually named gbox_gridId)
         var gridId = $grid.attr('id');
         var $gbox = $("#gbox_" + gridId);

         // Find heights of header and pager to subtract them from the total
         var headerHeight = $gbox.find('.ui-jqgrid-hdiv').outerHeight() || 30;
         var pagerHeight = $gbox.find('.ui-jqgrid-pager').outerHeight() || 35;

         // Final height calculation
         var newHeight = $parent.height() - headerHeight - pagerHeight - 10;

         $grid.jqGrid('setGridWidth', newWidth);
         $grid.jqGrid('setGridHeight', newHeight);
      });
   },

   // Binds a global window resize event to all jqGrids
   gridOnResize: function() {
      var self = this;
      $(window).on('resize', function() {
         // Target elements with the 'ui-jqgrid-btable' class (standard jqGrid class)
         $('.ui-jqgrid-btable').each(function() {         
            $(this).gridResize();
         });
      });
      return self;
   }
});
