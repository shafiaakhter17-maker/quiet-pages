/* =========================================
   MY LITTLE NOTES — FUNCTIONALITY
========================================= */

let journalEntries =
    JSON.parse(localStorage.getItem("journalEntries")) || [];

let notes =
    JSON.parse(localStorage.getItem("notes")) || [];

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

let books =
    JSON.parse(localStorage.getItem("books")) || [];


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageName) {

    // Hide every page
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    // Show selected page
    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    // Update sidebar buttons
    document.querySelectorAll(".nav-button").forEach(button => {
        button.classList.remove("active");
    });

    const activeButton =
        document.querySelector(
            `.nav-button[onclick="showPage('${pageName}')"]`
        );

    if (activeButton) {
        activeButton.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   HOME CARDS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // Make home cards clickable
    document.querySelectorAll(".home-card").forEach(card => {

        const name =
            card.querySelector(".card-name")?.textContent
            .trim()
            .toLowerCase();

        const pages = {
            "journal": "journal",
            "to do list": "todo",
            "notes": "notes",
            "hobbies": "hobbies",
            "mood": "mood",
            "bookshelf": "bookshelf"
        };

        if (pages[name]) {
            card.addEventListener("click", () => {
                showPage(pages[name]);
            });
        }
    });

    loadJournal();
    loadNotes();
    loadTasks();
    loadBooks();

});


/* =========================================
   JOURNAL
========================================= */

function openJournalWriter() {

    const form = document.getElementById("journalForm");

    if (!form) return;

    form.classList.remove("hidden");

    const list = document.getElementById("journalList");

    if (list) {
        list.classList.add("hidden");
    }
}


function closeJournalWriter() {

    const form = document.getElementById("journalForm");

    if (!form) return;

    form.classList.add("hidden");

    const list = document.getElementById("journalList");

    if (list) {
        list.classList.remove("hidden");
    }
}


function saveJournal() {

    const titleInput =
        document.getElementById("journalTitle");

    const contentInput =
        document.getElementById("journalContent");

    if (!titleInput || !contentInput) return;

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert("Please write a title and your journal entry.");
        return;
    }

    const entry = {
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleDateString()
    };

    journalEntries.push(entry);

    localStorage.setItem(
        "journalEntries",
        JSON.stringify(journalEntries)
    );

    titleInput.value = "";
    contentInput.value = "";

    closeJournalWriter();
    loadJournal();
}


function loadJournal() {

    const list =
        document.getElementById("journalList");

    if (!list) return;

    list.innerHTML = "";

    if (journalEntries.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">♡</div>
                <h3>Your journal is empty</h3>
                <p>Tap + to write your first entry.</p>
            </div>
        `;

        return;
    }

    journalEntries.forEach((entry, index) => {

        const item = document.createElement("div");

        item.className = "journal-entry";

        item.innerHTML = `
            <div class="entry-number">
                ${index + 1}
            </div>

            <div class="entry-info">

                <div class="entry-title">
                    ${escapeHTML(entry.title)}
                </div>

                <div class="entry-date">
                    ${entry.date}
                </div>

                <div class="entry-preview">
                    ${escapeHTML(
                        entry.content.substring(0, 70)
                    )}${entry.content.length > 70 ? "..." : ""}
                </div>

            </div>

            <div class="entry-arrow">
                →
            </div>
        `;

        item.addEventListener("click", () => {
            openJournalEntry(entry, index + 1);
        });

        list.appendChild(item);
    });
}


function openJournalEntry(entry, number) {

    const list =
        document.getElementById("journalList");

    const reader =
        document.getElementById("journalReader");

    if (!list || !reader) return;

    list.classList.add("hidden");
    reader.classList.remove("hidden");

    reader.innerHTML = `

        <button class="back-text"
                onclick="closeJournalEntry()">
            ← Back to Journal
        </button>

        <div class="journal-reader">

            <div class="reader-number">
                ${number}
            </div>

            <h1>
                ${escapeHTML(entry.title)}
            </h1>

            <div class="reader-date">
                ${entry.date}
            </div>

            <div class="reader-content">
                ${escapeHTML(entry.content)}
            </div>

        </div>
    `;
}


function closeJournalEntry() {

    const reader =
        document.getElementById("journalReader");

    const list =
        document.getElementById("journalList");

    if (reader) {
        reader.classList.add("hidden");
    }

    if (list) {
        list.classList.remove("hidden");
    }
}


/* =========================================
   TO DO LIST
========================================= */

function addTask() {

    const input =
        document.getElementById("taskInput");

    if (!input) return;

    const text = input.value.trim();

    if (!text) return;

    tasks.push({
        id: Date.now(),
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

    const container =
        document.getElementById("taskList");

    if (!container) return;

    container.innerHTML = "";

    tasks.forEach(task => {

        const item = document.createElement("div");

        item.className =
            "task" +
            (task.completed ? " done" : "");

        item.innerHTML = `

            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span>
                ${escapeHTML(task.text)}
            </span>

        `;

        const checkbox =
            item.querySelector("input");

        checkbox.addEventListener("change", () => {

            task.completed = checkbox.checked;

            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );

            loadTasks();
        });

        container.appendChild(item);
    });
}


/* =========================================
   NOTES
========================================= */

function addNote() {

    const title =
        document.getElementById("noteTitle");

    const content =
        document.getElementById("noteContent");

    if (!title || !content) return;

    if (
        !title.value.trim() ||
        !content.value.trim()
    ) {
        alert("Write something first.");
        return;
    }

    notes.push({
        id: Date.now(),
        title: title.value.trim(),
        content: content.value.trim()
    });

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    title.value = "";
    content.value = "";

    loadNotes();
}


function loadNotes() {

    const list =
        document.getElementById("noteList");

    if (!list) return;

    list.innerHTML = "";

    if (notes.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✧</div>
                <h3>No notes yet</h3>
                <p>Your little thoughts will live here.</p>
            </div>
        `;

        return;
    }

    notes.forEach(note => {

        const card =
            document.createElement("div");

        card.className = "note-card";

        card.innerHTML = `
            <h3>
                ${escapeHTML(note.title)}
            </h3>

            <p>
                ${escapeHTML(note.content)}
            </p>
        `;

        list.appendChild(card);
    });
}


/* =========================================
   BOOKSHELF
========================================= */

function addBook() {

    const title =
        document.getElementById("bookTitle");

    const author =
        document.getElementById("bookAuthor");

    if (!title || !author) return;

    if (!title.value.trim()) {
        alert("Enter a book title.");
        return;
    }

    books.push({
        title: title.value.trim(),
        author: author.value.trim()
    });

    localStorage.setItem(
        "books",
        JSON.stringify(books)
    );

    title.value = "";
    author.value = "";

    loadBooks();
}


function loadBooks() {

    const list =
        document.getElementById("bookList");

    if (!list) return;

    list.innerHTML = "";

    if (books.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">♡</div>
                <h3>Your bookshelf is empty</h3>
                <p>Add the books you love.</p>
            </div>
        `;

        return;
    }

    books.forEach(book => {

        const card =
            document.createElement("div");

        card.className = "book-card";

        card.innerHTML = `

            <div class="book-icon">
                ▥
            </div>

            <h3>
                ${escapeHTML(book.title)}
            </h3>

            <p>
                ${escapeHTML(book.author)}
            </p>

        `;

        list.appendChild(card);
    });
}


/* =========================================
   MOOD
========================================= */

function setMood(mood) {

    const result =
        document.getElementById("moodResult");

    if (!result) return;

    result.textContent =
        "Today I feel " + mood + " ♡";

    localStorage.setItem(
        "currentMood",
        mood
    );
}


/* =========================================
   SECURITY
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}
