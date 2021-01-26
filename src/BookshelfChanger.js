import React, { Component } from "react";

class BookshelfChanger extends Component {
    state = {
        value: this.props.shelf
    };

    // Именно в методе handleChange мы вызываем метод onMove, передавая ему, bookIdи shelfкнига перемещается в.

    handleChange = event => {
        const value = event.target.value;
        this.setState({ value: value });
        this.props.onMove( this.props.book, value )
    };

    render() {
        return (
            <div className={'book-shelf-changer'}>
                <select value={this.state.value} onChange={this.handleChange}>
                    <option value="move" disabled={true}>Move to...</option>
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="wantToRead">Want to Read</option>
                    <option value="read">Read</option>
                    <option value="none">None</option>
                </select>
            </div>
        )
    }
}

export default BookshelfChanger;