(function(){'use strict';
  var products=(window.APP_DATA&&window.APP_DATA.products)||[];

  /* === Auth === */
  function isAuth(){return sessionStorage.getItem('dealer_authenticated')==='true'}
  function setAuth(name){sessionStorage.setItem('dealer_authenticated','true');sessionStorage.setItem('dealer_name',name);sessionStorage.setItem('dealer_last_login',new Date().toLocaleString('zh-CN'))}
  function clearAuth(){sessionStorage.removeItem('dealer_authenticated');sessionStorage.removeItem('dealer_name')}

  function showLogin(){
    document.getElementById('dealerLogin').style.display='flex';
    var dash=document.getElementById('dealerDashboard');
    dash.style.display='none';dash.classList.remove('dealer-dashboard--visible');
  }
  function showDashboard(){
    document.getElementById('dealerLogin').style.display='none';
    var dash=document.getElementById('dealerDashboard');
    dash.style.display='block';dash.classList.add('dealer-dashboard--visible');
    document.getElementById('dealerName').textContent=sessionStorage.getItem('dealer_name')||'合作伙伴';
    document.getElementById('lastLogin').textContent=sessionStorage.getItem('dealer_last_login')||'--';
  }

  function initLogin(){
    var form=document.getElementById('loginForm');
    if(!form)return;
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var email=document.getElementById('loginEmail').value.trim();
      var pass=document.getElementById('loginPassword').value.trim();
      var err=document.getElementById('loginError');
      if(!email||!pass){err.textContent='请填写邮箱和密码';err.style.display='block';return}
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){err.textContent='请输入有效的邮箱地址';err.style.display='block';return}
      if(pass.length<6){err.textContent='密码长度不能少于6位';err.style.display='block';return}
      // Simulate auth
      err.style.display='none';
      var btn=form.querySelector('button[type="submit"]');btn.textContent='验证中...';btn.disabled=true;
      setTimeout(function(){
        setAuth(email.split('@')[0]);btn.textContent='登录';btn.disabled=false;
        showDashboard();renderInventory();
        window.App&&window.App.toast&&window.App.toast('登录成功');
      },800);
    });
    var forgotLink=document.querySelector('[data-forgot-password]');
    if(forgotLink)forgotLink.addEventListener('click',function(e){e.preventDefault();window.App&&window.App.toast&&window.App.toast('请联系外贸经理重置密码: export@huayueyuanlin.com','success')});
  }

  function initLogout(){
    var btn=document.getElementById('logoutBtn');
    if(btn)btn.addEventListener('click',function(){clearAuth();showLogin()});
  }

  /* === Dashboard Tabs === */
  function initDashboardTabs(){
    document.querySelectorAll('[data-dtab]').forEach(function(btn){
      btn.addEventListener('click',function(){
        var tab=this.getAttribute('data-dtab');
        document.querySelectorAll('[data-dtab]').forEach(function(b){b.classList.toggle('tabs__btn--active',b===btn)});
        document.querySelectorAll('#dealerDashboard .tabs__panel').forEach(function(p){p.classList.toggle('tabs__panel--active',p.id==='dtab-'+tab)});
      });
    });
  }

  /* === Inventory === */
  function renderInventory(filter){
    filter=(filter||'').toLowerCase();
    var tbody=document.querySelector('#invTable tbody');
    if(!tbody)return;
    var statuses=['inv-status--ok','inv-status--low','inv-status--out'];
    var statusTexts=['充足','偏低','缺货'];
    var rows=products.map(function(p,i){
      var qty=Math.floor(Math.random()*50)+1;
      var si=qty>10?0:(qty>0?1:2);
      return {name:p.name,sku:'VP-'+p.id.toUpperCase().replace(/-/g,''),cat:{mower:'割灌机',chainsaw:'油锯',blower:'吹风机'}[p.category],qty:qty,statusCls:statuses[si],statusText:statusTexts[si]};
    });
    if(filter)rows=rows.filter(function(r){return r.name.toLowerCase().includes(filter)||r.sku.toLowerCase().includes(filter)});
    tbody.innerHTML=rows.map(function(r){
      return '<tr><td>'+r.name+'</td><td style="font-family:var(--font-mono);font-size:0.75rem">'+r.sku+'</td><td>'+r.cat+'</td><td>'+r.qty+'</td><td><span class="inv-status '+r.statusCls+'">'+r.statusText+'</span></td><td><button class="btn btn--outline btn--sm" style="font-size:0.6875rem;padding:4px 10px">补货</button></td></tr>';
    }).join('');
  }

  function initInventorySearch(){
    var input=document.getElementById('invSearch');
    if(!input)return;
    input.addEventListener('input',function(){renderInventory(this.value)});
  }

  /* === Init === */
  function init(){
    initLogin();initLogout();initDashboardTabs();initInventorySearch();
    if(isAuth()){showDashboard();renderInventory()}
    else{showLogin()}
  }

  window.App=window.App||{};
  window.App.Dealer={init:init};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}
})();
