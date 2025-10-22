/* ========== CONFIG ========== */
// Admin credentials (kullanıcı verdi)
const ADMIN_USERNAME = "ktm_r3cl41m";
const ADMIN_PASSWORD = "adm_Ynl_01.@-01";

/* ========== KEY STRINGS ========== */
const TEAM_KEY = "ktm_team_members"; // localStorage (kalıcı)
const ADMIN_SESSION_KEY = "ktm_is_admin"; // sessionStorage (oturum)

/* ========== ÖN TANIMLI ÜYELER (ilk yükleme için) ========== */
const defaultTeam = [
  {
    id: generateId(),
    name: "KTM』R3CL4IMツ",
    role: "Lider • Streamer",
    avatar: "https://i.pravatar.cc/300?img=51"
  },
  {
    id: generateId(),
    name: "KTM』R3L4XSSツ",
    role: "Rush • Support",
    avatar: "https://i.pravatar.cc/300?img=52"
  }
];

/* ========== HELPERS ========== */
function generateId() {
  return 'm_' + Math.random().toString(36).substr(2,9);
}

function $(sel){ return document.querySelector(sel); }
function $all(sel){ return document.querySelectorAll(sel); }

/* ========== LOAD / INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
  // Loading screen
  runLoadingScreen();

  // Nav hamburger
  initNavToggle();

  // Team load & render
  ensureTeamInitialized();
  renderTeam();

  // Admin UI hooks
  initAdminUI();

  // Contact form success handler (Formspree default submit will redirect; here we prevent double)
  const contactForm = $('#contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      // allow form to submit normally to Formspree
      // we can show inline message — Formspree will send mail
      setTimeout(()=> {
        const success = $('#successMessage');
        if(success) success.style.display = 'block';
      }, 500);
    });
  }
});

/* ========== LOADING SCREEN ========== */
function runLoadingScreen(){
  const loading = $('#loadingScreen');
  const prog = $('#loadingProgress');
  const text = $('#loadingText');
  if(!loading || !prog) return;

  // animate progress for ~1.8s, then hide
  let percent = 0;
  const interval = setInterval(()=>{
    percent += Math.floor(Math.random()*12) + 6; // random-ish progress
    if(percent > 100) percent = 100;
    prog.style.width = percent + '%';
    text.textContent = percent < 100 ? 'Yükleniyor... ' + percent + '%' : 'Hazır!';
    if(percent >= 100){
      clearInterval(interval);
      setTimeout(()=> {
        loading.style.opacity = '0';
        setTimeout(()=> loading.remove(), 600);
      }, 400);
    }
  }, 120);
}

/* ========== NAV TOGGLE ========== */
function initNavToggle(){
  const toggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  toggle && toggle.addEventListener('click', ()=> {
    navLinks.classList.toggle('show');
    toggle.classList.toggle('open');
  });
  // auto-close when clicking a link (mobile)
  document.querySelectorAll('.nav-links a').forEach(a=>{
    a.addEventListener('click', ()=> navLinks.classList.remove('show'));
  });
  // navbar scroll background
  window.addEventListener('scroll', ()=>{
    const nav = document.querySelector('.navbar');
    if(!nav) return;
    if(window.scrollY > 40){
      nav.style.background = "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(10,10,10,0.95))";
      nav.style.boxShadow = "0 6px 18px rgba(0,0,0,0.6)";
    } else {
      nav.style.background = "rgba(10,10,10,0.55)";
      nav.style.boxShadow = "none";
    }
  });
}

/* ========== TEAM STORAGE ========== */
function ensureTeamInitialized(){
  const raw = localStorage.getItem(TEAM_KEY);
  if(!raw){
    localStorage.setItem(TEAM_KEY, JSON.stringify(defaultTeam));
  }
}

function getTeam(){
  try{
    return JSON.parse(localStorage.getItem(TEAM_KEY)) || [];
  }catch(e){
    return [];
  }
}

function saveTeam(arr){
  localStorage.setItem(TEAM_KEY, JSON.stringify(arr));
}

