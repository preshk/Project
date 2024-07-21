
$(document).ready(function() {
    // Initialize local storage with some sample data if it's empty
    if (!localStorage.getItem('books')) {
        const sampleBooks = [
            { id: 1, title: "Infinity", author: "Sherrilyn Kenyon", year: 2010 },
            { id: 2, title: "The Host", author: "Stepenie Meyer", year: 2008 },
            { id: 3, title: "Lord of the Flies", author: "William Golding" , year: 1954 },
        ];
        localStorage.setItem('books', JSON.stringify(sampleBooks));
    }

    // Get all books
    function getBooks() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        displayBooks(books);
    }

    // Display books
    function displayBooks(books) {
        const bookList = $('#bookList');
        bookList.empty();

        books.forEach(function(book) {
            const bookItem = $('<div class="book-item">').html(`
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Year: ${book.year}</p>
                <button class="btn btn-warning btn-sm edit-book" data-id="${book.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete-book" data-id="${book.id}">Delete</button>
            `);
            bookList.append(bookItem);
        });
    }

    // Add or update book
    $('#bookForm').submit(function(e) {
        e.preventDefault();

        const bookId = $('#bookId').val();
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const book = {
            id: bookId ? parseInt(bookId) : Date.now(),
            title: $('#title').val(),
            author: $('#author').val(),
            year: parseInt($('#year').val())
        };

        if (bookId) {
            // Update existing book
            const index = books.findIndex(b => b.id === parseInt(bookId));
            if (index !== -1) {
                books[index] = book;
            }
        } else {
            // Add new book
            books.push(book);
        }

        localStorage.setItem('books', JSON.stringify(books));
        getBooks();
        resetForm();
    });

    // Edit book
    $(document).on('click', '.edit-book', function() {
        const bookId = $(this).data('id');
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const book = books.find(b => b.id === bookId);

        if (book) {
            $('#bookId').val(book.id);
            $('#title').val(book.title);
            $('#author').val(book.author);
            $('#year').val(book.year);
            $('#cancelEdit').removeClass('d-none');
        }
    });

    // Delete book
    $(document).on('click', '.delete-book', function() {
        const bookId = $(this).data('id');
        if (confirm('Are you sure you want to delete this book?')) {
            let books = JSON.parse(localStorage.getItem('books')) || [];
            books = books.filter(b => b.id !== bookId);
            localStorage.setItem('books', JSON.stringify(books));
            getBooks();
        }
    });

    // Cancel edit
    $('#cancelEdit').click(function() {
        resetForm();
    });

    // Reset form
    function resetForm() {
        $('#bookForm')[0].reset();
        $('#bookId').val('');
        $('#cancelEdit').addClass('d-none');
    }

    // Initial load
    getBooks();
});