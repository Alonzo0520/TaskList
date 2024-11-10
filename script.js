// Task data array
let tasks = [];
let filter = 'all'; // Filter to display all tasks by default

// Core Functions
function addTask() {
    const taskInput = document.getElementById('taskInput').value.trim();
    const taskDueDate = document.getElementById('taskDueDate').value;
    const taskPriority = document.getElementById('taskPriority').value;

    if (taskInput) {
        const newTask = {
            id: Date.now(),
            text: taskInput,
            completed: false,
            dueDate: taskDueDate,
            priority: taskPriority
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        document.getElementById('taskInput').value = ''; // Clear the input field
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'incomplete') {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.className = 'task' + (task.completed ? ' completed' : '');

        // Set priority color
        let priorityClass;
        switch (task.priority) {
            case 'High':
                priorityClass = 'high-priority';
                break;
            case 'Medium':
                priorityClass = 'medium-priority';
                break;
            case 'Low':
                priorityClass = 'low-priority';
                break;
            default:
                priorityClass = '';
        }

        // Add priority class and inline style for additional check
        console.log(`Adding class ${priorityClass} to task with priority ${task.priority}`);
        if (priorityClass) {
            taskElement.classList.add(priorityClass);
            taskElement.style.backgroundColor = priorityClass === 'high-priority' ? '#f8d7da' : 
                                                priorityClass === 'medium-priority' ? '#fff3cd' : 
                                                '#d4edda';
        }

        taskElement.innerHTML = `
            <input type="checkbox" onclick="toggleTaskCompletion(${task.id})" ${task.completed ? 'checked' : ''}>
            ${task.text} (Due: ${task.dueDate || 'No date'}, Priority: <span>${task.priority}</span>)
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        taskList.appendChild(taskElement);
    });

    updateProgress();
}

function toggleTaskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Helper Functions
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
    const searchResults = tasks.filter(task => task.text.toLowerCase().includes(query.toLowerCase()));
    renderSearchResults(searchResults);
}

function renderSearchResults(searchResults) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    searchResults.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.className = 'task' + (task.completed ? ' completed' : '');
        taskElement.innerHTML = `
            <input type="checkbox" onclick="toggleTaskCompletion(${task.id})" ${task.completed ? 'checked' : ''}>
            ${task.text} (Due: ${task.dueDate || 'No date'}, Priority: ${task.priority})
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(taskElement);
    });
}

// Additional Features
function sortBy(criteria) {
    if (criteria === 'date') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (criteria === 'priority') {
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    renderTasks();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Save the current dark mode state to local storage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Utility Functions
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
    const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
    document.getElementById('progress').textContent = `Progress: ${progress.toFixed(0)}%`;
}

// Load tasks and apply saved dark mode on page load
window.onload = function() {
    loadTasks();

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
};