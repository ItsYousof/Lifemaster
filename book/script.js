function FindBook() { 
    let bookTerm = document.getElementById('search').value;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookTerm}`)
        .then(response => response.json())
        .then(data => {
            const results = data.items;
            if (results.length > 0) {
                const book = results[0];
                const bookImage = book.volumeInfo.imageLinks.thumbnail;
                const bookTitle = book.volumeInfo.title;
                const author = book.volumeInfo.authors[0];
                const year = book.volumeInfo.publishedDate;
                const pages = book.volumeInfo.pageCount;
                const bookLink = book.volumeInfo.infoLink;
                document.querySelector('.book-container').innerHTML = '';
                AddBook(bookImage, bookTitle, author, year, pages, bookLink);
            } else {
                alert('No results found');
            }
        })
        .catch(error => console.error(error));
}



function AddBook(bookImage, bookTitle, author, year, pages, bookLink) {
    const newBook = document.createElement('div');
    newBook.classList.add('book');
    newBook.innerHTML = `
                <img src="${bookImage}" alt="" class="book-img">
                <div class="book-info">
                    <p class="book-author">Author: ${author}</p>
                    <p class="book-year">Year: ${year}</p>
                    <p class="book-pages">Pages: ${pages}</p>
                </div>
                <button onclick="window.location.href='${bookLink.replace(/'/g, "\\'")}'">Link to Book</button>
                <button onclick="saveBook('${bookImage.replace(/'/g, "\\'")}', '${bookTitle.replace(/'/g, "\\'")}', '${author.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}', '${pages.toString().replace(/'/g, "\\'")}', '${bookLink.replace(/'/g, "\\'")}')">Save Book</button>
                <button onclick="deleteBook('${bookTitle.replace(/'/g, "\\'")}')">Delete Book</button>
            `;

    document.querySelector('.book-container').appendChild(newBook);
}

function saveBook(bookImage, bookTitle, author, year, pages, bookLink) {
    const book = { bookImage, bookTitle, author, year, pages, bookLink };
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));

    // Find and highlight the save button
    const allBooks = document.querySelectorAll('.book');
    allBooks.forEach(book => {
        const imgElement = book.querySelector('.book-img');
        if (imgElement && imgElement.src === bookImage) {
            const bookmark = book.querySelector('button:nth-child(3)'); // Assuming the save button is the third child button
            bookmark.style.color = 'green';
            setTimeout(() => {
                bookmark.style.color = '';
            }, 1000);
        }
    });
}

function deleteBook(bookTitle) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books = books.filter(book => book.bookTitle !== bookTitle);
    localStorage.setItem('books', JSON.stringify(books));
    showSavedBooks();
}

function showSavedBooks() {
    let bookContainer = document.querySelector('.book-container');
    bookContainer.innerHTML = '';

    let container = document.querySelector('.container');
    if (container) {
        container.style.display = 'none';
    }

    const books = JSON.parse(localStorage.getItem('books')) || [];
    books.forEach(book => {
        AddBook(book.bookImage, book.bookTitle, book.author, book.year, book.pages, book.bookLink);
    });
}

function showContainer() {
    let container = document.querySelector('.container');
    if (container) {
        container.style.display = 'block';
    }

    let bookContainer = document.querySelector('.book-container');
    bookContainer.innerHTML = '';
}