/**
 * Automated smoke tests for Cleanomatics Task API
 * Uses native fetch in Node 22
 */
import app from '../app.js';

let server;
const PORT = 5099;
const BASE_URL = `http://localhost:${PORT}/api`;

async function runTests() {
  console.log('🧪 Starting Cleanomatics Task API Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  server = app.listen(PORT);

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'healthy', 'GET /api/health returns 200 healthy');

    // 2. GET all tasks
    const tasksRes = await fetch(`${BASE_URL}/tasks`);
    const tasksData = await tasksRes.json();
    assert(tasksRes.status === 200 && Array.isArray(tasksData.data), 'GET /api/tasks returns array of tasks');
    assert(tasksData.meta && tasksData.meta.pagination.total > 0, 'Pagination metadata included in GET /api/tasks');

    // 3. Validation failure when creating task
    const invalidCreateRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    });
    const invalidCreateData = await invalidCreateRes.json();
    assert(invalidCreateRes.status === 400 && invalidCreateData.errors.title, 'POST /api/tasks rejects empty title with 400');

    // 4. Create new valid task
    const createRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Smoke Test Automated Task',
        description: 'Verifying end-to-end task creation via test runner.',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-12-31',
      }),
    });
    const createData = await createRes.json();
    assert(createRes.status === 201 && createData.data.title === 'Smoke Test Automated Task', 'POST /api/tasks creates task with 201');
    const newTaskId = createData.data.id;

    // 5. GET single task by ID
    const getSingleRes = await fetch(`${BASE_URL}/tasks/${newTaskId}`);
    const getSingleData = await getSingleRes.json();
    assert(getSingleRes.status === 200 && getSingleData.data.id === newTaskId, 'GET /api/tasks/:id returns correct task');

    // 6. Update task
    const updateRes = await fetch(`${BASE_URL}/tasks/${newTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'completed',
        priority: 'low',
      }),
    });
    const updateData = await updateRes.json();
    assert(
      updateRes.status === 200 &&
      updateData.data.status === 'completed' &&
      updateData.data.priority === 'low',
      'PUT /api/tasks/:id updates status and priority'
    );

    // 7. Search and Filter
    const filterRes = await fetch(`${BASE_URL}/tasks?status=completed&search=Smoke`);
    const filterData = await filterRes.json();
    assert(
      filterRes.status === 200 && filterData.data.some((t) => t.id === newTaskId),
      'GET /api/tasks?status=completed&search=Smoke finds filtered task'
    );

    // 8. Delete task
    const deleteRes = await fetch(`${BASE_URL}/tasks/${newTaskId}`, {
      method: 'DELETE',
    });
    const deleteData = await deleteRes.json();
    assert(deleteRes.status === 200 && deleteData.success === true, 'DELETE /api/tasks/:id deletes task');

    // 9. Verify 404 after deletion
    const verifyDeleteRes = await fetch(`${BASE_URL}/tasks/${newTaskId}`);
    assert(verifyDeleteRes.status === 404, 'GET /api/tasks/:id returns 404 for deleted task');

    // 10. Unknown route 404
    const unknownRes = await fetch(`${BASE_URL}/nonexistent`);
    assert(unknownRes.status === 404, 'Unknown endpoint returns 404');

    console.log(`\n🏁 Test Results: ${passed} passed, ${failed} failed.\n`);
    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests();
