let notes = [];
let idCounter = 1;

export function getAllNotes() {
  return notes;
}

export function getNoteById(id) {
  return notes.find(n => n.id === parseInt(id));
}

export function createNote(data) {
  if (!data || !data.title) {
    return { error: "Il campo 'title' è obbligatorio" };
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
  
  // Merge parziale: sovrascrive solo i campi effettivamente inviati dal client
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
