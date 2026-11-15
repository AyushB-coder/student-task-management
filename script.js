/**
 * ==========================================================================
 * Student Task Management System
 * Client-Side JavaScript Application Logic
 * 
 * Features:
 * - Pure LocalStorage persistence (No external database required)
 * - Complete CRUD (Create, Read, Update, Delete) functionality
 * - Real-time statistics counters (Total, Pending, Completed, Overdue)
 * - Search by Title, Subject, and Description
 * - Filtering by Status and Priority
 * - Multiple Sorting Options
 * - Seeded Academic Sample Tasks
 * ==========================================================================
 */

// Strict Mode
'use strict';

// LocalStorage Key
const STORAGE_KEY = 'student_task_manager_tasks_v1';

// Initial Sample Academic Tasks (Pre-loaded if localStorage is empty)
const SAMPLE_TASKS = [
    {
        id: 'task-sample-1',
        title: 'CI/CD Pipeline Setup for Web Application',
        subject: 'Cloud & DevOps Engineering',
        description: 'Configure automated build and deployment pipelines using GitHub, Jenkins, and Docker containers on AWS EC2.',
        dueDate: getRelativeDate(3), // 3 days from today
        priority: 'High',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
        id: 'task-sample-2',
        title: 'Operating Systems Kernel Concurrency Lab',
        subject: 'Operating Systems',
        description: 'Complete thread synchronization assignment using mutex locks and semaphores in C/C++.',
        dueDate: getRelativeDate(-2), // 2 days overdue
        priority: 'High',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
        id: 'task-sample-3',
        title: 'Database Schema Normalization & Indexing Report',
        subject: 'Database Management Systems',
        description: 'Submit technical documentation detailing 3NF and BCNF normalization along with B-Tree index benchmarks.',
        dueDate: getRelativeDate(5), // 5 days from today
        priority: 'Medium',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 'task-sample-4',
        title: 'Computer Networks Packet Tracer Lab Submission',
        subject: 'Computer Networks',
        description: 'Simulate multi-router OSPF network topology and verify routing table convergence.',
        dueDate: getRelativeDate(-1), // Completed yesterday
        priority: 'Low',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    }
];

// Helper to generate ISO date strings relative to today (YYYY-MM-DD)
function getRelativeDate(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Global Application State
let tasksState = [];
let activeStatusFilter = 'all';
let activePriorityFilter = 'all';
let activeSearchQuery = '';
let activeSortOption = 'dueDateAsc';
let taskToDeleteId = null;

// DOM Elements
const elements = {
    // Stats
    totalTasksCount: document.getElementById('totalTasksCount'),
    pendingTasksCount: document.getElementById('pendingTasksCount'),
    completedTasksCount: document.getElementById('completedTasksCount'),
    overdueTasksCount: document.getElementById('overdueTasksCount'),
    
    // Task Grid & Section
    taskListContainer: document.getElementById('taskListContainer'),
    emptyState: document.getElementById('emptyState'),
    emptyStateText: document.getElementById('emptyStateText'),
    emptyStateAddBtn: document.getElementById('emptyStateAddBtn'),
    taskSectionTitle: document.getElementById('taskSectionTitle'),
    activeFilterCount: document.getElementById('activeFilterCount'),
    resetSampleDataBtn: document.getElementById('resetSampleDataBtn'),

    // Search & Filter Controls
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    statusFilterBtns: document.querySelectorAll('.filter-btn'),
    priorityFilter: document.getElementById('priorityFilter'),
    sortBy: document.getElementById('sortBy'),

    // Sidebar & Navigation
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    toggleSidebarBtn: document.getElementById('toggleSidebarBtn'),
    closeSidebarBtn: document.getElementById('closeSidebarBtn'),
    sidebarNavLinks: document.querySelectorAll('.sidebar-nav .nav-links li'),

    // Task Modal & Form
    taskModal: document.getElementById('taskModal'),
    openAddTaskBtn: document.getElementById('openAddTaskBtn'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelModalBtn: document.getElementById('cancelModalBtn'),
    taskForm: document.getElementById('taskForm'),
    modalTitle: document.getElementById('modalTitle'),
    modalIcon: document.getElementById('modalIcon'),
    saveBtnText: document.getElementById('saveBtnText'),
    taskIdInput: document.getElementById('taskId'),
    taskTitleInput: document.getElementById('taskTitle'),
    taskSubjectInput: document.getElementById('taskSubject'),
    taskPriorityInput: document.getElementById('taskPriority'),
    taskDueDateInput: document.getElementById('taskDueDate'),
    taskDescriptionInput: document.getElementById('taskDescription'),
    charCount: document.getElementById('charCount'),

    // Form Errors
    titleError: document.getElementById('titleError'),
    subjectError: document.getElementById('subjectError'),
    dueDateError: document.getElementById('dueDateError'),

    // Delete Modal
    deleteConfirmModal: document.getElementById('deleteConfirmModal'),
    closeDeleteModalBtn: document.getElementById('closeDeleteModalBtn'),
    cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
    deleteTaskTitle: document.getElementById('deleteTaskTitle'),

    // Toasts
    toastContainer: document.getElementById('toastContainer')
};

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadTasks();
    registerEventListeners();
    updateUI();
}

// Load tasks from LocalStorage or seed with samples
function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            tasksState = JSON.parse(stored);
        } else {
            tasksState = [...SAMPLE_TASKS];
            saveTasks();
        }
    } catch (e) {
        console.error('Failed to read from localStorage:', e);
        tasksState = [...SAMPLE_TASKS];
    }
}