/* ========== RENDER TEAM ========== */
function renderTeam(){
  const grid = $('#teamGrid');
  grid.innerHTML = '';
  const team = getTeam();
  if(team.length === 0){
    grid.innerHTML = '<p style="color:#ccc;grid-column:1/-1;text-align:center">Henüz üye yok.</p>';
    return;
  }
  const isAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';

  team.forEach(member => {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.innerHTML = `
      <div class="member-avatar"><img src="${escapeHtml(member.avatar || '') || 'https://i.pravatar.cc/300?img=33'}" alt="${escapeHtml(member.name)}"></div>
      <div class="member-info">
        <h4>${escapeHtml(member.name)}</h4>
        <p>${escapeHtml(member.role)}</p>
      </div>
      <div class="member-actions"></div>
    `;
    const actions = card.querySelector('.member-actions');
    if(isAdmin){
      const del = document.createElement('button');
      del.className = 'btn';
      del.textContent = 'Sil';
      del.addEventListener('click', ()=>{
        if(confirm(`${member.name} silinsin mi?`)){
          removeMember(member.id);
        }
      });
      actions.appendChild(del);
    }
    grid.appendChild(card);
  });

  // show admin controls if admin
  const adminControls = $('#adminControls');
  if(adminControls) adminControls.style.display = isAdmin ? 'flex' : 'none';
}

/* ========== MEMBER CRUD ========== */
function addMember(name, role, avatar){
  const team = getTeam();
  team.push({ id: generateId(), name: name || 'Bilinmiyor', role: role || 'Oyuncu', avatar: avatar || 'https://i.pravatar.cc/300?img=33' });
  saveTeam(team);
  renderTeam();
}

function removeMember(id){
  const team = getTeam().filter(m => m.id !== id);
  saveTeam(team);
  renderTeam();
}

/* ========== ADMIN UI ========== */
function initAdminUI(){
  const adminToggle = $('#adminToggle');
  const loginModal = $('#loginModal');
  const adminControls = $('#adminControls');
  const openAddBtn = $('#openAddMember');
  const addModal = $('#addModal');
  const cancelAdd = $('#cancelAdd');
  const saveBtn = $('#saveMember');
  const logoutBtn = $('#logoutBtn');

  // show login modal
  adminToggle && adminToggle.addEventListener('click', (e)=>{
    e.preventDefault();
    loginModal.style.display = 'flex';
  });

  // cancel login
  $('#adminCancel').addEventListener('click', ()=> loginModal.style.display = 'none');

  // perform login
  $('#adminLoginBtn').addEventListener('click', ()=>{
    const user = $('#adminUser').value.trim();
    const pass = $('#adminPass').value;
    if(user === ADMIN_USERNAME && pass === ADMIN_PASSWORD){
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      loginModal.style.display = 'none';
      $('#adminUser').value = '';
      $('#adminPass').value = '';
      renderTeam();
      alert('Admin girişi başarılı');
    } else {
      alert('Kullanıcı adı veya şifre yanlış');
    }
  });

  // logout
  if(logoutBtn) logoutBtn.addEventListener('click', ()=>{
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    renderTeam();
    alert('Çıkış yapıldı');
  });

  // open add member modal
  openAddBtn && openAddBtn.addEventListener('click', ()=> addModal.style.display = 'flex');
  cancelAdd && cancelAdd.addEventListener('click', ()=> addModal.style.display = 'none');

  // save member
  saveBtn && saveBtn.addEventListener('click', ()=>{
    const name = $('#newName').value.trim();
    const role = $('#newRole').value.trim();
    const avatar = $('#newAvatar').value.trim();
    if(!name || !role){
      alert('İsim ve rol zorunlu');
      return;
    }
    addMember(name, role, avatar || 'https://i.pravatar.cc/300?img=33');
    $('#newName').value = ''; $('#newRole').value = ''; $('#newAvatar').value = '';
    addModal.style.display = 'none';
  });

  // show/hide admin controls if session exists
  const isAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  if(adminControls) adminControls.style.display = isAdmin ? 'flex' : 'none';
}

/* ========== UTIL ========== */
function escapeHtml(s){
  if(!s) return '';
  return s.replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}
