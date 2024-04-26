import { Button } from "@axelor/ui";
import axios from "axios";
// import Grid from "@axelor/ui/grid";
import React from "react";
import { useState } from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import { useEffect } from "react";
import { login, rest } from "./services/rest";

const App = () => {
  const [searchKey, setSearchKey] = useState("a");
  const [limit, setLimit] = useState(40);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  async function handleSearch() {
    const response = await rest.get(
      `/elastic/searchFiles?searchKey=${searchKey}&limit=${limit}&offset=${offset}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
  }

  const [isLogin, setIsLogin] = useState(false);

  //login here
  useEffect(() => {
    console.log;
    const login = async () => {
      try {
        const response = await fetch("/api/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: "admin", password: "admin" }),
        });
        const csrf = response.headers.get("x-csrf-token");
        document.cookie = `CSRF-TOKEN=${csrf}`;
        return true;
      } catch (error) {
        return false;
      }
    };

    const handleLogin = async () => {
      const loginStatus = await login();
      setIsLogin(loginStatus);
    };
    handleLogin();
  }, []);

  useEffect(() => {
    isLogin &&
      (async () => {
        const response = await axios.get(
          `/api/ws/elastic/searchFiles?searchKey=${searchKey}&limit=${limit}&offset=${offset}`
        );
        console.log(response);
      })();
  }, [isLogin]);

  console.log(isLogin);

  return (
    <div>
      {login ? (
        <Toolbar
          offset={offset}
          limit={limit}
          total={total}
          handleSearch={handleSearch}
          searchKey={searchKey}
          setSearchKey={setSearchKey}
        />
      ) : (
        "login..."
      )}
    </div>
  );
};

export default App;
// /ws/elastic/searchFiles?searchKey={{search key from search bar}}&limit={{limit}}&offset={{offset}}
