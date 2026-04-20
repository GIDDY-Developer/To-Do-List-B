// ================= STATE =================
let state = {
  tasks: JSON.parse(localStorage.getItem("tasks")) || [],
  filter: "all"
};

// ================= SELECTORS =================
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll("[data-filter]");
const taskCount = document.getElementById("task-count");
const clearBtn = document.getElementById("clear-completed");

// ================= STORAGE =================
function saveState() {
  localStorage.setItem("tasks", JSON.stringify(state.tasks));
}

// ================= HELPERS =================
function getFilteredTasks() {
  switch (state.filter) {
    case "active":
      return state.tasks.filter(t => !t.completed);
    case "completed":
      return state.tasks.filter(t => t.completed);
    default:
      return state.tasks;
  }
}

function updateTaskCount() {
  const activeTasks = state.tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${activeTasks} task(s) left`;
}

// ================= RENDER =================
function render() {
  taskList.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.completed ? "completed" : ""}">
        ${task.text}
      </span>
      <div>
        <button data-action="toggle" data-index="${index}">✔</button>
        <button data-action="delete" data-index="${index}">❌</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateTaskCount();
  updateActiveFilterUI();
}

// ================= UI STATE =================
function updateActiveFilterUI() {
  filterButtons.forEach(btn => {
    btn.classList.remove("active-filter");
    if (btn.dataset.filter === state.filter) {
      btn.classList.add("active-filter");
    }
  });
}

// ================= ACTIONS =================
function addTask(text) {
  state.tasks.push({
    text,
    completed: false
  });

  saveState();
  render();
}

function toggleTask(index) {
  state.tasks[index].completed = !state.tasks[index].completed;
  saveState();
  render();
}

function deleteTask(index) {
  state.tasks.splice(index, 1);
  saveState();
  render();
}

function clearCompleted() {
  state.tasks = state.tasks.filter(t => !t.completed);
  saveState();
  render();
}

// ================= EVENTS =================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  addTask(text);
  input.value = "";
});

taskList.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  const index = e.target.dataset.index;

  if (action === "toggle") toggleTask(index);
  if (action === "delete") deleteTask(index);
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    state.filter = btn.dataset.filter;
    render();
  });
});

clearBtn.addEventListener("click", clearCompleted);

// ================= INIT =================
render();