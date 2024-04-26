import React from "react";
import styles from "./Toolbar.module.css";
const Toolbar = ({
  offset,
  limit,
  total,
  handleSearch,
  searchKey,
  setSearchKey,
}) => {
  return (
    <nav className={styles.toolbar}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className={styles.input}
        />
        <i
          className={`ri-search-line ${styles.searchIcon}`}
          onClick={handleSearch}
        ></i>
      </div>
      <div className={styles.pagination}>
        {offset} to {offset + limit < total ? limit : total} of {total}
      </div>
    </nav>
  );
};

export default Toolbar;
