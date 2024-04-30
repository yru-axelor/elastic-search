import { Grid } from "@axelor/ui/grid";
import React from "react";
import { useState } from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import { useEffect } from "react";
import { rest } from "./services/rest";
import { useCallback } from "react";
import { produce } from "immer";
import { useMemo } from "react";
// title,details,size,created On, Download(Icon)
const columns = [
  { name: "title", title: "Title", type: "String" },
  { name: "details", title: "Details", type: "String" },
  { name: "size", title: "Size", type: "String" },
  { name: "created_at", title: "Created on", type: "String" },
  { name: "download", title: "Download" },
];
const App = () => {
  const [initialRender, setInitialRender] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [limit, setLimit] = useState(40);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState([]);
  const [state, setState] = useGridState();

  async function searchFiles(val) {
    try {
      console.log(val);
      const response = await rest.get(
        `/elastic/searchFiles?searchKey=${searchKey}&limit=${limit}&offset=${
          val ? val : offset
        }`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === 0) {
        setResult(response.data.data.result);
        setTotal(response.data.data.total);
      } else {
        alert("Error in Searching File");
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDownload(title) {
    try {
      const response = await rest.get(`elastic/findFile?fileName=${title}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.status !== 0) {
        alert(response.data.data.message);
      } else {
        const link = document.createElement("a");
        link.href = response.data.data.url;
        link.setAttribute("download", title);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function handlePagination(val) {
    if (val === 1) {
      offset + limit < total &&
        setOffset((prev) => (prev + limit < total ? prev + limit : total));
    } else {
      offset - limit >= 0 &&
        setOffset((prev) => (prev - limit < 0 ? 0 : prev - limit));
    }
  }

  useEffect(() => {
    if (!initialRender) {
      searchFiles();
    } else {
      setInitialRender(false);
    }
  }, [limit, offset]);

  const records = useMemo(() => {
    const record = result?.map((record) => ({
      created_at: record.created_at.substring(0, 10),
      size: record.size,
      title: record.title,
      details: record.body,
      download: (
        <i
          className={`ri-file-download-fill downloadIcon`}
          onClick={() => handleDownload(record.title)}
        ></i>
      ),
    }));
    return record;
  }, [result]);

  return (
    <>
      <Toolbar
        offset={offset}
        limit={limit}
        total={total}
        searchFiles={searchFiles}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        handlePagination={handlePagination}
        setLimit={setLimit}
        setOffset={setOffset}
      />
      {records?.length > 0 && (
        <>
          <Grid
            allowSelection
            allowCheckboxSelection
            allowCellSelection
            selectionType="multiple"
            records={records}
            columns={columns}
            state={state}
            setState={setState}
          />
        </>
      )}
    </>
  );
};

export default App;

function useGridState(intialState) {
  const [state, setState] = useState({
    columns: [],
    rows: [],
    ...intialState,
  });
  const setMutableState = useCallback(
    (newState) => setState(produce(newState)),
    [setState]
  );

  return [state, setMutableState];
}
