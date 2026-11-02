import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCommand, execute } from '../src/notes.js';

test('parse and trim a note', () => {
  assert.deepEqual(parseCommand(['add', ' hello ', 'world ']),
    { command: 'add', text: 'hello  world' });
});
test('reject empty, excessive, and unknown input', () => {
  for (const args of [[], ['add', ' '], ['add', 'x'.repeat(1001)],
    ['remove'], ['list', 'extra']]) {
    assert.throws(() => parseCommand(args), /Usage:/);
  }
});
test('insert a timestamped document', async () => {
  let inserted;
  const collection = { async insertOne(doc) {
    inserted = doc; return { insertedId: 'abc' };
  }};
  assert.equal(await execute(collection, { command: 'add', text: 'Hello' }),
    'Saved: abc');
  assert.equal(inserted.text, 'Hello');
  assert.ok(inserted.createdAt instanceof Date);
});
test('list the 20 newest notes', async () => {
  const cursor = {
    sort(value) { assert.deepEqual(value, { createdAt: -1, _id: -1 }); return this; },
    limit(value) { assert.equal(value, 20); return this; },
    async toArray() { return [{ _id: 'abc', text: 'Hello' }]; }
  };
  const collection = { find(query) { assert.deepEqual(query, {}); return cursor; } };
  assert.equal(await execute(collection, { command: 'list' }), 'abc: Hello');
});
test('empty database message', async () => {
  const cursor = { sort() { return this; }, limit() { return this; },
    async toArray() { return []; } };
  assert.equal(await execute({ find: () => cursor }, { command: 'list' }),
    'No notes yet.');
});
test('database errors propagate', async () => {
  await assert.rejects(execute({ async insertOne() { throw new Error('offline'); } },
    { command: 'add', text: 'Hello' }), /offline/);
});
