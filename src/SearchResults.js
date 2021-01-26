import React from "react";
import Book from './Book';

const SearchResults = props => {
    const { books, searchBooks, onMove } = props;

    const updatedBooks = searchBooks.map(book => {
        books.map(b => {
            if(b.id === book.id){
                book.shelf = b.shelf
            }
            // console.log(b);
            return b;
        });
        // console.log(book);
        return book
    });

    return (
        <div className={'search-books-results'}>
            <ol className={'books-grid'}>
                {
                    updatedBooks.map(book => (
                        <Book
                            key={book.id}
                            book={book}
                            shelf={book.shelf ? book.shelf : 'none'}
                            onMove={onMove}
                        />
                    ))
                }
            </ol>
        </div>
    )
};

export default SearchResults;