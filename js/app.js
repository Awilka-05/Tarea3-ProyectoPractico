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

function saveTasks(){ localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); }
function saveHabits(){ localStorage.setItem(HABITS_KEY, JSON.stringify(habits)); }

function renderTasks(){
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  if(tasks.length === 0){ list.innerHTML = '<p class="muted">No hay tareas aún</p>'; return; }
  tasks.forEach((t,i) => {
    const li = document.createElement('li');
    li.className = 'item' + (t.done ? ' done' : '');
    li.innerHTML = `
      <div class="meta">
        <div class="title">${escapeHtml(t.text)}</div>
        <div class="muted">${t.due ? 'Entrega: '+formatDate(t.due) : ''} • Creada: ${formatDateTime(t.createdAt)}</div>
      </div>
      <div class="actions">
        <span class="badge ${t.priority === 'alta' ? 'urgent' : 'normal'}">${t.priority === 'alta' ? 'URGENTE' : 'NORMAL'}</span>
        <button class="small-btn" title="Marcar completada" onclick="toggleDone('${t.id}')"><i class="bi bi-check2-square"></i></button>
        <button class="small-btn" title="Editar" onclick="editTask('${t.id}')"><i class="bi bi-pencil"></i></button>
        <button class="small-btn" title="Eliminar" onclick="deleteTask('${t.id}')"><i class="bi bi-trash"></i></button>
      </div>
    `;
    list.appendChild(li);
  });
}

function toggleDone(id){
  const i = tasks.findIndex(x=>x.id===id);
  if(i<0) return;
  tasks[i].done = !tasks[i].done;
  saveTasks(); renderTasks(); renderSummary();
}

function editTask(id){
  const t = tasks.find(x=>x.id===id);
  if(!t) return;
  const newText = prompt('Editar tarea', t.text);
  if(newText === null) return;
  const newDue = prompt('Fecha de entrega (YYYY-MM-DD) ó vacío para quitar', t.due || '');
  const newPriority = confirm('¿Marcar como URGENTE? Ok=SÍ, Cancelar=NO') ? 'alta' : 'normal';
  t.text = newText.trim() || t.text;
  t.due = newDue ? newDue.trim() : null;
  t.priority = newPriority;
  saveTasks(); renderTasks(); renderSummary();
}

function deleteTask(id){
  if(!confirm('Eliminar tarea?')) return;
  tasks = tasks.filter(x=>x.id!==id);
  saveTasks(); renderTasks(); renderSummary();
}
