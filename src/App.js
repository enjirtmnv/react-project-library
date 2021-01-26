import React, {Component} from 'react';
import { Route } from 'react-router-dom'
import { debounce } from 'throttle-debounce'
import * as BooksAPI from './BooksAPI'
import './App.css';

import ListBooks from './ListBooks'
import SearchBooks from './SearchBooks'


class BooksApp extends Component {

    state = {
        books: [],
        error: false,
        searchBooks: [],
    };

    bookshelves = [
        {key: 'currentlyReading', name: 'Currently Reading'},
        {key: 'wantToRead', name: 'Want to Read'},
        {key: 'read', name: 'Have Read'},
    ];

    // В BooksApp создаем метод moveBook, который отвечает за перемещение книги с одной книжной полки на другую.
    // Он находится наверху стека компонентов в BooksApp, так что он может получить доступ к состоянию books.
    // Затем метод передаем компоненту BookshelfChanger. Он проходит через: ListBooks -> Bookcase -> Bookshelf -> Book -> BookshelfChanger
    // Оказавшись там, onMove вызывается в методе handleChange
    // Здесь мы видим шаблон контролируемого компонента, в котором React используется для управления состоянием элемента, что делает React «единственным источником истины».
    //
    // В BookshelfChanger создаем свойство state для управления значением элемента select и передаем его атрибуту value.
    // И создаем метод onChange для обновления состояния при изменении значения.
    // Именно в методе handleChange мы вызываем метод onMove, передавая ему bookId и shelf (полку), на которую перемещается книга.

    moveBook = (book,shelf) => {
        BooksAPI.update(book, shelf)
            .then(books => {
                console.log(books)
            });

        // обновляем метод bookMove для handle, которые были добавлены из поиска и у которых нет свойства полки.
        // Этот код обновляет базу данных и отфильтровывает книгу из books.
        // Если указана полка, отличная от «none», свойство shelf добавляется в книгу, а книга добавляется в state.

        let updatedBooks = [];
        updatedBooks = this.state.books.filter( b => b.id !== book.id);

        if (shelf !== 'none' ){
            book.shelf = shelf;
            updatedBooks = updatedBooks.concat(book)
        }

        this.setState({
            books: updatedBooks,
        })
    };

    // Создаем метод searchForBooks, который будет вызываться из компонента SearchBooksInput
    // Метод совершает вызов Ajax, если длина запроса больше нуля, в противном случае он очищает данные.
    // Затем он устанавливает состояние в пустой массив, если совпадения нет (возвращается ошибка).
    // В противном случае устанавливается состояние с результатами.
    // Также передаем обработчики searchForBooks и SearchBooksInput, как реквизиты: onSearch={this.searchForBooks} и onResetSearch={this.resetSearch}

    searchForBooks = debounce(300, false, query => {
        if (query.length > 0){
            BooksAPI.search(query)
                .then(books => {
                    if (books.error){
                        this.setState({ searchBooks: [] })
                    } else {
                        this.setState({ searchBooks: books })
                    }
                })
        } else {
            this.setState({ searchBooks: [] })
        }
    });

    // Создаем метод resetSearchметод, который будет вызываться из компонента CloseSearchButton

    resetSearch = () => {
        this.setState({ searchBooks: [] })
    };

    componentDidMount() {
        BooksAPI.getAll()
            .then(books => {
                this.setState({books: books})
            })
            .catch(error => {
                console.log('error - ' + error);
                this.setState({error: true})
            })
    }

    render() {
        const {books, searchBooks} = this.state;

        return (
            <div className={'app'}>
                <Route
                    exact
                    path={'/'}
                    render={() => (
                        <ListBooks
                            bookshelves={this.bookshelves}
                            books={books}
                            onMove={this.moveBook}
                        />
                    )}
                />
                <Route
                    path={'/search'}
                    render={() => (
                        <SearchBooks
                            searchBooks={searchBooks}
                            books={books}
                            onSearch={this.searchForBooks}
                            onMove={this.moveBook}
                            resetSearch={this.resetSearch}
                        />
                    )}
                />
            </div>
        )
    }
}

// path={'/'}

// class ListBooks extends Component {
//     render() {
//
//         const {bookshelves, books, onMove} = this.props;
//
//         return (
//             <div className={'list-books'}>
//                 {/*{console.log(books)};*/}
//                 <div className={'list-books-title'}>
//                     <h1>MyReads</h1>
//                 </div>
//                 <Bookcase bookshelves={bookshelves} books={books} onMove={onMove}/>
//                 <OpenSearchButton/>
//             </div>
//         )
//     }
// }

// const Bookcase = props => {
//     const {bookshelves, books, onMove} = props;
//     return (
//         <div className={'list-books-content'}>
//             <div>
//                 {bookshelves.map(shelf => (
//                     <Bookshelf key={shelf.key} shelf={shelf} books={books} onMove={onMove}/>
//                 ))}
//             </div>
//         </div>
//     )
// };

// const Bookshelf = props => {
//     const {shelf, books, onMove} = props;
//     const booksOnThisShelf = books.filter(book => book.shelf === shelf.key);
//
//     return (
//         <div className={'bookshelf'}>
//             <h2 className={'bookshelf-title'}>{shelf.name}</h2>
//             <div className={'bookshelf-books'}>
//                 <ol className={'books-grid'}>
//                     {
//                         booksOnThisShelf.map(book => (
//                             <Book key={book.id} book={book} shelf={shelf.key} onMove={onMove}/>
//                         ))
//                     }
//                 </ol>
//             </div>
//         </div>
//     )
// };

