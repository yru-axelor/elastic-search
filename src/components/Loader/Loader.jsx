import React from "react";

import styles from "./Loader.module.css";
const Loader = ({ loading }) => {
  return <>{loading && <div className={styles.container}>Loading...</div>}</>;
};

export default Loader;
