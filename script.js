/* =====================================
   MY LITTLE NOTES — JAVASCRIPT
   ===================================== */


/* ---------- PAGE NAVIGATION ---------- */

function showPage(pageName) {

  const pages = document.querySelectorAll(".page");

  pages.forEach(function(page) {
    page.classList.remove("active");
  });

  const selectedPage = document.getElementById(pageName);

  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  window.scrollTo(0, 0);
}


/* ---------- JOURNAL ---------- */

function openJournalWriter() {

  const form = document.getElementById("journalForm");
  const reader = document.getElementById("journalReader");

  if (reader) {
    reader.style.display = "none";
  }

  if (form) {
    form.style.display = "block";
  }

  const title = document.getElementById("journalTitle");

  if (title) {
    title.focus();
  }
}


function closeJournalWriter() {

  const form = document.getElementById("journalForm");

  if (form) {
    form.style.display = "none";
  }
}


function saveJournal() {

  const titleInput = document.getElementById("journalTitle");
  const contentInput = document.getElementById("journalContent");

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Please write a title and your journal entry.");
    return;
  }

  let entries =
    JSON.parse(localStorage.getItem("journalEntries")) || [];

  const entry = {
    title: title,
    content: content,
    date: new Date().toLocaleDateString()
  };

  entries.push(entry);

  localStorage.setItem(
    "journalEntries",
    JSON.stringify(entries)
  );

  titleInput.value = "";
  contentInput.value = "";

  closeJournalWriter();

  loadJournal();
}


function loadJournal() {

  const list = document.getElementById("journalList");

  if (!list) return;

  const entries =
    JSON.parse(localStorage.getItem("journalEntries")) || [];

  if (entries.length === 0) {

    list.innerHTML = `
      <div class="empty-state">
        <span>♡</span>
        <h3>Your journal is empty.</h3>
        <p>Start writing something that belongs only to you.</p>

        <button class="primary-btn"
                onclick="openJournalWriter()">
          Write your first entry
        </button>
      </div>
    `;

    return;
  }


  list.innerHTML = "";

  entries.forEach(function(entry, index) {

    const card = document.createElement("div");

    card.className = "journal-entry";

    card.innerHTML = `
      <div class="entry-number">
        ${String(index + 1).padStart(2, "0")}
      </div>

      <div class="entry-info">
        <h3>${escapeHTML(entry.title)}</h3>
        <p>${escapeHTML(entry.date)}</p>
      </div>

      <span class="arrow">↗</span>
    `;

    card.onclick = function() {
      openJournalEntry(entry, index + 1);
    };

    list.appendChild(card);

  });
}


function openJournalEntry(entry, number) {

  const list = document.getElementById("journalList");
  const form = document.getElementById("journalForm");
  const reader = document.getElementById("journalReader");

  if (list) {
    list.style.display = "none";
  }

  if (form) {
    form.style.display = "none";
  }

  if (reader) {
    reader.style.display = "block";
  }

  document.getElementById("readerNumber").textContent =
    "ENTRY " + String(number).padStart(2, "0");

  document.getElementById("readerTitle").textContent =
    entry.title;

  document.getElementById("readerDate").textContent =
    entry.date;

  document.getElementById("readerContent").textContent =
    entry.content;
}


function closeJournalEntry() {

  const reader = document.getElementById("journalReader");
  const list = document.getElementById("journalList");

  if (reader) {
    reader.style.display = "none";
  }

  if (list) {
    list.style.display = "block";
  }

  loadJournal();
}


/* ---------- NOTES ---------- */

