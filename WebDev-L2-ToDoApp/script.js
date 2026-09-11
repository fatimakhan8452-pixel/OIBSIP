const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

const pendingTasksContainer = document.getElementById("pendingTasks");
const completedTasksContainer = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const formMessage = document.getElementById("formMessage");

let tasks = JSON.parse(localStorage.getItem("taskflow_tasks")) || [];

function saveTasks() {
    localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
}

function createId() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}

function formatDate(dateValue) {
    const date = new Date(dateValue);

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function showMessage(message = "", isError = true) {
    formMessage.textContent = message;
    formMessage.style.color = isError ? "#dc2626" : "#16a34a";
}

function renderTasks() {
    const pending = tasks.filter((task) => !task.completed);
    const completed = tasks.filter((task) => task.completed);

    pendingCount.textContent =
        `${pending.length} ${pending.length === 1 ? "pending" : "pending"}`;

    completedCount.textContent =
        `${completed.length} ${completed.length === 1 ? "completed" : "completed"}`;

    pendingTasksContainer.innerHTML = "";
    completedTasksContainer.innerHTML = "";

    if (pending.length === 0) {
        pendingTasksContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✓</div>
                <h3>No pending tasks</h3>
                <p>
                    You're all caught up. Add a new task to get started.
                </p>
            </div>
        `;
    } else {
        pending.forEach((task) => {
            pendingTasksContainer.appendChild(createTaskElement(task));
        });
    }

    if (completed.length === 0) {
        completedTasksContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✓</div>
                <h3>No completed tasks</h3>
                <p>
                    Completed tasks will appear here.
                </p>
            </div>
        `;
    } else {
        completed.forEach((task) => {
            completedTasksContainer.appendChild(createTaskElement(task));
        });
    }
}

function createTaskElement(task) {
    const taskItem = document.createElement("article");

    taskItem.className = `task-item ${task.completed ? "completed" : ""}`;
    taskItem.dataset.id = task.id;

    taskItem.innerHTML = `
        <div class="task-main">

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
                aria-label="Mark task complete"
            >

            <div class="task-content">
                <div class="task-text"></div>

                <div class="task-time">
                    Added: ${formatDate(task.createdAt)}
                    ${
                        task.completedAt
                            ? `<br>Completed: ${formatDate(task.completedAt)}`
                            : ""
                    }
                </div>
            </div>

        </div>

        <div class="task-actions">

            <button class="task-action complete-btn" type="button">
                ${task.completed ? "Mark Pending" : "Mark Complete"}
            </button>

            <button class="task-action edit-btn" type="button">
                Edit
            </button>

            <button class="task-action delete-btn" type="button">
                Delete
            </button>

        </div>
    `;

    const textElement = taskItem.querySelector(".task-text");
    textElement.textContent = task.text;

    const checkbox = taskItem.querySelector(".task-checkbox");

    checkbox.addEventListener("change", () => {
        toggleComplete(task.id);
    });

    const completeButton = taskItem.querySelector(".complete-btn");

    completeButton.addEventListener("click", () => {
        toggleComplete(task.id);
    });

    const editButton = taskItem.querySelector(".edit-btn");

    editButton.addEventListener("click", () => {
        startEdit(taskItem, task);
    });

    const deleteButton = taskItem.querySelector(".delete-btn");

    deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
    });

    return taskItem;
}

function addTask(taskText) {
    const cleanedText = taskText.trim();

    if (!cleanedText) {
        showMessage("Please enter a task.");
        return;
    }

    const newTask = {
        id: createId(),
        text: cleanedText,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.unshift(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    showMessage("Task added successfully.", false);

    taskInput.focus();
}

function toggleComplete(taskId) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    if (task.completed) {
        task.completedAt = new Date().toISOString();
    } else {
        task.completedAt = null;
    }

    saveTasks();
    renderTasks();
}

function startEdit(taskElement, task) {
    const textElement = taskElement.querySelector(".task-text");
    const actions = taskElement.querySelector(".task-actions");

    const currentText = task.text;

    const input = document.createElement("input");

    input.type = "text";
    input.className = "edit-input";
    input.value = currentText;
    input.maxLength = 150;

    textElement.replaceWith(input);

    actions.innerHTML = "";

    const saveButton = document.createElement("button");

    saveButton.type = "button";
    saveButton.className = "task-action save-btn";
    saveButton.textContent = "Save";

    const cancelButton = document.createElement("button");

    cancelButton.type = "button";
    cancelButton.className = "task-action cancel-btn";
    cancelButton.textContent = "Cancel";

    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);

    input.focus();
    input.select();

    saveButton.addEventListener("click", () => {
        const updatedText = input.value.trim();

        if (!updatedText) {
            alert("Task cannot be empty.");
            input.focus();
            return;
        }

        task.text = updatedText;

        saveTasks();
        renderTasks();
    });

    cancelButton.addEventListener("click", () => {
        renderTasks();
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            saveButton.click();
        }

        if (event.key === "Escape") {
            cancelButton.click();
        }
    });
}

function deleteTask(taskId) {
    const taskExists = tasks.some((task) => task.id === taskId);

    if (!taskExists) {
        return;
    }

    const confirmed = confirm("Are you sure you want to delete this task?");

    if (!confirmed) {
        return;
    }

    tasks = tasks.filter((task) => task.id !== taskId);

    saveTasks();
    renderTasks();
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask(taskInput.value);
});

renderTasks();