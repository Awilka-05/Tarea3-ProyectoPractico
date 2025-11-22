const TASKS_KEY = 'org_tasks_v1';
const HABITS_KEY = 'org_habits_v1';
const USER_KEY = 'org_user_v1';

document.getElementById('start-btn').addEventListener('click', startApp);

function startApp(){
  const name = document.getElementById('user-name').value.trim() || 'Usuario';
  const pref = document.getElementById('preference').value || 'Organización';
  localStorage.setItem(USER_KEY, JSON.stringify({name, pref}));
  document.querySelector('.hero').classList.add('hidden'); // oculta hero
  document.getElementById('main-app').classList.remove('hidden');
  loadUser();
  initApp();
}

function loadUser(){
  const u = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  if(!u) return;
  document.getElementById('greeting').textContent = `Hola ${u.name}`;
  document.getElementById('subtitle').textContent = `Organizador de ${u.pref}`;
}