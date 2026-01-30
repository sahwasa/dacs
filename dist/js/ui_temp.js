//grid format
function formatStatus(cellValue, options, rowObject) {            
  let status = rowObject.status;
  let view = "";
  if (status == 'connection') {
      view = `<i class="ico_stt_connection">연결됨</i>`;
  }
  else if (status == 'disconnection') {
      view = `<i class="ico_stt_disconnection">연결안됨</i>`;
  }  
  else if (status == 'success') {
      view = `<span class="txt_success">성공</span>`;
  }  
  else if (status == 'fail') {
      view = `<span class="txt_fail">실패</span>`;
  }  
  else if (status == 'normal') {
      view = `<span class="txt_normal">정상</span>`;
  }  
  else if (status == 'error') {
      view = `<span class="txt_error">비정상</span>`;
  }  
  return view;
}
function formatBtn(cellValue, options, rowObject) {            
  let txt='';
  if(cellValue == 'Del') txt = '삭제';
  if(cellValue == 'Modify') txt = '수정';
  if(cellValue == 'Add') txt = '추가';
  let tmpl = `<button type="button" class="btn_tbl${cellValue}" data-action=${cellValue} data-rowid="${options.gid}-${options.rowId}">${txt}</button>`;    
  return tmpl;
}
function formatSwitch(cellValue, options, rowObject){
  const checked = cellValue === true ? 'checked' : '';
  let tmpl = `<div class="switch_toggle">
                <label for="${options.gid}-${options.rowId}">
                  <input type="checkbox" class="type_check" ${checked} id="${options.gid}-${options.rowId}"> 사용여부
                </label>
              </div>`
  return tmpl;            
}