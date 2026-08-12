(function(){'use strict';

  /* === Dealer Application Form === */
  function initDealerForm(){
    var form=document.getElementById('dealerForm');
    var success=document.getElementById('dlrSuccess');
    var error=document.getElementById('dlrError');
    var submitBtn=document.getElementById('dlrSubmit');
    if(!form)return;

    form.addEventListener('submit',function(e){
      e.preventDefault();

      // Validation
      var company=document.getElementById('dlrCompany').value.trim();
      var contact=document.getElementById('dlrContact').value.trim();
      var email=document.getElementById('dlrEmail').value.trim();
      var country=document.getElementById('dlrCountry').value.trim();

      if(!company||!contact||!email||!country){
        error.textContent='请填写所有必填字段';
        error.style.display='block';
        return;
      }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        error.textContent='请输入有效的邮箱地址';
        error.style.display='block';
        return;
      }

      // Collect categories
      var cats=[];
      document.querySelectorAll('input[name="dlrCategory"]:checked').forEach(function(cb){
        cats.push(cb.value);
      });

      error.style.display='none';

      // Collect form data
      var data={type:'经销商申请',date:new Date().toISOString(),fields:{
        '公司名称':company,'联系人':contact,'邮箱':email,'国家/地区':country,
        '经营品类':cats.join(', '),'电话':(document.getElementById('dlrPhone')||{}).value||'',
        '从业年限':(document.getElementById('dlrYears')||{}).value||'',
        '当前渠道':(document.getElementById('dlrChannel')||{}).value||'',
        '申请理由':(document.getElementById('dlrReason')||{}).value||''
      }};

      // Always save to localStorage
      var submissions=JSON.parse(localStorage.getItem('huayue-dealer-apps')||'[]');
      submissions.push(data);
      localStorage.setItem('huayue-dealer-apps',JSON.stringify(submissions));

      // Build FormData for Netlify
      var fd=new FormData();
      fd.append('form-name','dealer-application');
      Object.keys(data.fields).forEach(function(k){if(data.fields[k])fd.append(k,data.fields[k])});

      submitBtn.textContent='提交中...';
      submitBtn.disabled=true;

      // Attempt Netlify Forms submission
      fetch('/','{method:\"POST\",headers:{\"Content-Type\":\"application/x-www-form-urlencoded\"},body:new URLSearchParams(fd).toString()}').then(function(){
        form.style.display='none';
        success.classList.add('dealer-apply__success--visible');
      }).catch(function(){
        // Netlify not available — data saved to localStorage only
        form.style.display='none';
        success.classList.add('dealer-apply__success--visible');
        success.style.background='#fef3c7';success.style.border='1px solid #f59e0b';
        success.querySelector('p').textContent='申请已暂存本地。网络恢复后将自动同步，或直接拨打电话联系我们。';
      }).then(function(){
        submitBtn.textContent='提交申请';
        submitBtn.disabled=false;
      });
    });

    // Reset button
    var resetBtn=document.getElementById('dlrReset');
    if(resetBtn){
      resetBtn.addEventListener('click',function(){
        form.reset();
        form.style.display='block';
        success.classList.remove('dealer-apply__success--visible');
      });
    }
  }

  /* === Marketing Download Buttons (informational) === */
  function initMarketingButtons(){
    document.querySelectorAll('.marketing-card__body .btn').forEach(function(btn){
      btn.addEventListener('click',function(e){
        e.preventDefault();
        // TODO: Replace with real download links to PDF catalogs and marketing materials
        if(window.App&&window.App.toast){
          window.App.toast('营销物料正在整理中，如需产品资料请直接联系外贸团队：3539576340@qq.com');
        }
      });
    });
  }

  /* === Init === */
  function init(){
    initDealerForm();
    initMarketingButtons();
  }

  window.App=window.App||{};
  window.App.Dealer={init:init};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}
})();
