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

      // Simulate submission
      submitBtn.textContent='提交中...';
      submitBtn.disabled=true;

      setTimeout(function(){
        form.style.display='none';
        success.classList.add('dealer-apply__success--visible');
        submitBtn.textContent='提交申请';
        submitBtn.disabled=false;
      },1000);
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
        // In production, these would link to real files
        // For now, show a friendly message
        if(window.App&&window.App.toast){
          window.App.toast('成为经销商后可免费下载全部营销物料。请先提交上方申请表。');
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
