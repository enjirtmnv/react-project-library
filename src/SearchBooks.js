import React, { Component } from "react";
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

class SearchBooks extends Component {
    render() {
        const { books, searchBooks, onSearch, onResetSearch, onMove } = this.props;
        return (
            <div className={'search-books'}>
                <SearchBar onSearch={onSearch} onResetSearch={onResetSearch} />
                <SearchResults
                    books={books}
                    searchBooks={searchBooks}
                    onMove={onMove}
                />
            </div>
        )
    }
}

export default SearchBooks;