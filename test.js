/**
 * Automated Test Suite for Student Task Management System
 * Used for local verification and automated Jenkins CI/CD pipeline validation.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
    totalTests++;
    if (condition) {
        console.log(`  ✓ [PASS] ${testName}`);
        passedTests++;
    } else {
        console.error(`  ✗ [FAIL] ${testName}`);
        process.exitCode = 1;
    }
}

console.log('\n======================================================');
console.log('🧪 Running Student Task Manager Automated Test Suite');
console.log('======================================================\n');

// -----------------------------------------------------------------------------
// Test Suite 1: File Existence & Integrity Check
// -----------------------------------------------------------------------------
console.log('📁 Test Suite 1: Verifying Required Core Files...');
const requiredFiles = ['index.html', 'style.css', 'script.js', 'README.md', '.gitignore'];

requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    assert(exists, `Required file "${file}" exists`);
});

// -----------------------------------------------------------------------------
// Test Suite 2: HTML5 Semantic & Element ID Verification
// -----------------------------------------------------------------------------
console.log('\n🌐 Test Suite 2: Verifying HTML Structure & DOM Elements...');
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

assert(htmlContent.includes('<!DOCTYPE html>'), 'Valid HTML5 doctype declaration');
assert(htmlContent.includes('Student Task Manager'), 'Contains main project heading');
assert(htmlContent.includes('id="totalTasksCount"'), 'Stat counter: totalTasksCount element exists');
assert(htmlContent.includes('id="pendingTasksCount"'), 'Stat counter: pendingTasksCount element exists');
assert(htmlContent.includes('id="completedTasksCount"'), 'Stat counter: completedTasksCount element exists');
assert(htmlContent.includes('id="overdueTasksCount"'), 'Stat counter: overdueTasksCount element exists');
assert(htmlContent.includes('id="taskForm"'), 'Form: taskForm element exists');
assert(htmlContent.includes('id="searchInput"'), 'Search: searchInput element exists');
assert(htmlContent.includes('id="priorityFilter"'), 'Filter: priorityFilter select exists');
assert(htmlContent.includes('id="taskListContainer"'), 'Container: taskListContainer exists');
assert(htmlContent.includes('href="style.css"'), 'Links to stylesheet style.css');
assert(htmlContent.includes('src="script.js"'), 'Links to script file script.js');

// -----------------------------------------------------------------------------
// Test Suite 3: JavaScript Code Integrity & LocalStorage Logic
// -----------------------------------------------------------------------------
console.log('\n⚙️  Test Suite 3: Verifying JavaScript Logic & LocalStorage Integration...');
const jsContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

// Verify JS syntax using Node compiler
let syntaxValid = false;
try {
    execSync('node -c script.js', { stdio: 'pipe' });
    syntaxValid = true;
} catch (err) {
    syntaxValid = false;
}
assert(syntaxValid, 'JavaScript file compiles without syntax errors');

assert(jsContent.includes('localStorage.getItem'), 'Implements localStorage read operations');
assert(jsContent.includes('localStorage.setItem'), 'Implements localStorage write operations');
assert(jsContent.includes('handleTaskFormSubmit'), 'Implements Add/Edit task submission handler');
assert(jsContent.includes('toggleTaskStatus'), 'Implements Complete/Pending status toggler');
assert(jsContent.includes('confirmDeleteTask'), 'Implements Task deletion logic');
assert(jsContent.includes('updateStatistics'), 'Implements real-time statistics calculation');
assert(jsContent.includes('SAMPLE_TASKS'), 'Includes default academic sample tasks');

// -----------------------------------------------------------------------------
// Test Suite 4: DOM ID Consistency Check
// -----------------------------------------------------------------------------
console.log('\n🔗 Test Suite 4: Verifying DOM ID Consistency between JS and HTML...');
const getElementByIdRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const usedIds = new Set();

while ((match = getElementByIdRegex.exec(jsContent)) !== null) {
    usedIds.add(match[1]);
}

let allIdsPresent = true;
usedIds.forEach(id => {
    if (!htmlContent.includes(`id="${id}"`)) {
        console.error(`    Missing element ID in HTML: "${id}"`);
        allIdsPresent = false;
    }
});
assert(allIdsPresent, `All ${usedIds.size} getElementById references in script.js exist in index.html`);

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n======================================================');
if (process.exitCode === 1) {
    console.error(`❌ Automated Tests FAILED: ${passedTests}/${totalTests} passed.`);
    process.exit(1);
} else {
    console.log(`✅ All Automated Tests PASSED: ${passedTests}/${totalTests} tests successful!`);
    console.log('======================================================\n');
    process.exit(0);
}
