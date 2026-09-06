/* =========================
   MY LITTLE NOTES
   ========================= */


/* ---------- NAVIGATION ---------- */

const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".nav-item");
const pageButtons = document.querySelectorAll("[data-page]");


function openPage(pageName) {

  pages.forEach(page => {
    page.classList.remove("active");
  });

  const selected = document.getElementById(pageName);

  if (selected) {
    selected.classList.add("active");
  }

  navItems.forEach(item => {
    item.classList.toggle(
      "active",
      item.dataset.page === pageName
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


pageButtons.forEach(button => {

  button.addEventListener("click", () => {

    const page = button.dataset.page;

    if (page) {
      openPage(page);
    }

  });

});


/* ---------- DASHBOARD CARDS ---------- */

document.querySelectorAll(".dashboard-card").forEach(card => {

  card.addEventListener("click", () => {

    openPage(card.dataset.page);

  });

});


/* ---------- DATE ---------- */

const today = document.getElementById("today");

today.textContent =
  new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });


/* ---------- FORMS ---------- */

document.querySelectorAll("[data-open]").forEach(button => {

  button.addEventListener("click", () => {

    const id = button.dataset.open;

    document.getElementById(id).classList.add("open");

  });

});


document.querySelectorAll("[data-close]").forEach(button => {

  button.addEventListener("click", () => {

    const id = button.dataset.close;

    document.getElementById(id).classList.remove("open");

  });

});


/* ---------- JOURNAL ---------- */

let journals =
  JSON.parse(
    localStorage.getItem("myLittleNotes_journal")
  ) || [];


function renderJournal() {

  const list =
    document.getElementById("journal-list");

  if (journals.length === 0) {

    list.innerHTML = `
      <div class="empty">
        Your first journal entry will appear here ♡
      </div>
    `;

    return;
  }


  list.innerHTML = journals.map((entry, index) => {

    return `
      <div class="entry">

        <div class="entry-number">
          ${index + 1}
        </div>

        <div>

          <div class="entry-title">
            ${escapeHTML(entry.title)}
          </div>

          <div class="entry-date">
            ${entry.date}
          </div>

          <div class="entry-preview">
            ${escapeHTML(entry.content)}
          </div>

        </div>

        <button
          class="delete"
          data-delete-journal="${index}">
          ×
        </button>

      </div>
    `;

  }).join("");


  document
    .querySelectorAll("[data-delete-journal]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.deleteJournal);

        journals.splice(index, 1);

        saveJournalData();

      });

    });

}


function saveJournalData() {

  localStorage.setItem(
    "myLittleNotes_journal",
    JSON.stringify(journals)
  );

  renderJournal();

}


document
  .getElementById("save-journal")
  .addEventListener("click", () => {

    const title =
      document
        .getElementById("journal-title")
        .value
        .trim();

    const content =
      document
        .getElementById("journal-content")
        .value
        .trim();


    if (!title && !content) {

      alert("Write something first ♡");

      return;
    }


    journals.unshift({

      title: title || "Untitled",

      content: content,

      date: new Date().toLocaleDateString()

    });


    saveJournalData();


    document.getElementById("journal-title").value = "";

    document.getElementById("journal-content").value = "";

    document
      .getElementById("journal-form")
      .classList.remove("open");

  });


/* ---------- TODO ---------- */

let todos =
  JSON.parse(
    localStorage.getItem("myLittleNotes_todos")
  ) || [];


function renderTodos() {

  const list =
    document.getElementById("todo-list");


  if (todos.length === 0) {

    list.innerHTML = `
      <div class="empty">
        Nothing here yet ♡
      </div>
    `;

    return;
  }


  list.innerHTML = todos.map((task, index) => {

    return `
      <div class="todo-item">

        <input
          type="checkbox"
          ${task.done ? "checked" : ""}
          data-todo-check="${index}"
        >

        <span>
          ${escapeHTML(task.text)}
        </span>

        <button
          class="delete"
          data-delete-todo="${index}">
          ×
        </button>

      </div>
    `;

  }).join("");


  document
    .querySelectorAll("[data-todo-check]")
    .forEach(box => {

      box.addEventListener("change", () => {

        const index =
          Number(box.dataset.todoCheck);

        todos[index].done = box.checked;

        saveTodos();

      });

    });


  document
    .querySelectorAll("[data-delete-todo]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.deleteTodo);

        todos.splice(index, 1);

        saveTodos();

      });

    });

}


