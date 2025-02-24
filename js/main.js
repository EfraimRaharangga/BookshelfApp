import * as functions from "./functions.js";
import * as variables from "./variables.js";

document.addEventListener("DOMContentLoaded", () => {
  if (functions.isStorageExist()) {
    functions.loadDataFromStorage();
  }
  const submitForm = document.querySelector("#bookForm");
  const searchForm = document.querySelector("#searchBook");
  const isCompleted = document.querySelector("#bookFormIsComplete");

  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    functions.addBook();
    event.target.reset();
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputSearch = document.querySelector("#searchBookTitle");
    const bookObject = functions.searchBook(inputSearch.value);
    const searchedBookList = document.querySelector("#searchedBookList");
    inputSearch.value = "";
    searchedBookList.innerText = "";

    if (bookObject) {
      for (const book of bookObject) {
        const bookElement = functions.makeBook(book);
        searchedBookList.append(bookElement);
      }
    } else alert("buku yang anda cari tidak ditemukan");
  });

  isCompleted.addEventListener("click", () => {
    const span = document.querySelector("#bookFormSubmit span");
    span.classList.toggle("disabled");
  });
});

document.addEventListener(variables.RENDER_EVENT, () => {
  const incompleteBookList = document.querySelector("#incompleteBookList");
  incompleteBookList.innerHTML = "";

  const completeBookList = document.querySelector("#completeBookList");
  completeBookList.innerHTML = "";

  const searchedBookList = document.querySelector("#searchedBookList");
  searchedBookList.innerHTML = "";

  for (const book of variables.books) {
    const bookElement = functions.makeBook(book);
    if (!book.isComplete) {
      incompleteBookList.append(bookElement);
    } else completeBookList.append(bookElement);
  }
});

document.addEventListener(variables.POPUP_EVENT, (e) => {
  const close = document.querySelector("#popup img");
  functions.togglePopup(true);

  close.addEventListener("click", () => {
    functions.togglePopup(false);
  });
});
