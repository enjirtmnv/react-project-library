import { Link } from "react-router-dom";
import React from "react";

const CloseSearchButton = props => {
    const { onResetSearch } = props;
    return (
        <Link to={'/'}>
            <button className={'close-search'} onClick={onResetSearch}>
                Close
            </button>
        </Link>
    )
};

export default CloseSearchButton;