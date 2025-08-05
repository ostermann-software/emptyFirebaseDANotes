import { Injectable, Query, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, onSnapshot, query, addDoc, updateDoc, deleteDoc, where, limit, orderBy } from '@angular/fire/firestore';
import { Note } from "./../interfaces/note.interface";
// import { query } from '@angular/animations';



@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  firestore = inject(Firestore);

  unsubNotes;
  unsubFavNotes;
  unsubTrash;

  normalNotes = signal<Note[]>([]);
  normalFavNotes = signal<Note[]>([]);
  trashNotes = signal<Note[]>([]);

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }
  getTrashRef() {
    return collection(this.firestore, 'trash');
  }
  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }


  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubFavNotes = this.subNotesFavList();
    this.unsubTrash = this.subTrashList();
  }


  async addNote(item: Note, colId: "note" | "trash") {
    if (colId == "note") {
      await addDoc(this.getNotesRef(), this.getCleanJson(item)).catch(
        (err) => { console.error(err) }
      );
    } else if (colId == "trash") {
      await addDoc(this.getTrashRef(), this.getCleanJson(item)).catch(
        (err) => { console.error(err) }
      );
    }
  }


  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.error(err) }
      );
    }
  }


  async deleteNote(colId: string, docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => { console.error(err) }
    );
  }


  getColIdFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes'
    } else {
      return 'trash'
    }
  }


  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }


  ngonDestroy() {
    this.unsubNotes();
    this.unsubFavNotes();
    this.unsubTrash();
  }


  subNotesList() {
    let q = query(this.getNotesRef(), limit(100));
    return onSnapshot(q, (list) => {
      const newList: Note[] = [];
      list.forEach(element => {
        newList.push(this.setNoteObject(element.data(), element.id));
      });
      this.normalNotes.set(newList);
    });
  }


  subNotesFavList() {
    let q = query(this.getNotesRef(), where("marked", "==", true), limit(100));
    return onSnapshot(q, (list) => {
      const newList: Note[] = [];
      list.forEach(element => {
        newList.push(this.setNoteObject(element.data(), element.id));
      });
      this.normalFavNotes.set(newList);
    });
  }


  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      const newList: Note[] = [];
      list.forEach(element => {
        newList.push(this.setNoteObject(element.data(), element.id));
      });
      this.trashNotes.set(newList); // ⬅️ Signal aktualisieren
    });
  }


  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }



}
