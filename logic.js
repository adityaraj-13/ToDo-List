document.addEventListener('DOMContentLoaded',()=>{
    //Storing the name of user of better UX 
    const userName = localStorage.getItem('userName');
    
    if(!userName){
        const name = prompt('Please enter your name: ');
        if(name){
            localStorage.setItem('userName',name);
            displayWelcomeMsg(name);
        }
    }
    else{
        displayWelcomeMsg(userName);
    }
    //displaying the welcome msg with the given user name
    function displayWelcomeMsg(name){
        const welcomeMsg = document.getElementById('welcome-msg');
        welcomeMsg.textContent = `Hello, ${name}! Welcome to your To-Do List.`;
    }
    //Running clock on web page 
    function updateClock(){
        const now = new Date();
        const time = now.toLocaleTimeString();
        const date = now.toLocaleDateString();
        const day = now.getDay();
        const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        document.getElementById('clock').textContent = `${dayList[day]} | | ${date} | |  ${time} `;
    
    }
    
    updateClock();
    setInterval(updateClock,1000);//calling the function every second which makes the clock run continuously

    //feating the element for dynamic implementation of web page
    const taskInput = document.getElementById("task-name");
    const dateInput = document.getElementById("task-date");
    const addBtn = document.getElementById("add");
    const ongoingList = document.querySelector(".ongoing");
    const completedList = document.querySelector(".completed");

    //loading the saved task on web page from local storage 
    function loadTasks(){
        const ongoingTasks = JSON.parse(localStorage.getItem('ongoingTasks')) || [];
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
        ongoingTasks.forEach(task => createTaskElement(task, ongoingList));
        completedTasks.forEach(task => createTaskElement(task, completedList, true));
    }

    //saving the task when user adds a new task 
    function saveTasks(){
        const ongoingTasks = Array.from(ongoingList.children).map(task => ({
            name: task.querySelector('.task-name').textContent,
            dueDate: task.querySelector('.due-date').textContent,
            id: task.dataset.id
        }));

        const completedTasks = Array.from(completedList.children).map(task => ({
            name: task.querySelector('.task-name').textContent,
            dueDate: task.querySelector('.due-date').textContent,
            id: task.dataset.id
        }));

        localStorage.setItem('ongoingTasks', JSON.stringify(ongoingTasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }

    // creating a task body for html when user gives input on the screen and make a task card
    function createTaskElement(task, list, isCompleted = false){
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;
    
        li.innerHTML = `
            <div class="task-row">
                <span class="task-name">${task.name}</span>
                <span class="due-date">${task.dueDate}</span>
            </div>
            <div class="task-buttons">
                ${!isCompleted ? '<button class="complete-btn"><i class="fa-regular fa-circle-check"></i></button>' : ''}
                ${!isCompleted ? `<button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>` : ''}
                <button class="delete-btn"><i class="fa-solid fa-delete-left"></i></button>
            </div>
            <div>${!isCompleted ? '<span class="timer"></span>' : ''}</div>
        `;
        list.appendChild(li);
    
        if (!isCompleted) {
            li.querySelector('.complete-btn').addEventListener('click', () => completeTask(li));
            li.querySelector('.edit-btn').addEventListener('click', () => editTask(li));
            startTimer(li);
        }
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(li));
    }
    
    //when user clicks edit button
    function editTask(taskElement){
        const newName = prompt('Edit task name:', taskElement.querySelector('.task-name').textContent);
        const newDate = prompt('Edit due date:', taskElement.querySelector('.due-date').textContent);
        if (newName && newDate) {
            taskElement.querySelector('.task-name').textContent = newName;
            taskElement.querySelector('.due-date').textContent = new Date(newDate).toLocaleString();
            saveTasks();
        }
    }

    //when user clicks delete button
    function deleteTask(taskElement){
        taskElement.remove();
        saveTasks();
    }

    //moves the completed task from ongoing task to completed task when user click complete button
    function completeTask(taskElement){
        taskElement.querySelector('.complete-btn').remove();
        taskElement.querySelector('.edit-btn').remove();
        taskElement.querySelector('.timer').remove();
        completedList.appendChild(taskElement);
        saveTasks();
    }

    // a time out timer for task making user aware of the remaining time left for the task
    function startTimer(taskElement){
        const dueDate = new Date(taskElement.querySelector('.due-date').textContent);
        const timerElement = taskElement.querySelector('.timer');

        function updateTimer(){
            const now = new Date();
            const timeRemaining = dueDate - now;

            if (timeRemaining > 0) {
                const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                timerElement.textContent = `Time left: ${hours}h ${minutes}m`;
            } else {
                timerElement.textContent = 'Time expired';
            }
        }

        updateTimer();
        setInterval(updateTimer, 60000); // Update every minute
    }

    // event listerner for click on add button for new task the entire logic starts from here 
    addBtn.addEventListener('click', () => {
        const taskName = taskInput.value.trim();
        const taskDate = dateInput.value;
        if (taskName && taskDate) {
            const task = {
                name: taskName,
                dueDate: taskDate,
                id: Date.now().toString()
            };
            createTaskElement(task, ongoingList);
            saveTasks();
            taskInput.value = '';
            dateInput.value = '';
        }
    });

    loadTasks();

});





