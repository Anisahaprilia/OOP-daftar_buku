// membuat book class: merepesantasikan sebuah buku
class Book {
  // init
  constructor(title, author, isbn)
  {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// UI class: menangani tugas UI
class UI {
  static displayBooks()
  {

    const books = Store.getBooks();
    // looping data lalu memanggil method ini kedalam UI class
    // untuk menampilkan data-nya dihalaman web.
    books.map((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    // ketika method ini dipanggil. lalu akan memanipulasi table
    // yang sudah dibuat
    const list = document.querySelector('#book-list');
    // membuat row table
    const row = document.createElement('tr');
    // membuat kolom dan menampilkan data
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href='#' class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static showAlert(message, className)
  {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    setTimeout(() => document.querySelector('.alert').remove(), 1500);
  }

  static removeBook(el) {
    if(el.classList.contains('delete'))
    {
      el.parentElement.parentElement.remove();
    }
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

}

// Store class: menangani Penyimpanan
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null)
    {
      books = [];
    } else 
    {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.map((book, index) => {
      if(book.isbn === isbn)
      {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event: menampilkan daftar buku
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: menambah sebuah daftar buku
document.querySelector('#book-form')
  .addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();
    
    // mengambil nilai di form
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // validasi
    if (title === '' || author === '' || isbn === '')
    {
      UI.showAlert('Mohon bidang form harap diisi!', 'danger');
    } else 
    {
      // instatiate class of Book
      const book = new Book(title, author, isbn);
      // add Book to UI
      UI.addBookToList(book);

      // add Book to store
      Store.addBook(book);

      // show succes message
      UI.showAlert('Daftar buku berhasil ditambahkan', 'success');
  
      // clear fields
      UI.clearFields(book);
    }

  });

// Event: menghapus daftar buku
document.querySelector('#book-list')
  .addEventListener('click', (e) => {
    UI.removeBook(e.target)
    Store.removeBook(
      e.target.parentElement.previousElementSibling.textContent
    );
    UI.showAlert('Daftar buku berhasil dihapus', 'success')
  })