function saveTodos() {

  localStorage.setItem(
    "myLittleNotes_todos",
    JSON.stringify(todos)
  );

  renderTodos();

}


document
  .getElementById("save-todo")
  .addEventListener("click", () => {

    const input =
      document.getElementById("todo-input");

    const text = input.value.trim();


    if (!text) {

      alert("Write a task first ♡");

      return;
    }


    todos.push({

      text: text,

      done: false

    });


    input.value = "";

    saveTodos();


    document
      .getElementById("todo-form")
      .classList.remove("open");

  });


/* ---------- NOTES ---------- */

let notes =
  JSON.parse(
    localStorage.getItem("myLittleNotes_notes")
  ) || [];


function renderNotes() {

  const list =
    document.getElementById("notes-list");


  if (notes.length === 0) {

    list.innerHTML = `
      <div class="empty">
        Your notes will appear here ♡
      </div>
    `;

    return;
  }


  list.innerHTML = notes.map((note, index) => {

    return `
      <article class="note-card">

        <button
          class="delete"
          data-delete-note="${index}">
          ×
        </button>

        <h3>
          ${escapeHTML(note.title)}
        </h3>

        <p>
          ${escapeHTML(note.content)}
        </p>

        <small>
          ${note.date}
        </small>

      </article>
    `;

  }).join("");


  document
    .querySelectorAll("[data-delete-note]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.deleteNote);

        notes.splice(index, 1);

        saveNotes();

      });

    });

}


function saveNotes() {

  localStorage.setItem(
    "myLittleNotes_notes",
    JSON.stringify(notes)
  );

  renderNotes();

}


document
  .getElementById("save-note")
  .addEventListener("click", () => {

    const title =
      document.getElementById("note-title").value.trim();

    const content =
      document.getElementById("note-content").value.trim();


    if (!title && !content) {

      alert("Write something first ♡");

      return;
    }


    notes.unshift({

      title: title || "Untitled",

      content: content,

      date: new Date().toLocaleDateString()

    });


    saveNotes();


    document.getElementById("note-title").value = "";

    document.getElementById("note-content").value = "";


    document
      .getElementById("notes-form")
      .classList.remove("open");

  });


/* ---------- HOBBIES ---------- */

let hobbies =
  JSON.parse(
    localStorage.getItem("myLittleNotes_hobbies")
  ) || [];


function renderHobbies() {

  const list =
    document.getElementById("hobbies-list");


  if (hobbies.length === 0) {

    list.innerHTML = `
      <div class="empty">
        Add the things you love doing ♡
      </div>
    `;

    return;
  }


  list.innerHTML = hobbies.map((hobby, index) => {

    return `
      <article class="note-card">

        <button
          class="delete"
          data-delete-hobby="${index}">
          ×
        </button>

        <h3>
          ♡ ${escapeHTML(hobby.name)}
        </h3>

        <p>
          ${escapeHTML(hobby.content)}
        </p>

      </article>
    `;

  }).join("");


  document
    .querySelectorAll("[data-delete-hobby]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.deleteHobby);

        hobbies.splice(index, 1);

        saveHobbies();

      });

    });

}


function saveHobbies() {

  localStorage.setItem(
    "myLittleNotes_hobbies",
    JSON.stringify(hobbies)
  );

  renderHobbies();

}


document
  .getElementById("save-hobby")
  .addEventListener("click", () => {

    const name =
      document.getElementById("hobby-name").value.trim();

    const content =
      document.getElementById("hobby-content").value.trim();


    if (!name) {

      alert("Give your hobby a name ♡");

      return;
    }


    hobbies.unshift({

      name: name,

      content: content

    });


    saveHobbies();


    document.getElementById("hobby-name").value = "";

    document.getElementById("hobby-content").value = "";


    document
      .getElementById("hobbies-form")
      .classList.remove("open");

  });