// Persist tasks state to LocalStorage
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksState));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
        showToast('Storage quota exceeded or unavailable', 'danger');
    }
}

// ==========================================================================
// Event Listeners Registration
// ==========================================================================
function registerEventListeners() {
    // Add Task Button
    elements.openAddTaskBtn.addEventListener('click', () => openTaskModal());
    elements.emptyStateAddBtn.addEventListener('click', () => openTaskModal());

    // Modal Close Triggers
    elements.closeModalBtn.addEventListener('click', closeTaskModal);
    elements.cancelModalBtn.addEventListener('click', closeTaskModal);
    elements.taskModal.addEventListener('click', (e) => {
        if (e.target === elements.taskModal) closeTaskModal();
    });

    // Form Submission
    elements.taskForm.addEventListener('submit', handleTaskFormSubmit);

    // Textarea Character Count
    elements.taskDescriptionInput.addEventListener('input', (e) => {
        elements.charCount.textContent = e.target.value.length;
    });

    // Delete Modal Triggers
    elements.closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    elements.cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    elements.deleteConfirmModal.addEventListener('click', (e) => {
        if (e.target === elements.deleteConfirmModal) closeDeleteModal();
    });
    elements.confirmDeleteBtn.addEventListener('click', confirmDeleteTask);

    // Search Input
    elements.searchInput.addEventListener('input', (e) => {
        activeSearchQuery = e.target.value.trim().toLowerCase();
        elements.clearSearchBtn.style.display = activeSearchQuery ? 'block' : 'none';
        updateUI();
    });

    elements.clearSearchBtn.addEventListener('click', () => {
        elements.searchInput.value = '';
        activeSearchQuery = '';
        elements.clearSearchBtn.style.display = 'none';
        updateUI();
    });

    // Filter Buttons (Status)
    elements.statusFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.statusFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeStatusFilter = btn.dataset.status;
            syncSidebarNav(activeStatusFilter);
            updateUI();
        });
    });

    // Priority Filter Dropdown
    elements.priorityFilter.addEventListener('change', (e) => {
        activePriorityFilter = e.target.value;
        updateUI();
    });

    // Sorting Dropdown
    elements.sortBy.addEventListener('change', (e) => {
        activeSortOption = e.target.value;
        updateUI();
    });

    // Reset Sample Data
    elements.resetSampleDataBtn.addEventListener('click', () => {
        if (confirm('Reset all tasks back to default academic sample tasks? This will overwrite your current list.')) {
            tasksState = [...SAMPLE_TASKS];
            saveTasks();
            updateUI();
            showToast('Sample tasks reloaded successfully', 'info');
        }
    });

    // Sidebar Navigation Links
    elements.sidebarNavLinks.forEach(linkItem => {
        linkItem.addEventListener('click', () => {
            const filter = linkItem.dataset.filter;
            if (filter) {
                elements.sidebarNavLinks.forEach(l => l.classList.remove('active'));
                linkItem.classList.add('active');
                
                // Sync filter button
                elements.statusFilterBtns.forEach(b => {
                    b.classList.toggle('active', b.dataset.status === filter);
                });
                activeStatusFilter = filter;
                updateUI();

                // Close mobile sidebar if open
                closeSidebar();
            }
        });
    });

    // Sidebar Mobile Toggle
    elements.toggleSidebarBtn.addEventListener('click', openSidebar);
    elements.closeSidebarBtn.addEventListener('click', closeSidebar);
    elements.sidebarOverlay.addEventListener('click', closeSidebar);

    // Escape key closes modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (elements.taskModal.classList.contains('show')) closeTaskModal();
            if (elements.deleteConfirmModal.classList.contains('show')) closeDeleteModal();
            closeSidebar();
        }
    });
}

