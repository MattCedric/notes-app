package com.example.notes_backend.controller;

import com.example.notes_backend.model.Note;
import com.example.notes_backend.repository.NoteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class NoteController {

    private final NoteRepository repo;

    public NoteController(NoteRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Note> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getById(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Note create(@RequestBody Note note) {
        return repo.save(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> update(@PathVariable Long id, @RequestBody Note updated) {
        return repo.findById(id).map(note -> {
            note.setTitle(updated.getTitle());
            note.setContent(updated.getContent());
            return ResponseEntity.ok(repo.save(note));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}