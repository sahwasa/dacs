/**
   jquery extension api 정의
 */
 $.extend(true, $.jgrid.defaults, {
  _resizeParent: '.tbl_wrap' //그리드를 감싼 부모 DIV를 지정
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
   gridResizing:function (){      
      return this.each(function () {
         const $grid = $(this);
         const parentSelector = $grid.jqGrid('getGridParam', '_resizeParent');
         const $parent = parentSelector
         ? $grid.closest(parentSelector)
         : $grid.parent();
         const width = $parent[0]?.getBoundingClientRect().width;
         if (width > 0) {
            $grid.jqGrid('setGridWidth', Math.floor(width));
         }
      });
   },

   gridResize: function(width) {
      return this.each(function() {
         var $grid = $(this);
         var $parent = $grid.parents('.tbl_wrap');
        

         // 1. Calculate Width
        //  var newWidth = $parent.width() - 2;
        var newWidth = width;
        console.log('new:'+ width);

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