function syncSidebarNav(filter) {
    elements.sidebarNavLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.filter === filter);
    });
}

function openSidebar() {
    elements.sidebar.classList.add('open');
    elements.sidebarOverlay.classList.add('active');
}

function closeSidebar() {
    elements.sidebar.classList.remove('open');
    elements.sidebarOverlay.classList.remove('active');
}

// ==========================================================================
// Task Management CRUD Operations
// ==========================================================================

// Open Modal for Creating or Editing Task
function openTaskModal(task = null) {
    resetFormErrors();
    elements.taskForm.reset();

    if (task) {
        // Edit Mode
        elements.modalTitle.textContent = 'Edit Task';
        elements.modalIcon.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        elements.saveBtnText.textContent = 'Update Task';
        
        elements.taskIdInput.value = task.id;
        elements.taskTitleInput.value = task.title;
        elements.taskSubjectInput.value = task.subject;
        elements.taskPriorityInput.value = task.priority;
        elements.taskDueDateInput.value = task.dueDate;
        elements.taskDescriptionInput.value = task.description || '';
        elements.charCount.textContent = (task.description || '').length;
    } else {
        // Add Mode
        elements.modalTitle.textContent = 'Add New Task';
        elements.modalIcon.innerHTML = '<i class="fa-solid fa-plus"></i>';
        elements.saveBtnText.textContent = 'Save Task';
        
        elements.taskIdInput.value = '';
        elements.taskPriorityInput.value = 'Medium';
        elements.taskDueDateInput.value = getRelativeDate(2);
        elements.charCount.textContent = '0';
    }

    elements.taskModal.classList.add('show');
    elements.taskModal.setAttribute('aria-hidden', 'false');
    elements.taskTitleInput.focus();
}

function closeTaskModal() {
    elements.taskModal.classList.remove('show');
    elements.taskModal.setAttribute('aria-hidden', 'true');
    resetFormErrors();
}

function resetFormErrors() {
    elements.titleError.classList.remove('visible');
    elements.subjectError.classList.remove('visible');
    elements.dueDateError.classList.remove('visible');
    elements.taskTitleInput.classList.remove('is-invalid');
    elements.taskSubjectInput.classList.remove('is-invalid');
    elements.taskDueDateInput.classList.remove('is-invalid');
}

