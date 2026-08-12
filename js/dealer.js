(function(){'use strict';

  function __(key){return window.App&&window.App.__?window.App.__(key):key}

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
        error.textContent=__('validate.required');
        error.style.display='block';
        return;
      }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        error.textContent=__('validate.email');
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

      // Build FormData for FormSubmit
      var fd=new FormData();
      fd.append('_subject','华悦园林经销商申请 - '+company);
      fd.append('_template','table');
      Object.keys(data.fields).forEach(function(k){if(data.fields[k])fd.append(k,data.fields[k])});

      submitBtn.textContent='提交中...';
      submitBtn.disabled=true;

      // Submit via FormSubmit.co (free tier, works on any hosting)
      fetch('https://formsubmit.co/ajax/3539576340@qq.com',{method:'POST',body:fd}).then(function(r){return r.json()}).then(function(result){
        if(result.success){
          form.style.display='none';
          success.classList.add('dealer-apply__success--visible');
        }else{
          throw new Error('FormSubmit rejected');
        }
      }).catch(function(){
        // FormSubmit failed — data saved to localStorage
        form.style.display='none';
        success.classList.add('dealer-apply__success--visible');
        success.style.background='#fef3c7';success.style.border='1px solid #f59e0b';
        var p=success.querySelector('p');if(p)p.innerHTML='申请已安全暂存。请直接发送邮件至 <a href=\"mailto:3539576340@qq.com\" style=\"color:#b45309;font-weight:600\">3539576340@qq.com</a> 确认，我们将立即处理。';
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
