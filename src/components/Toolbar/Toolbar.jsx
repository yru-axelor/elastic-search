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
              setOffset(0);
              searchFiles(0);
            }
          }}
        />
        <i
          className={`ri-search-line ${styles.searchIcon}`}
          onClick={() => {
            setOffset(0);
            searchFiles(0);
          }}
        ></i>
      </div>
      {!limitOpen ? (
        <div className={styles.pagination} onClick={() => setLimitOpen(true)}>
          {offset + 1 < total ? offset + 1 : total} to{" "}
          {offset + limit < total ? offset + limit : total} of {total}
          <div className={styles.paginationIcon}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePagination(-1);
              }}
              disabled={offset <= 0}
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePagination(1);
              }}
              disabled={offset + limit >= total}
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.limitSettings}>
          <input
            type="number"
            min={1}
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
