// Array to store tasks
let tasks = [];

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        // Create a new task object and add it to the tasks array
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(newTask);
        taskInput.value = ''; // Clear input field
        renderTasks(); // Update the displayed task list
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear the current list
    
    tasks.forEach(task => {
        // Create task elements
        const taskItem = document.createElement('li');
        taskItem.className = 'task';
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onclick = () => toggleTaskCompletion(task.id);
        
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.onclick = () => deleteTask(task.id);
        
        // Append elements
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
    });
}

function toggleTaskCompletion(id) {
    // Find the task and toggle its completion status
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function deleteTask(id) {
    // Filter out the task by id
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}
// ========== Helper Functions ==========
function setFilter(newFilter) {
    filter = newFilter;
    renderTasks();
}

function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

function searchTasks(query) {
    // Code for filtering tasks by search query
    const searchResults = tasks.filter(task => task.text.toLowerCase().includes(query.toLowerCase()));
    renderSearchResults(searchResults); // Render only the results
}

// ========== Additional Features ==========
function editTask(id) {
    // Code for editing a task
    saveTasks();
    renderTasks();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // Optionally, save the theme choice in local storage
}

function sortBy(criteria) {
    tasks.sort((a, b) => {
        if (criteria === 'date') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (criteria === 'priority') {
            return a.priority.localeCompare(b.priority);
        }
    });
    renderTasks();
}

// ========== Utility Functions ==========
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = Math.round((completedTasks / tasks.length) * 100);
    document.getElementById('progress').textContent = `Progress: ${progress}%`;
}

// Call loadTasks once when the page loads
window.onload = loadTasks;