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

let tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
let habits = JSON.parse(localStorage.getItem(HABITS_KEY) || '[]');

// --- INIT APP
function initApp(){
  // forms
  document.getElementById('task-form').addEventListener('submit', function(e){
    e.preventDefault();
    const text = document.getElementById('task-text').value.trim();
    const due = document.getElementById('task-due').value || null;
    const priority = document.getElementById('task-priority').value;
    if(!text) { alert('Escribe una tarea'); return; }
    const newTask = { id: uid(), text, due, priority, done:false, createdAt:new Date().toISOString() };
    tasks.unshift(newTask);
    saveTasks(); renderTasks(); renderSummary();
    this.reset();
  });

  document.getElementById('habit-form').addEventListener('submit', function(e){
    e.preventDefault();
    const text = document.getElementById('habit-text').value.trim();
    if(!text) { alert('Escribe un hábito'); return; }
    const newHabit = { id: uid(), text, checks:[], createdAt:new Date().toISOString() };
    habits.unshift(newHabit);
    saveHabits(); renderHabits(); renderSummary();
    this.reset();
  });

  renderTasks();
  renderHabits();
  renderSummary();
}

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }