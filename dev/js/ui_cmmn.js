
//   // 그리드 사이즈 초기화
//   resizeGridIn($(document));
//   // 브라우저 리사이즈 때 그리드 사이즈 초기화
//   $(window).on("resize", function () { resizeGridIn($(document)); });
//   //팝업 내 그리드가 있을 때 그리드 사이즈 초기화
//   $("[popovertarget]").each(function () {
//   const target = $(this).attr("popovertarget");
//   const popover = document.getElementById(target);
//   if (!popover) return;
//   let bound = false;
//   if ("ontoggle" in popover) {
//     popover.addEventListener("toggle", function (e) {
//       if (e.newState !== "open") return;
//       resizeGridIn($(popover));
//       bound = true;
//     });
//   }
// });
// });
// function resizeGridIn($scope) {
//   $scope.find("table.ui-jqgrid-btable").each(function () {
//     const $table = $(this);
//     const $wrap = $table.closest(".tbl_wrap");
//     if ($wrap.is(":visible")) {
//       $table.jqGrid("setGridWidth", $wrap.width());
//     }
//   });
// }

popover.addEventListener('toggle', function (e) {
  if (e.newState !== 'open') return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      $('#grid').gridResizing();
    });
  });
});


