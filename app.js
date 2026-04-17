// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log("SW error", err));
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    renderTasks();
});

function updateDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString(undefined, options);
}

function addTask() {
    const input = document.getElementById('taskInput');
    const time = document.getElementById('taskTime');
    
    if (!input.value.trim()) return;

    const newTask = {
        id: Date.now(),
        text: input.value,
        time: time.value,
        completed: false
    };

    // Save to Persistence
    const tasks = getTasks();
    tasks.push(newTask);
    saveTasks(tasks);

    // Reset UI
    input.value = '';
    time.value = '';
    renderTasks();
}

function getTasks() {
    return JSON.parse(localStorage.getItem('myFocusTasks')) || [];
}

function saveTasks(tasks) {
    localStorage.setItem('myFocusTasks', JSON.stringify(tasks));
}

function deleteTask(id) {
    const tasks = getTasks().filter(t => t.id !== id);
    saveTasks(tasks);
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    const tasks = getTasks();
    const now = new Date().getTime();

    // Update Stats
    document.getElementById('taskCount').innerText = tasks.length;
    document.getElementById('completedCount').innerText = tasks.filter(t => t.completed).length;

    // Clear and build list
    list.innerHTML = '';
    
    tasks.sort((a, b) => new Date(a.time) - new Date(b.time)).forEach(t => {
        const isOverdue = t.time && new Date(t.time).getTime() < now;
        const li = document.createElement('li');
        if (isOverdue) li.className = 'overdue';
        
        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${t.text}</span>
                <span class="task-time">${t.time ? new Date(t.time).toLocaleString() : 'No deadline'}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${t.id})">✕</button>
        `;
        list.appendChild(li);
    });
}