/* ---------- MOOD ---------- */

let moods =
  JSON.parse(
    localStorage.getItem("myLittleNotes_moods")
  ) || [];


document.querySelectorAll("[data-mood]").forEach(button => {

  button.addEventListener("click", () => {

    document.getElementById("mood-name").value =
      button.dataset.mood;

  });

});


function renderMoods() {

  const list =
    document.getElementById("mood-list");


  if (moods.length === 0) {

    list.innerHTML = `
      <div class="empty">
        Your mood entries will appear here ♡
      </div>
    `;

    return;
  }


  list.innerHTML = moods.map((mood, index) => {

    return `
      <article class="note-card">

        <button
          class="delete"
          data-delete-mood="${index}">
          ×
        </button>

        <h3>
          ${escapeHTML(mood.name)}
        </h3>

        <p>
          ${escapeHTML(mood.content)}
        </p>

        <small>
          ${mood.date}
        </small>

      </article>
    `;

  }).join("");


  document
    .querySelectorAll("[data-delete-mood]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.deleteMood);

        moods.splice(index, 1);

        saveMoods();

      });

    });

}


function saveMoods() {

  localStorage.setItem(
    "myLittleNotes_moods",
    JSON.stringify(moods)
  );

  renderMoods();

}


document
  .getElementById("save-mood")
  .addEventListener("click", () => {

    const name =
      document.getElementById("mood-name").value.trim();

    const content =
      document.getElementById("mood-content").value.trim();


    if (!name) {

      alert("Choose your mood first ♡");

      return;
    }


    moods.unshift({

      name: name,

      content: content,

      date: new Date().toLocaleDateString()

    });


    saveMoods();


    document.getElementById("mood-name").value = "";

    document.getElementById("mood-content").value = "";


    document
      .getElementById("mood-form")
      .classList.remove("open");

  });


/* ---------- BOOKSHELF ---------- */

let books =
  JSON.parse(
    localStorage.getItem("myLittleNotes_books")
  ) || [];


function renderBooks() {

  const list =
    document.getElementById("books-list");


  if (books.length === 0) {

    list.innerHTML = `
      <div class="empty">
        Your bookshelf is waiting for its first book ♡
      </div>
    `;

    return;
  }


  list.innerHTML = books.map((book, index) => {

    return `
      <article class="note-card">

        <button
          class="delete"
          data-delete-book="${index}">
          ×
        </button>

        <h3>
          ▥ ${escapeHTML(book.title)}
        </h3>

        <p>
          ${book.author
            ? "by " + escapeHTML(book.author)
            : ""
          }

          ${book.content
            ? "\n\n" + escapeHTML(book.content)
            : ""
          }
        </p>

      </article>
    `;

  }).join("");


  document
    .querySelectorAll("[data-delete-book]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.deleteBook);

        books.splice(index, 1);

        saveBooks();

      });

    });

}


function saveBooks() {

  localStorage.setItem(
    "myLittleNotes_books",
    JSON.stringify(books)
  );

  renderBooks();

}


document
  .getElementById("save-book")
  .addEventListener("click", () => {

    const title =
      document.getElementById("book-title").value.trim();

    const author =
      document.getElementById("book-author").value.trim();

    const content =
      document.getElementById("book-content").value.trim();


    if (!title) {

      alert("Enter a book title ♡");

      return;
    }


    books.unshift({

      title: title,

      author: author,

      content: content

    });


    saveBooks();


    document.getElementById("book-title").value = "";

    document.getElementById("book-author").value = "";

    document.getElementById("book-content").value = "";


    document
      .getElementById("book-form")
      .classList.remove("open");

  });


/* ---------- SAFETY FOR USER TEXT ---------- */

function escapeHTML(value) {

  return String(value)

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");

}


/* ---------- START APP ---------- */

renderJournal();

renderTodos();

renderNotes();

renderHobbies();

renderMoods();

renderBooks();


/* ---------- SERVICE WORKER ---------- */

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker.register("sw.js");

  });

   }
