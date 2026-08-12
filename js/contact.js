(function(){'use strict';

  /* === Tab Switcher === */
  function initTabs(){
    var btns=document.querySelectorAll('.tabs__btn');
    btns.forEach(function(btn){
      btn.addEventListener('click',function(){
        var tab=this.getAttribute('data-tab');
        // Update buttons
        btns.forEach(function(b){b.classList.toggle('tabs__btn--active',b===btn)});
        // Update panels
        document.querySelectorAll('.tabs__panel').forEach(function(p){p.classList.toggle('tabs__panel--active',p.id==='form-'+tab)});
      });
    });
  }

  /* === Form Validation === */
  function validateForm(form){
    var valid=true;
    form.querySelectorAll('[required]').forEach(function(field){
      var value=field.value.trim();
      var group=field.closest('.form-group');
      if(!value){
        if(group){group.classList.add('form-group--error');var err=group.querySelector('.form-error');
          if(!err){err=document.createElement('div');err.className='form-error';group.appendChild(err)}
          err.textContent='请填写此项';err.style.display='block'}
        valid=false;
      }else{
        if(group)group.classList.remove('form-group--error');
      }
      // Email validation
      if(field.type==='email'&&value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
        if(group){group.classList.add('form-group--error');var e=group.querySelector('.form-error');
          if(!e){e=document.createElement('div');e.className='form-error';group.appendChild(e)}
          e.textContent='请输入有效的邮箱地址';e.style.display='block'}
        valid=false;
      }
    });
    return valid;
  }

  function initForms(){
    document.querySelectorAll('.contact-form').forEach(function(form){
      // Clear errors on input
      form.querySelectorAll('.form-input,.form-select,.form-textarea').forEach(function(field){
        field.addEventListener('input',function(){
          var group=this.closest('.form-group');
          if(group)group.classList.remove('form-group--error');
        });
        field.addEventListener('change',function(){
          var group=this.closest('.form-group');
          if(group)group.classList.remove('form-group--error');
        });
      });

      form.addEventListener('submit',function(e){
        e.preventDefault();
        if(!validateForm(this))return;
        // Collect form data
        var formType=this.id.replace('form-','');
        var typeLabels={inquiry:'在线询盘',quote:'获取报价','factory-visit':'预约验厂','dealer-application':'经销商申请'};
        var data={type:typeLabels[formType]||formType,date:new Date().toISOString(),fields:{}};
        // Build FormData for Netlify submission
        var fd=new FormData();
        fd.append('form-name',this.getAttribute('name')||formType);
        this.querySelectorAll('input,select,textarea').forEach(function(f){
          if(f.type==='checkbox'){if(f.checked){data.fields[f.closest('label')?f.closest('label').textContent.trim():'product']=f.value;fd.append(f.name||'product',f.value)}}
          else if(f.type==='submit'||f.type==='button')return;
          else if(f.name==='form-name')return;
          else{var label=f.closest('.form-group');var key=label?label.querySelector('.form-label').textContent.replace(/[\/\*]/g,'').trim():f.placeholder||f.name;if(f.value.trim()){data.fields[key]=f.value.trim();fd.append(f.name||key,f.value.trim())}}
        });
        // Always save to localStorage as backup
        var submissions=JSON.parse(localStorage.getItem('huayue-inquiries')||'[]');
        submissions.push(data);
        localStorage.setItem('huayue-inquiries',JSON.stringify(submissions));
        // Disable button
        var btn=this.querySelector('button[type="submit"]');
        var origText=btn.textContent;
        btn.disabled=true;btn.textContent='提交中...';
        // Primary: Submit via FormSubmit.co (free tier, works on any hosting)
        fd.append('_subject','华悦园林询盘 - '+typeLabels[formType]);
        fd.append('_template','table');
        var formEl=this;
        fetch('https://formsubmit.co/ajax/3539576340@qq.com',{method:'POST',body:fd}).then(function(res){return res.json()}).then(function(result){
          btn.disabled=false;btn.textContent=origText;
          if(result.success){
            formEl.reset();
            formEl.querySelectorAll('.form-group--error').forEach(function(g){g.classList.remove('form-group--error')});
            var success=formEl.querySelector('.form-success');
            if(success){success.classList.add('form-success--visible');
              setTimeout(function(){success.classList.remove('form-success--visible')},6000)}
          }else{
            throw new Error('FormSubmit rejected');
          }
        }).catch(function(){
          // FormSubmit failed — data is in localStorage, tell user to email
          btn.disabled=false;btn.textContent=origText;
          formEl.reset();
          formEl.querySelectorAll('.form-group--error').forEach(function(g){g.classList.remove('form-group--error')});
          var success=formEl.querySelector('.form-success');
          if(success){success.classList.add('form-success--visible');success.style.background='#fef3c7';success.style.border='1px solid #f59e0b';
            success.innerHTML='提交未能发送到服务器，但数据已安全暂存。请直接发送邮件至 <a href=\"mailto:3539576340@qq.com\" style=\"color:#b45309;font-weight:600\">3539576340@qq.com</a>，或拨打电话 19862905209，我们立即处理。';
            setTimeout(function(){success.classList.remove('form-success--visible');success.style.background='';success.style.border='';success.innerHTML=''},12000)}
        });
      });
    });
  }

  function init(){
    initTabs();initForms();
  }

  window.App=window.App||{};
  window.App.Contact={init:init};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}
})();
