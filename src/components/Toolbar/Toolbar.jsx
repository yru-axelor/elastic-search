import React from "react";
import styles from "./Toolbar.module.css";
import { useState } from "react";
const Toolbar = ({
  offset,
  limit,
  total,
  searchFiles,
  searchKey,
  setSearchKey,
  handlePagination,
  setLimit,
  setOffset,
}) => {
  const [limitOpen, setLimitOpen] = useState(false);
  const [tempLimit, setTempLimit] = useState(limit);

  async function handleSearchFile() {
    await setOffset(() => 0);
    searchFiles();
  }
  return (
    <nav className={styles.toolbar}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className={styles.input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              searchFiles(0);
            }
          }}
        />
        <i
          className={`ri-search-line ${styles.searchIcon}`}
          onClick={() => {
            searchFiles(0);
          }}
        ></i>
      </div>
      {!limitOpen ? (
        <div className={styles.pagination} onClick={() => setLimitOpen(true)}>
          {offset + 1 < total ? offset + 1 : total} to{" "}
          {offset + limit < total ? offset + limit : total} of {total}
          <div className={styles.paginationIcon}>
            <i
              className="ri-arrow-left-s-line"
              onClick={(e) => {
                e.stopPropagation();
                handlePagination(-1);
              }}
            ></i>
            <i
              className="ri-arrow-right-s-line"
              onClick={(e) => {
                e.stopPropagation();
                handlePagination(1);
              }}
            ></i>
          </div>
        </div>
      ) : (
        <div className={styles.limitSettings}>
          <input
            type="number"
            min={0}
            className={styles.limitInput}
            value={tempLimit}
            onChange={(e) => setTempLimit(Number(e.target.value))}
          />
          <button
            className={styles.btn}
            onClick={() => {
              setLimit(tempLimit);
              setLimitOpen(false);
            }}
          >
            Apply
          </button>
        </div>
      )}
    </nav>
  );
};

export default Toolbar;
