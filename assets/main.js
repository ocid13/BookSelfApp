const books = []
const RENDER_EVENT = 'render-book'
const inputSearchBook = document.getElementById('searchBook')

document.addEventListener('DOMContentLoaded', function() {
    const bookSubmitButton = document.getElementById('inputBook')
    bookSubmitButton.addEventListener('submit', function(event) {
        event.preventDefault()
        addBook()
    })

    if(isStorageExist()) {
        loadDataFromStorage()
    }

    inputSearchBook.addEventListener('keyup', function(event) {
        event.preventDefault()
        searchBook()
    })

    inputSearchBook.addEventListener('submit', function(event) {
        event.preventDefault()
        searchBook()
    })
})

function addBook() {
    const titleInput = document.getElementById('titleBook').value
    const authorInput = document.getElementById('author').value
    const yearInput = document.getElementById('yearofPublic').value;
    const isComplete = document.getElementById('read').checked

    const generatedID = generatedId()
    const bookObject = generateBookObject(generatedID, titleInput, authorInput, parseInt(yearInput), false);


    books.push(bookObject)

    if(isComplete) {
        addBookToComplete(bookObject.id)
    }

    document.getElementById('titleBook').value = '';
    document.getElementById('author').value = '';
    document.getElementById('yearofPublic').value = '';

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function generatedId() {
    return + new Date()
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBookList = document.getElementById('books')
    uncompletedBookList.innerHTML = ''

    const completedBookList = document.getElementById('completed-books')
    completedBookList.innerHTML = ''

    for(const bookItem of books) {
        const bookElement = createBookItem(bookItem)
        if(!bookItem.isCompleted)
            uncompletedBookList.append(bookElement)
            else
                completedBookList.append(bookElement)
    }
})

function createBookItem(bookObject) {
    const titleElement = document.createElement('h2')
    titleElement.innerText = bookObject.title

    const authorElement = document.createElement('p')
    authorElement.innerText = bookObject.author

    const yearElement = document.createElement('p')
    yearElement.innerText = bookObject.year

    const actionContainer = document.createElement('div')
    actionContainer.classList.add('inner')
    actionContainer.append(titleElement, authorElement, yearElement)

    const container = document.createElement('div')
    container.classList.add('item', 'shadow')
    container.append(actionContainer)
    container.setAttribute('id', `book-${bookObject.id}`)

    if(bookObject.isCompleted) {
        const undoButton = document.createElement('button')
        undoButton.classList.add('undo-button')
        undoButton.addEventListener('click', function() {
            undoBookFromCompleted(bookObject.id)
        })

        const trashButton = document.createElement('button')
        trashButton.classList.add('trash-button')
        trashButton.addEventListener('click', function() {
            removeBookFromCompleted(bookObject.id)
        })

        container.append(undoButton, trashButton)
    } else {
        const checkButton = document.createElement('button')
        checkButton.classList.add('check-button')
        checkButton.addEventListener('click', function() {
            addBookToComplete(bookObject.id)
        })

        const trashButton = document.createElement('button')
        trashButton.classList.add('trash-button')
        trashButton.addEventListener('click', function() {
            removeBookFromCompleted(bookObject.id)
        })

        container.append(checkButton, trashButton)
    }
    return container
    }

function addBookToComplete(bookId) {
    const bookTarget = findBook(bookId)

    if(bookTarget == null) return
    bookTarget.isCompleted = true
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function findBook(bookId) {
    for(const bookItem of books) {
        if(bookItem.id === bookId) {
            return bookItem
        }
    }
    return null
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId)
    if(bookTarget === -1) return
    books.splice(bookTarget, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId)
    if(bookTarget == null) return
    bookTarget.isCompleted = false
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function findBookIndex(bookId) {
    for(const index in books) {
        if(books[index].id === bookId) {
            return index
        }
    }
    return -1
}

function saveData() {
    if(isStorageExist()) {
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

const SAVED_EVENT = 'save-book'
const STORAGE_KEY = 'BOOK_APPS'

function isStorageExist() {
    if(typeof(Storage) === undefined) {
        alert('Browser Anda tidak mendukung local storage')
        return false
    }
    return true
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY))
})

function loadDataFromStorage() {
    const serialData = localStorage.getItem(STORAGE_KEY)
    let data = JSON.parse(serialData)
    if(data !== null) {
        for(const book of data) {
            books.push(book)
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT))
}

function searchBook() {
    const searchBook = document.getElementById('searchTitle')
    const filter = searchBook.value.toUpperCase()
    const itemBook = document.querySelectorAll('section.container > .bookList > .item')
    for(let i = 0; i < itemBook.length; i++) {
        txtValue = itemBook[i].textContent || itemBook[i].innerText
        if(txtValue.toUpperCase().indexOf(filter) > -1) {
            itemBook[i].style.display = ''
        } else {
            itemBook[i].style.display = 'none'
        }
    }
}

function cekButton() {
    const span = document.querySelector('span')
    if(read.checked) {
        span.innerText = 'Sudah dibaca'
    } else {
        span.innerText = 'Belum dibaca'
    }
}