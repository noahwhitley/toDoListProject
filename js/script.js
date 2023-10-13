//creating constants
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const newTaskInput = document.getElementById('newTaskInput');
const listSelectorContainer = document.querySelector('.dropdown-container');
const listNameInput = document.getElementById('listNameInput');
const createListBtn = document.getElementById('createListBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || {};

let currentList = 'default';

// Functions

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = ''; // Clear the current tasks

    for (const task of tasks[currentList] || []) {
        const li = document.createElement('li');
        li.textContent = task;

        // Delete button for each task
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() {
            tasks[currentList] = tasks[currentList].filter(t => t !== task);
            saveTasks();
            renderTasks();
        };
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    }
}

function addTask() {
    const taskText = newTaskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    if (!tasks[currentList]) {
        tasks[currentList] = [];
    }

    tasks[currentList].push(taskText);
    saveTasks();

    newTaskInput.value = '';
    renderTasks();
}

function createList() {
    const listName = listNameInput.value.trim();

    if (listName === '' || tasks[listName]) {
        alert('Please enter a valid list name.');
        return;
    }

    tasks[listName] = [];
    saveTasks();

    listNameInput.value = '';
    populateListSelector();
}

function deleteList(listName) {
    delete tasks[listName];
    saveTasks();
    populateListSelector();
    currentList = 'default';
    renderTasks();
}

function populateListSelector() {
    listSelectorContainer.innerHTML = '<select id="listSelector"></select>';
    const listSelector = document.getElementById('listSelector');
    
    for (const list in tasks) {
        const option = document.createElement('option');
        option.value = list;
        option.textContent = list;
        listSelector.appendChild(option);
    }

    // Add delete button for current list
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete List";
    deleteButton.className = "delete-list";
    deleteButton.onclick = function() {
        const selectedList = listSelector.value;
        if (selectedList === 'default') {
            alert('Cannot delete the default list.');
            return;
        }
        if (confirm(`Are you sure you want to delete the list "${selectedList}"?`)) {
            deleteList(selectedList);
        }
    };
    listSelectorContainer.appendChild(deleteButton);

    listSelector.addEventListener('change', function() {
        currentList = listSelector.value;
        renderTasks();
    });
}

// Event Listeners

addTaskBtn.addEventListener('click', addTask);

newTaskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

createListBtn.addEventListener('click', createList);

// Initialization

function init() {
    populateListSelector();
    renderTasks();
}

init();