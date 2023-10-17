//constants
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const newTaskInput = document.getElementById('newTaskInput');
const listSelectorContainer = document.querySelector('.dropdown-container');
const listNameInput = document.getElementById('listNameInput');
const createListBtn = document.getElementById('createListBtn');
const removeCompletedTasksBtn = document.getElementById('removeCompletedTasksBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
let currentList = 'default';

//functions

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';

    for (const [index, task] of (tasks[currentList] || []).entries()) {
        if (task && 'text' in task) {
            const li = document.createElement('li');

            li.setAttribute('data-index', index);

            //mark task as complete
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', function() {
                if (checkbox.checked) {
                    span.classList.add('completed');
                } else {
                    span.classList.remove('completed');
                }
                if (task && 'completed' in task) {
                    task.completed = checkbox.checked;
                    saveTasks();
                }
            });
            li.appendChild(checkbox);

            const span = document.createElement('span');
            span.textContent = task.text;
            if (task && 'completed' in task && task.completed) {
                span.classList.add('completed');
                checkbox.checked = true;
            }
            li.appendChild(span);

            //up and down arrows
            const upArrow = document.createElement('button');
            upArrow.textContent = '↑';
            upArrow.className = 'reorder-button';
            upArrow.addEventListener('click', () => moveTaskUp(index));
            li.appendChild(upArrow);

            const downArrow = document.createElement('button');
            downArrow.textContent = '↓';
            downArrow.className = 'reorder-button';
            downArrow.addEventListener('click', () => moveTaskDown(index));
            li.appendChild(downArrow);

            //edit
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-button';
            editBtn.addEventListener('click', function() {
                const updatedText = prompt('Edit the task:', task.text);
                if (updatedText !== null) {
                    task.text = updatedText;
                    saveTasks();
                    renderTasks();
                }
            });
            li.appendChild(editBtn);

            //delete
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function() {
                if (task && 'text' in task) {
                    tasks[currentList] = tasks[currentList].filter((t, idx) => idx !== index);
                    saveTasks();
                    renderTasks();
                }
            });
            li.appendChild(deleteBtn);

            taskList.appendChild(li);
        }
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

    tasks[currentList].push({ text: taskText, completed: false });
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

function removeCompletedTasks() {
    tasks[currentList] = tasks[currentList].filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

function moveTaskUp(index) {
    if (index > 0) {
        [tasks[currentList][index - 1], tasks[currentList][index]] = [tasks[currentList][index], tasks[currentList][index - 1]];
        saveTasks();
        renderTasks();
    }
}

function moveTaskDown(index) {
    if (index < tasks[currentList].length - 1) {
        [tasks[currentList][index], tasks[currentList][index + 1]] = [tasks[currentList][index + 1], tasks[currentList][index]];
        saveTasks();
        renderTasks();
    }
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

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete List';
    deleteButton.className = 'delete-list';
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

//event listener
addTaskBtn.addEventListener('click', addTask);
removeCompletedTasksBtn.addEventListener('click', removeCompletedTasks);
newTaskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

createListBtn.addEventListener('click', createList);

function init() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || {};

    if (!Array.isArray(tasks['default'])) {
        tasks['default'] = [];
    }

    populateListSelector();
    renderTasks();
}

init();
