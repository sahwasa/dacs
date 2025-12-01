//로딩순서 때문에 수동실행
function commonInit() {
  	// nav
	let $deps1=$('.nav_lst>li'),
    	$deps2=$('.nav .sub li'),
    	preLocate,deps1Locate,deps2Locate,
    	indexDeps1,getDeps,indexDeps2,
    	locate=window.location.href;

	menuInit();
	function menuInit(){
		$deps1.each(function(index, item){
            var getAttr=$(this).children('a').attr('href');
            index+=1;
            if(getAttr.indexOf('?index=')===-1)
              indexDeps1=$(this).children('a').attr('href',getAttr + "?index="+ index +',1');
            indexDeps2=$(this).find($deps2);
            getDeps=$(this).children('a').attr('href');
            indexDeps2.each(function(index2, item){
                getAttr=$(this).children('a').attr('href');
                index2+=1;
                if(getAttr.indexOf('?index=')===-1)
                  indexDeps2=$(this).children('a').attr('href',getAttr + "?index="+index+',' + index2);
            });
        });

		if(locate.indexOf("index=")>-1){
			preLocate=locate.split("index=")[1].split(',');
			deps1Locate=preLocate[0]-1;
			deps2Locate=preLocate[1]-1;
        $deps1.eq(deps1Locate).children('a').addClass('on');
        $deps1.eq(deps1Locate).find($deps2).eq(deps2Locate).children('a').addClass('on');           
		}
	};

  function menuEvt(el){
    var getAttr=el.attr('href').split("index=")[1].split(',');
    deps1Locate=getAttr[0]-1;
    deps2Locate=getAttr[1]-1;
    $deps1.find('a').removeClass('on');
    $deps2.find('a').removeClass('on');
    $snb.removeClass('on');
    $deps1.eq(deps1Locate).children('a').addClass('on')
    $deps1.eq(deps1Locate).find($deps2).eq(deps2Locate).children('a').addClass('on');
    el.parent('li').addClass('on');    
  }
  $deps1.on('click','a',function(){menuEvt($(this))});
  $deps2.on('click','a',function(){menuEvt($(this))});
  
  // table_row checked
  $('.row_check').on({
    click: function (e) {
      e.stopPropagation()
    },
    change: function () {
      var cur = $(this).prop('checked'),
        checkName = 'select_tr',
        thisP = $(this).parents('.tbl_wrap');
        childBody = thisP.find('tbody');
      if ($(this).hasClass('all_check')) {        
        var childCheckIpt = childBody.find('.row_check');
        childCheckIpt.each(function () {
          var elRow = $(this).parents('tr')
          $(this).prop('checked', cur)
          cur ? elRow.addClass(checkName) : elRow.removeClass(checkName)
        })
      } else {
        var thisRow = $(this).parents('tr');
        if ($(this).prop('type') == 'radio') $(this).parents('table').find('tr').removeClass(checkName);
          cur ? thisRow.addClass(checkName) : thisRow.removeClass(checkName);
          var checkSize = childBody.find('.row_check:checked').length,
              allCtrl = thisP.find('.all_check');
          childBody.find('input:checkbox').length <= checkSize
            ? allCtrl.prop('checked', true)
            : allCtrl.prop('checked', false)
        }
    },
  })
  // tbl_list Handle checked
  $('.tbl_list .row_check').on({
    click: function (e) {
      e.stopPropagation()
    },
    change: function () {
      var cur = $(this).prop('checked')
      var thisLi = $(this).closest('li')
      if (cur) {
        thisLi.addClass('select_li')
      } else {
        thisLi.removeClass('select_li')
      }
    },
  })

  // list all check
  function all_check_evt(el) {
    const allCtrl = el.prop('checked'),
      thisChild = el
        .closest('.all_lst_ctrl')
        .next('.lst_ctrl')
        .find('input:checkbox')
    thisChild.prop('checked', allCtrl)
  }
  function all_check(el) {
    var thisP = el.parents('.lst_ctrl'),
      checkSize = thisP.find('input:checked').length,
      allCtrl = thisP.prev('.all_lst_ctrl').find('input:checkbox')
      if(thisP.prev('.all_lst_ctrl').hasClass('sub_tit')){
        (checkSize >= 1)
        ? allCtrl.prop('checked',true)
        : allCtrl.prop('checked',false);
      }else{
      thisP.find('input:checkbox').length <= checkSize
        ? allCtrl.prop('checked', true)
        : allCtrl.prop('checked', false)
      }
  }
  $('.all_lst_ctrl').on('click change', 'input:checkbox', function () {
    all_check_evt($(this))
  })
  $('.lst_ctrl').on('click change', 'input', function () {
    all_check($(this))
  })
  $('.lst_ctrl')
    .find('input:checkbox')
    .each(function (index, item) {
      all_check($(item))
  })
  
  //tab
  var tabBtns = $('.tabs'),
      tabContainer = $('.tab_container');
  tabBtns.find('li:first').addClass('on')
  tabContainer.find('.tab_cont:not(:first)').hide()
  tabContainer.children('.tab_cont').first().show();
  tabBtns.find('li').off('click').on('click','a', function (e) {
    e.preventDefault()
    $(this).parent('li').addClass('on').siblings().removeClass('on')
    var link = $(this).attr('href')
    var findTarget = $(this).parents('.tabs').next('.tab_container')
    findTarget.find('.tab_cont').hide()
    $(link).show();
  })

   /* fileDeco */
  var filePath = $('[role="filePath"]');
  filePath.val('선택된 파일이 없습니다.');
  $('[role="fileAdd"]').on('change',function(){
    var fileAdd = $(this);
    fileAdd.parent('.file_ipt').find('[role="filePath"]').val(fileAdd[0].files[0].name);
  });

  // toggle button
  $('.switch_toggle input')
    .off('change')
    .on('change', function (e) {
      // 기존에 등록된 이벤트 리스너 제거
      e.preventDefault()
      let cur = $(this).prop('checked');
      let label = $(this).parent('label');
      let labelVal = label.get(0).dataset;
      if ($(this).attr('disabled') == 'disabled') return false
      label.get(0).lastChild.remove();
      (cur) ? label.append(labelVal.labelon) : label.append(labelVal.labeloff);
    })

  //pop
  $('[data-role="pop_close"]').on('click',function(e){
    $(this).closest('dialog').get(0).close();   
  })
  //패스워드보기
  $('.pw_Open').on('change',function(){
    let cur = $(this).prop('checked'),
        target = $(this).parents('.switch_pw').prev('input');
    cur ? target.prop('type','text') : target.prop('type','password');
  })
}