function addNote() {

  const titleInput = document.getElementById("noteTitle");
  const contentInput = document.getElementById("noteContent");

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Please write a title and your note.");
    return;
  }

  let notes =
    JSON.parse(localStorage.getItem("notes")) || [];

  notes.push({
    title: title,
    content: content,
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem(
    "notes",
    JSON.stringify(notes)
  );

  titleInput.value = "";
  contentInput.value = "";

  loadNotes();
}


function loadNotes() {

  const list = document.getElementById("noteList");

  if (!list) return;

  const notes =
    JSON.parse(localStorage.getItem("notes")) || [];

  if (notes.length === 0) {

    list.innerHTML = `
      <div class="empty-state">
        <span>✎</span>
        <h3>No notes yet.</h3>
        <p>Your thoughts and ideas will appear here.</p>
      </div>
    `;

    return;
  }

  list.innerHTML = "";

  notes.forEach(function(note) {

    const card = document.createElement("div");

    card.className = "note-card";

    card.innerHTML = `
      <h3>${escapeHTML(note.title)}</h3>
      <p>${escapeHTML(note.content)}</p>
      <small>${escapeHTML(note.date)}</small>
    `;

    list.appendChild(card);

  });
}


/* ---------- TO DO LIST ---------- */

function addTask() {

  const input = document.getElementById("taskInput");

  const text = input.value.trim();

  if (!text) {
    return;
  }

  let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.push({
    text: text,
    completed: false
  });

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

  input.value = "";

  loadTasks();
}


function loadTasks() {

  const list = document.getElementById("taskList");

  if (!list) return;

  const tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

  if (tasks.length === 0) {

    list.innerHTML = `
      <div class="empty-state">
        <span>☑</span>
        <h3>Nothing here yet.</h3>
        <p>Add something you want to get done.</p>
      </div>
    `;

    return;
  }

  list.innerHTML = "";

  tasks.forEach(function(task, index) {

    const item = document.createElement("div");

    item.className = "task";

    if (task.completed) {
      item.classList.add("completed");
    }

    item.innerHTML = `
      <input
        type="checkbox"
        ${task.completed ? "checked" : ""}
      >

      <span>${escapeHTML(task.text)}</span>
    `;

    const checkbox = item.querySelector("input");

    checkbox.addEventListener("change", function() {

      tasks[index].completed = checkbox.checked;

      localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
      );

      loadTasks();

    });

    list.appendChild(item);

  });
}


/* ---------- BOOKSHELF ---------- */

function addBook() {

  const titleInput = document.getElementById("bookTitle");
  const authorInput = document.getElementById("bookAuthor");

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  if (!title) {
    alert("Please enter the book title.");
    return;
  }

  let books =
    JSON.parse(localStorage.getItem("books")) || [];

  books.push({
    title: title,
    author: author || "Unknown author"
  });

  localStorage.setItem(
    "books",
    JSON.stringify(books)
  );

  titleInput.value = "";
  authorInput.value = "";

  loadBooks();
}


function loadBooks() {

  const list = document.getElementById("bookList");

  if (!list) return;

  const books =
    JSON.parse(localStorage.getItem("books")) || [];

  if (books.length === 0) {

    list.innerHTML = `
      <div class="empty-state">
        <span>▥</span>
        <h3>Your bookshelf is empty.</h3>
        <p>Add the books you love or want to read.</p>
      </div>
    `;

    return;
  }

  list.innerHTML = "";

  books.forEach(function(book, index) {

    const card = document.createElement("div");

    card.className = "book-card";

    card.innerHTML = `
      <div class="book-number">
        ${String(index + 1).padStart(2, "0")}
      </div>

      <div>
        <h3>${escapeHTML(book.title)}</h3>
        <p>${escapeHTML(book.author)}</p>
      </div>
    `;

    list.appendChild(card);

  });
}


/* ---------- MOOD ---------- */

function setMood(mood) {

  const message =
    document.getElementById("moodMessage");

  if (!message) return;

  const messages = {

    happy: "You seem to be feeling happy today ☀️",

    calm: "A calm little moment 🌿",

    sad: "It's okay to have a difficult day ☁️",

    tired: "Take things gently today 💤",

    excited: "Something has you excited ✨",

    confused: "It's okay not to have everything figured out ☾"

  };

  message.textContent =
    messages[mood] || "How are you feeling today?";

  localStorage.setItem(
    "todayMood",
    mood
  );
}


/* ---------- SECURITY ---------- */

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


/* ---------- START APP ---------- */

document.addEventListener("DOMContentLoaded", function() {

  loadJournal();
  loadNotes();
  loadTasks();
  loadBooks();

});
