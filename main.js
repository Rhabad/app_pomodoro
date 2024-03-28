const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;

const bAdd = document.querySelector('#bAdd');
const itTask = document.querySelector('#itTask');
const form = document.querySelector('#form');
const taskName = document.querySelector('#time #taskName');


renderTime();
renderTasks();

/**
 * cuando nosotros enviemos nuestro formulario, realmente no se envie
 * validamos que isTask es diferente de un String vacio
 * creamos una tarea; una vez ingresada la tarea,
 * eliminamos texto de nuestro input
 */
form.addEventListener('submit', e => {
    e.preventDefault();
    if (itTask.value !== '') {
        createTask(itTask.value);
        itTask.value = '';
        renderTasks();
    }
});

/**
 * @param {*} value 
 * definimos un nuevo objeto
 * luego agregamos este objeto al arreglo tasks
 * 
 */
function createTask(value) {

    const newTask = {
        // creamos un id dinamico
        id: (Math.random() * 100).toString(36).slice(3),
        title: value,
        completed: false
    };

    // permite agregar el elemento al inicio del arreglo
    tasks.unshift(newTask);
}

/**
 * genera un fragmente de html para tarea en el arreglo tasks
 * muestra su estado de completado con un texto done o un boton start y su titulo
 * 
 */
function renderTasks() {
    const html = tasks.map(task => {
        return `
            <div class="task">
                <div class="completed">${task.completed ? `<span class="done">Done</span>` : `<button class="start-button" data-id="${task.id}">Start</button>`}</div>
                <div class="title">${task.title}</div>
            </div>
        `;
    });

    // traemos el contenedor de los tasks y luego le ingresamos el task ingresado
    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.innerHTML = html.join('');

    const startButton = document.querySelectorAll('.task .start-button');

    startButton.forEach(button => {
        button.addEventListener('click', e => {
            if (!timer) {
                const id = button.getAttribute('data-id')
                startButtonHandler(id);
                button.textContent = 'In progress...';
            }
        });
    });
}


function startButtonHandler(id) {
    time = 2;
    current = id;
    const taskIndex = tasks.findIndex(task => task.id === id);
    taskName.textContent = tasks[taskIndex].title;

    renderTime();

    timer = setInterval(() => {
        timerHandler(id);
    }, 1000);
}
function timerHandler(id) {
    time--;
    renderTime();

    if (time === 0) {
        clearInterval(timer);
        markCompleted(id);
        timer = null;
        renderTasks();
        startBreak();
    }
}
function renderTime() {
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
function markCompleted(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].completed = true;
}
function startBreak() {
    time = 2;
    taskName.textContent = 'Break';
    renderTime();
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000);
}
function timerBreakHandler() {
    time--;
    renderTime();

    if (time === 0) {
        clearInterval(timerBreak);
        current = null;
        timerBreak = null;
        taskName.textContent = '';
        renderTasks();
    }

}