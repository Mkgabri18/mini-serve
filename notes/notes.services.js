import { readFileSync } from "node:fs";

let notes = [];
try {
  const dataPath = new URL('./notes.json', import.meta.url);
  notes = JSON.parse(readFileSync(dataPath, 'utf-8'));
} catch (error) {
  notes = [];
}

let idCounter = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;

export function resetNotes(newNotes = []) {
  notes = [...newNotes];
  idCounter = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
}

export function getAllNotes() {
  return notes;
}

export function getNoteById(id) {
  return notes.find(n => n.id === parseInt(id));
}

export function createNote(data) {
  if (!data || !data.title) {
    return { error: "The field 'title' is required" };
  }

  const note = {
    id: idCounter++,
    title: data.title,
    content: data.content || ""
  };
  notes.push(note);
  return note;
}

export function updateNote(id, data) {
  const index = notes.findIndex(n => n.id === parseInt(id));
  if (index === -1) return null;

  // Partial merge: overrides only fields actually sent by the client
  const { id: _ignored, ...fields } = data;
  notes[index] = { ...notes[index], ...fields };
  return notes[index];
}

export function deleteNote(id) {
  const index = notes.findIndex(n => n.id === parseInt(id));
  if (index === -1) return false;

  notes.splice(index, 1);
  return true;
}
