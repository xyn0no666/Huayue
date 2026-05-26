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
        // Disable button
        var btn=this.querySelector('button[type="submit"]');
        var origText=btn.textContent;
        btn.disabled=true;btn.textContent='提交中...';
        // Simulate submission
        setTimeout(function(){
          btn.disabled=false;btn.textContent=origText;
          form.reset();
          form.querySelectorAll('.form-group--error').forEach(function(g){g.classList.remove('form-group--error')});
          var success=form.querySelector('.form-success');
          if(success){success.classList.add('form-success--visible');
            setTimeout(function(){success.classList.remove('form-success--visible')},5000)}
        },1200);
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
