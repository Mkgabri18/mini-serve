import { getAllNotes, getNoteById, createNote as createNoteService, updateNote, deleteNote } from "./notes.services.js";

export async function getNotes(req, res, next) {
  const notes = getAllNotes();
  res.status(200).json(notes);
}

export async function getNote(req, res, next) {
  const note = getNoteById(req.params.id);
  if (!note) {
    const err = new Error("Note not found");
    err.status = 404;
    return next(err);
  }
  res.status(200).json(note);
}

export async function createNote(req, res, next) {
  const note = createNoteService(req.body);
  if (note.error) {
    const err = new Error(note.error);
    err.status = 400;
    return next(err);
  }
  res.status(201).json(note);
}

export async function editNote(req, res, next) {
  const updatedNote = updateNote(req.params.id, req.body);
  if (!updatedNote) {
    const err = new Error("Note not found for editing");
    err.status = 404;
    return next(err);
  }
  res.status(200).json(updatedNote);
}

export async function removeNote(req, res, next) {
  const success = deleteNote(req.params.id);
  if (!success) {
    const err = new Error("Note not found for deletion");
    err.status = 404;
    return next(err);
  }
  res.status(204).end(); // 204 No Content
}
