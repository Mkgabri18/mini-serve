import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createNote, getAllNotes, resetNotes } from './notes.services.js';

test('Notes Service', async (t) => {
    beforeEach(() => {
        resetNotes([]); // Resetta l'array di note per isolare ciascun test
    });

    await t.test('should start with an empty notes list', () => {
        assert.deepEqual(getAllNotes(), []);
    });

    await t.test('should successfully create a new note', () => {
        const newNote = createNote({ title: 'Test Note', content: 'Test Content' });

        assert.equal(newNote.id, 1);
        assert.equal(newNote.title, 'Test Note');
        assert.equal(newNote.content, 'Test Content');
        assert.equal(getAllNotes().length, 1);
    });

    await t.test('should return an error if title is missing', () => {
        const result = createNote({ content: 'No title here' });
        assert.ok(result.error);
        assert.equal(result.error, "Il campo 'title' è obbligatorio");
    });
});