// Нам нужно убедиться, что приложение обрабатывает книги, у которых отсутствуют авторы или обложки.

// const Book = props => {
//     const {book, shelf, onMove} = props;
//     return (
//         <li>
//             <div className={'book'}>
//                 <div className={'book-top'}>
//                     <div
//                         className={'book-cover'}
//                         style={{
//                             width: 128,
//                             height: 193,
//                             backgroundImage: `url(${book.imageLinks && book.imageLinks.thumbnail})`,
//                         }}
//                     > </div>
//                     <BookshelfChanger book={book} shelf={shelf} onMove={onMove}/>
//                 </div>
//                 <div className={'book-title'}> {book.title} </div>
//                 <div className={'book-authors'}> {book.authors && book.authors.join(', ')} </div>
//             </div>
//         </li>
//     )
// };

// class BookshelfChanger extends Component {
//     state = {
//         value: this.props.shelf
//     };
//
//     // Именно в методе handleChange мы вызываем метод onMove, передавая ему, bookIdи shelfкнига перемещается в.
//
//     handleChange = event => {
//         this.setState({ value: event.target.value });
//         this.props.onMove( this.props.book, event.target.value )
//     };
//
//     render() {
//         return (
//             <div className={'book-shelf-changer'}>
//                 <select value={this.state.value} onChange={this.handleChange}>
//                     <option value="move" disabled={true}>Move to...</option>
//                     <option value="currentlyReading">Currently Reading</option>
//                     <option value="wantToRead">Want to Read</option>
//                     <option value="read">Read</option>
//                     <option value="none">None</option>
//                 </select>
//             </div>
//         )
//     }
// }

// const OpenSearchButton = () => {
//     return (
//         <div className={'open-search'}>
//             <Link to={'/search'}>
//                 <button>Add a Book</button>
//             </Link>
//         </div>
//     )
// };

// path={'/search'}

// class SearchBooks extends Component {
//     render() {
//         const { books, searchBooks, onSearch, onResetSearch, onMove } = this.props;
//         return (
//             <div className={'search-books'}>
//                 <SearchBar onSearch={onSearch} onResetSearch={onResetSearch} />
//                 <SearchResults
//                     books={books}
//                     searchBooks={searchBooks}
//                     onMove={onMove}
//                 />
//             </div>
//         )
//     }
// }

// const SearchBar = props => {
//     const { onSearch, onResetSearch } = props;
//     return (
//         <div className={'search-books-bar'}>
//             <CloseSearchButton onResetSearch={onResetSearch} />
//             <SearchBooksInput onSearch={onSearch} />
//         </div>
//     )
// };

// Вызываем обработчик сброса при нажатии кнопки внутри компонента CloseSearchButton.

// const CloseSearchButton = props => {
//     const { onResetSearch } = props;
//     return (
//         <Link to={'/'}>
//             <button className={'close-search'} onClick={onResetSearch}>
//                 Close
//             </button>
//         </Link>
//     )
// };

// Настраиваем search input, как управляемый компонент
// Используем onChange для обновления локального состояния и запуска обработчика onSearch (метод searchForBooks, определенный в BooksApp).


// class SearchBooksInput extends Component {
//     state = {
//         value: ''
//     };
//
//     handleChange = event => {
//         const val = event.target.value;
//         this.setState({ value: val }, () => {
//             this.props.onSearch(val)
//         })
//     };
//
//     render() {
//         return (
//             <div className={'search-books-input-wrapper'}>
//                 <input
//                     type="text"
//                     value={this.state.value}
//                     placeholder={'Search by title or author'}
//                     onChange={this.handleChange}
//                 />
//             </div>
//         )
//     }
// }
// Затем мне нужно было, чтобы результаты поиска отражали состояние всех книг, которые я уже добавил на свои полки.
// В книге должно быть написано «нет» ('none'), если она не добавлена. updatedBooks

// В updatedBooks используем метод map для книг из результатов поиска, а затем для каждой книги сопоставляется с добавленными книгами на полку,
// если есть совпадение, то устанавливаем свойство полки.

//заменяем searchBooks на updatedBooks
// Теперь в результате поиска отображаются книги, которые были добавлены в полку, с указанием полки, на которой находится в настоящее время.

// const SearchResults = props => {
//     const { books, searchBooks, onMove } = props;
//
//     const updatedBooks = searchBooks.map(book => {
//         books.map(b => {
//             if(b.id === book.id){
//                 book.shelf = b.shelf
//             }
//             // console.log(b);
//             return b;
//         });
//         // console.log('return book - ' + book);
//         return book
//     });
//
//     return (
//         <div className={'search-books-results'}>
//             <ol className={'books-grid'}>
//                 {
//                     updatedBooks.map(book => (
//                         <Book
//                             key={book.id}
//                             book={book}
//                             shelf={book.shelf ? book.shelf : 'none'}
//                             onMove={onMove}
//                         />
//                     ))
//                 }
//             </ol>
//         </div>
//     )
// };

export default BooksApp;


// Чтобы количество вызовов Ajax было ограничено разумным числом используем throttle / debounce,
// Throttle ограничивает количество вызовов до одного раза в течение определенного периода времени,
// а debounce будет ждать определенный период времени после последнего вызова, чтобы вызвать функцию.
//
// В нашем случае нам нужен debounce, который мы реализуем в нашем методе searchForBooks, обернув стрелочную функцию таким образом.
// Для начала нам нужно установить библиотеку: npm install throttle-debounce