// Form Submission Handler
function handleTaskFormSubmit(e) {
    e.preventDefault();

    const title = elements.taskTitleInput.value.trim();
    const subject = elements.taskSubjectInput.value.trim();
    const priority = elements.taskPriorityInput.value;
    const dueDate = elements.taskDueDateInput.value;
    const description = elements.taskDescriptionInput.value.trim();
    const existingId = elements.taskIdInput.value;

    // Validation
    let isValid = true;
    resetFormErrors();

    if (!title) {
        elements.titleError.classList.add('visible');
        elements.taskTitleInput.classList.add('is-invalid');
        isValid = false;
    }

    if (!subject) {
        elements.subjectError.classList.add('visible');
        elements.taskSubjectInput.classList.add('is-invalid');
        isValid = false;
    }

    if (!dueDate) {
        elements.dueDateError.classList.add('visible');
        elements.taskDueDateInput.classList.add('is-invalid');
        isValid = false;
    }

    if (!isValid) return;

    if (existingId) {
        // Update existing task
        const index = tasksState.findIndex(t => t.id === existingId);
        if (index !== -1) {
            tasksState[index] = {
                ...tasksState[index],
                title,
                subject,
                priority,
                dueDate,
                description,
                updatedAt: new Date().toISOString()
            };
            saveTasks();
            updateUI();
            closeTaskModal();
            showToast('Task updated successfully!', 'success');
        }
    } else {
        // Create new task
        const newTask = {
            id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            title,
            subject,
            priority,
            dueDate,
            description,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        tasksState.unshift(newTask);
        saveTasks();
        updateUI();
        closeTaskModal();
        showToast('New task added successfully!', 'success');
    }
}

// Toggle Task Status (Completed <-> Pending)
function toggleTaskStatus(taskId) {
    const task = tasksState.find(t => t.id === taskId);
    if (!task) return;

    if (task.status === 'completed') {
        task.status = 'pending';
        showToast('Task marked as Pending', 'info');
    } else {
        task.status = 'completed';
        showToast('Task marked as Completed! Great job! 🎉', 'success');
    }

    saveTasks();
    updateUI();
}

// Trigger Delete Modal
function promptDeleteTask(taskId) {
    const task = tasksState.find(t => t.id === taskId);
    if (!task) return;

    taskToDeleteId = taskId;
    elements.deleteTaskTitle.textContent = `"${task.title}" (${task.subject})`;
    elements.deleteConfirmModal.classList.add('show');
    elements.deleteConfirmModal.setAttribute('aria-hidden', 'false');
}

function closeDeleteModal() {
    elements.deleteConfirmModal.classList.remove('show');
    elements.deleteConfirmModal.setAttribute('aria-hidden', 'true');
    taskToDeleteId = null;
}

function confirmDeleteTask() {
    if (!taskToDeleteId) return;

    tasksState = tasksState.filter(t => t.id !== taskToDeleteId);
    saveTasks();
    updateUI();
    closeDeleteModal();
    showToast('Task deleted successfully', 'danger');
}

// Edit Task Trigger
function editTask(taskId) {
    const task = tasksState.find(t => t.id === taskId);
    if (task) {
        openTaskModal(task);
    }
}

// ==========================================================================
// Date & Status Helpers
// ==========================================================================

// Check if a task is overdue (Due date is before start of today and not completed)
function isTaskOverdue(dueDateString, status) {
    if (status === 'completed') return false;
    if (!dueDateString) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = dueDateString.split('-').map(Number);
    const due = new Date(year, month - 1, day);
    due.setHours(0, 0, 0, 0);

    return due < today;
}

// Format date for display (e.g., "Nov 18, 2026")
function formatDateDisplay(dateString) {
    if (!dateString) return 'No due date';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Escape HTML characters to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ==========================================================================
// UI Rendering & Dashboard Calculations
// ==========================================================================

function updateUI() {
    updateStatistics();
    renderTasks();
}

// Calculate and render Dashboard Counters
function updateStatistics() {
    let total = tasksState.length;
    let completed = 0;
    let overdue = 0;
    let pending = 0;

    tasksState.forEach(task => {
        if (task.status === 'completed') {
            completed++;
        } else if (isTaskOverdue(task.dueDate, task.status)) {
            overdue++;
        } else {
            pending++;
        }
    });

    elements.totalTasksCount.textContent = total;
    elements.completedTasksCount.textContent = completed;
    elements.overdueTasksCount.textContent = overdue;
    elements.pendingTasksCount.textContent = pending;
}

// Filter, Sort, and Render Task Cards
function renderTasks() {
    // 1. Filter Tasks
    let filtered = tasksState.filter(task => {
        const isOverdue = isTaskOverdue(task.dueDate, task.status);

        // Status Filter
        if (activeStatusFilter === 'pending') {
            if (task.status === 'completed' || isOverdue) return false;
        } else if (activeStatusFilter === 'completed') {
            if (task.status !== 'completed') return false;
        } else if (activeStatusFilter === 'overdue') {
            if (!isOverdue) return false;
        }

        // Priority Filter
        if (activePriorityFilter !== 'all') {
            if (task.priority !== activePriorityFilter) return false;
        }

        // Search Query Filter
        if (activeSearchQuery) {
            const titleMatch = task.title.toLowerCase().includes(activeSearchQuery);
            const subjectMatch = task.subject.toLowerCase().includes(activeSearchQuery);
            const descMatch = (task.description || '').toLowerCase().includes(activeSearchQuery);
            if (!titleMatch && !subjectMatch && !descMatch) return false;
        }

        return true;
    });

    // 2. Sort Tasks
    filtered.sort((a, b) => {
        if (activeSortOption === 'dueDateAsc') {
            return (a.dueDate || '').localeCompare(b.dueDate || '');
        } else if (activeSortOption === 'dueDateDesc') {
            return (b.dueDate || '').localeCompare(a.dueDate || '');
        } else if (activeSortOption === 'priority') {
            const weights = { High: 3, Medium: 2, Low: 1 };
            return (weights[b.priority] || 0) - (weights[a.priority] || 0);
        } else if (activeSortOption === 'created') {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return 0;
    });

    // 3. Update Section Title and Counter
    const filterTitleMap = {
        all: 'All Tasks',
        pending: 'Pending Tasks',
        completed: 'Completed Tasks',
        overdue: 'Overdue Tasks'
    };
    elements.taskSectionTitle.textContent = filterTitleMap[activeStatusFilter] || 'Tasks';
    elements.activeFilterCount.textContent = filtered.length;

    // 4. Render or Show Empty State
    if (filtered.length === 0) {
        elements.taskListContainer.innerHTML = '';
        elements.emptyState.style.display = 'flex';
        if (activeSearchQuery) {
            elements.emptyStateText.textContent = `No tasks matching "${activeSearchQuery}".`;
        } else if (activeStatusFilter === 'overdue') {
            elements.emptyStateText.textContent = 'Great news! No overdue tasks right now.';
        } else if (activeStatusFilter === 'completed') {
            elements.emptyStateText.textContent = 'No completed tasks yet. Finish a task and mark it done!';
        } else {
            elements.emptyStateText.textContent = 'No tasks match the active filters.';
        }
    } else {
        elements.emptyState.style.display = 'none';
        elements.taskListContainer.innerHTML = filtered.map(task => renderTaskCard(task)).join('');
        
        // Attach dynamic card event handlers
        attachCardEventListeners();
    }
}

// Generate HTML for an individual Task Card
function renderTaskCard(task) {
    const isCompleted = task.status === 'completed';
    const isOverdue = isTaskOverdue(task.dueDate, task.status);

    let statusClass = 'pending';
    let statusLabel = 'Pending';
    let statusIcon = 'fa-clock';

    if (isCompleted) {
        statusClass = 'completed';
        statusLabel = 'Completed';
        statusIcon = 'fa-circle-check';
    } else if (isOverdue) {
        statusClass = 'overdue';
        statusLabel = 'Overdue';
        statusIcon = 'fa-triangle-exclamation';
    }

    const priorityClass = (task.priority || 'medium').toLowerCase();

    return `
        <article class="task-card ${isCompleted ? 'is-completed' : ''} ${isOverdue ? 'is-overdue' : ''}" data-id="${task.id}">
            <div class="task-card-header">
                <span class="subject-badge">
                    <i class="fa-solid fa-book-bookmark"></i>
                    ${escapeHtml(task.subject)}
                </span>
                <span class="priority-badge ${priorityClass}">
                    <i class="fa-solid fa-flag"></i>
                    ${escapeHtml(task.priority)}
                </span>
            </div>

            <div class="task-card-body">
                <h4 class="task-title" title="${escapeHtml(task.title)}">
                    ${isCompleted ? '<i class="fa-solid fa-check" style="color: var(--success);"></i>' : ''}
                    ${escapeHtml(task.title)}
                </h4>
                <p class="task-desc">${escapeHtml(task.description || 'No description provided.')}</p>
            </div>

            <div class="task-card-meta">
                <div class="due-date-info ${isOverdue ? 'overdue' : ''}">
                    <i class="fa-regular fa-calendar-days"></i>
                    <span>${formatDateDisplay(task.dueDate)}</span>
                </div>
                <span class="status-indicator ${statusClass}">
                    <i class="fa-solid ${statusIcon}"></i>
                    ${statusLabel}
                </span>
            </div>

            <div class="task-card-actions">
                <button class="btn-toggle-status" data-action="toggle" data-id="${task.id}" title="${isCompleted ? 'Mark Pending' : 'Mark Completed'}">
                    <i class="fa-solid ${isCompleted ? 'fa-rotate-left' : 'fa-check'}"></i>
                    <span>${isCompleted ? 'Mark Pending' : 'Mark Complete'}</span>
                </button>
                <div class="action-icon-group">
                    <button class="btn-icon-action btn-edit" data-action="edit" data-id="${task.id}" title="Edit Task">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon-action btn-delete" data-action="delete" data-id="${task.id}" title="Delete Task">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Attach event delegation for task card buttons
function attachCardEventListeners() {
    const cardButtons = elements.taskListContainer.querySelectorAll('button[data-action]');
    cardButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            const id = btn.dataset.id;

            if (action === 'toggle') {
                toggleTaskStatus(id);
            } else if (action === 'edit') {
                editTask(id);
            } else if (action === 'delete') {
                promptDeleteTask(id);
            }
        });
    });
}

// ==========================================================================
// Toast Notification Utility
// ==========================================================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'danger') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${iconClass} toast-icon"></i>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}
