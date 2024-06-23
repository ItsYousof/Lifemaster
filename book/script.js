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
                <h3 class="book-title">Title: ${bookTitle}</h3>
                <p class="book-author">Author: ${author}</p>
                <p class="book-year">Year: ${year}</p>
                <p class="book-pages">Pages: ${pages}</p>
            </div>
            <button onclick="window.location.href='${bookLink}'">Link to Book</button>
    `;

    document.querySelector('.book-container').appendChild(newBook);
}