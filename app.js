function addTask() {
    const input = document.getElementById('taskInput');
    const time = document.getElementById('taskTime');
    
    if (input.value === '') return;

    const task = {
        id: Date.now(),
        text: input.value,
        time: time.value,
        completed: false
    };

    saveTask(task);
    renderTasks();
    input.value = '';
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    tasks.push(task);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function renderTasks() {
    const list = document.getElementById('taskList');
    const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    list.innerHTML = tasks.map(t => `
        <li>
            <strong>${t.text}</strong><br>
            <small>${t.time.replace('T', ' ')}</small>
        </li>
    `).join('');
}

// Run on startup
renderTasks();