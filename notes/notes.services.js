let notes = [];
let idCounter = 1;

export function getAllNotes() {
  return notes;
}

export function getNoteById(id) {
  return notes.find(n => n.id === parseInt(id));
}

export function createNote(data) {
  const note = {
    id: idCounter++,
    title: data.title,
    content: data.content
  };
  notes.push(note);
  return note;
}

export function updateNote(id, data) {
  const index = notes.findIndex(n => n.id === parseInt(id));
  if (index === -1) return null;
  
  notes[index] = { ...notes[index], title: data.title, content: data.content };
  return notes[index];
}

export function deleteNote(id) {
  const index = notes.findIndex(n => n.id === parseInt(id));
  if (index === -1) return false;
  
  notes.splice(index, 1);
  return true;
}
