// Book Class: Represents a Book

class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
    }
}

// UI Class: Handle UI tasks

class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="text-light">${book.title}</td>
            <td class="text-light">${book.author}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
    }
}

// Store Class: Handles Storage

class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(title) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.title === title) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books

document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a book

document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent Actual submit
    e.preventDefault();

    //Get Form Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;

    //Validate

    if(title === '' || author === '') {
        UI.showAlert('Please fill in all fields', danger);
    } else {
        //Instantiate book
        const book = new Book(title, author);

        //Add book to UI
        UI.addBookToList(book);

        //Add book to store
        Store.addBook(book);

        //Show success message
        UI.showAlert('Book Added', 'success');

        //Clear fields
        UI.clearFields();
    }
})

// Event: Remove a book

document.querySelector('#book-list').addEventListener('click', (e) => {

    //Remove book from UI
    UI.deleteBook(e.target);

    //Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Book Removed', 'success');
});

