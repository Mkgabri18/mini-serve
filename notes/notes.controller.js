import { getAllNotes, getNoteById, createNote as createNoteService, updateNote, deleteNote } from "./notes.services.js";
import { parseJsonBody } from "../utils/parseJson.js";

export async function getNotes(req, res, next) {
  const notes = getAllNotes();
  res.status(200).json(notes);
}

export async function getNote(req, res, next) {
  const note = getNoteById(req.params.id);
  if (!note) {
    const err = new Error("Nota non trovata");
    err.status = 404;
    return next(err);
  }
  res.status(200).json(note);
}

export async function createNote(req, res, next) {
  const body = await parseJsonBody(req);
  const note = createNoteService(body);
  res.status(201).json(note);
}

export async function editNote(req, res, next) {
  const body = await parseJsonBody(req);
  const updatedNote = updateNote(req.params.id, body);
  if (!updatedNote) {
    const err = new Error("Nota non trovata per la modifica");
    err.status = 404;
    return next(err);
  }
  res.status(200).json(updatedNote);
}

export async function removeNote(req, res, next) {
  const success = deleteNote(req.params.id);
  if (!success) {
    const err = new Error("Nota non trovata per l'eliminazione");
    err.status = 404;
    return next(err);
  }
  res.status(204).end(); // 204 No Content
}
