import * as variables from "./variables.js";

// function yang di export
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(variables.STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      variables.books.push(book);
    }
  }

  document.dispatchEvent(new Event(variables.RENDER_EVENT));
}

function addBook() {
  const title = document.querySelector("#bookFormTitle").value;
  const author = document.querySelector("#bookFormAuthor").value;
  const year = document.querySelector("#bookFormYear").value;
  const isComplete = document.querySelector("#bookFormIsComplete").checked;

  const id = generateId();
  const bookObject = generateBookObject(
    id,
    title,
    author,
    parseInt(year),
    isComplete
  );
  variables.books.push(bookObject);

  document.dispatchEvent(new Event(variables.RENDER_EVENT));
  saveData();
}

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;
  textTitle.setAttribute("data-testid", "bookItemTitle");

  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;
  textAuthor.setAttribute("data-testid", "bookItemAuthor");

  const textYear = document.createElement("p");
  textYear.innerText = bookObject.year;
  textYear.setAttribute("data-testid", "bookItemYear");

  const container = document.createElement("div");
  container.setAttribute("data-bookid", bookObject.id);
  container.classList.add("bookList");
  container.setAttribute("data-testid", "bookItem");

  const buttonContainer = document.createElement("div");

  const isCompletedButton = document.createElement("button");
  isCompletedButton.innerText = "Selesai dibaca";
  isCompletedButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  isCompletedButton.addEventListener("click", () => {
    addBookToCompleted(bookObject.id);
  });

  const deleteBookButton = document.createElement("button");
  deleteBookButton.innerText = "Hapus Buku";
  deleteBookButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteBookButton.addEventListener("click", () => {
    const confirmation = confirm("apakah anda yakin akan menghapus buku ini ?");
    if (confirmation) removeBookFromCompleted(bookObject.id);
  });

  const editBookButton = document.createElement("button");
  editBookButton.innerText = "Edit Buku";
  editBookButton.setAttribute("data-testid", "bookItemEditButton");
  editBookButton.addEventListener("click", () => {
    editBook(bookObject.id);
  });

  buttonContainer.append(isCompletedButton, deleteBookButton, editBookButton);

  if (bookObject.isComplete) isCompletedButton.innerText = "Belum Selesai";

  container.append(textTitle, textAuthor, textYear, buttonContainer);

  return container;
}

function searchBook(keyword) {
  if (!keyword) return null;
  keyword = keyword.toLowerCase();
  const filteredBook = variables.books.filter(
    (book) =>
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword) ||
      book.year.toString().includes(keyword)
  );
  if (filteredBook.length) return filteredBook;
  else return null;
}

function togglePopup(position) {
  const popup = document.querySelector("#popup");
  const main = document.querySelector("main");
  if (position) {
    popup.classList.remove("disabled");
    popup.classList.add("popup");
    main.classList.add("opacity");
  } else {
    popup.classList.add("disabled");
    popup.classList.remove("popup");
    main.classList.remove("opacity");
  }
}

export {
  addBook,
  isStorageExist,
  loadDataFromStorage,
  makeBook,
  searchBook,
  togglePopup,
};

// function yang tidak di export

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  if (bookTarget.isComplete) bookTarget.isComplete = false;
  else bookTarget.isComplete = true;
  document.dispatchEvent(new Event(variables.RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of variables.books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  variables.books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(variables.RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in variables.books) {
    if (variables.books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(variables.books);
    localStorage.setItem(variables.STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(variables.SAVED_EVENT));
  }
}

function editBook(id) {
  const bookObject = findBook(id);
  const bookIndex = findBookIndex(id);
  const editForm = document.querySelector("#editForm");
  const editTitleInput = document.querySelector("#editFormTitle");
  const editAuthorInput = document.querySelector("#editFormAuthor");
  const editYearInput = document.querySelector("#editFormYear");
  const editChecked = document.querySelector("#editFormIsComplete");

  document.dispatchEvent(new Event(variables.POPUP_EVENT));

  showBook(
    bookObject,
    editTitleInput,
    editAuthorInput,
    editYearInput,
    editChecked
  );

  editForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      const confirmation = confirm(
        "apakah anda yakin untuk mengedit buku ini ?"
      );
      if (confirmation) {
        const editedBook = {
          author: editAuthorInput.value,
          title: editTitleInput.value,
          year: editYearInput.value,
          id: id,
          isComplete: editChecked.checked,
        };
        variables.books[bookIndex] = editedBook;
        alert("buku telah berhasil diedit");
        togglePopup(false);
        document.dispatchEvent(new Event(variables.RENDER_EVENT));
      }
    },
    { once: true }
  );
}

function showBook(
  objectBook,
  titleInput,
  authorInput,
  yearInput,
  checkedInput
) {
  titleInput.value = objectBook.title;
  authorInput.value = objectBook.author;
  yearInput.value = objectBook.year;
  checkedInput.checked = objectBook.isComplete;
}
