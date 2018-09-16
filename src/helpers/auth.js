/**
 * 登录及用户信息管理
 */

import jwtDecode from "jwt-decode";

const setRole = role => {
  localStorage.setItem("role", role);
};

const getRole = () => {
  return localStorage.getItem("role");
};

const setClass = className => {
  localStorage.setItem("class", className);
};

const getClass = () => {
  return localStorage.getItem("class");
};

const setGrade = grade => {
  localStorage.setItem("grade", grade);
};

const getGrade = () => {
  return localStorage.getItem("grade");
};

const setId = id => {
  localStorage.setItem("id", id);
};

const getId = () => {
  return localStorage.getItem("id");
};

const setToken = token => {
  localStorage.setItem("token", token);
};

const getToken = () => {
  return localStorage.getItem("token");
};

const setName = name => {
  localStorage.setItem("name", name);
};

const getName = () => {
  return localStorage.getItem("name");
};

const logout = () => {
  localStorage.removeItem("token");
};

const isTokenExpired = token => {
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    } else return false;
  } catch (err) {
    return true;
  }
};

const isLoggedIn = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

const login = (id, password) => {
  return fetch(
    process.env.NODE_ENV !== "production"
      ? "/auth"
      : "https://info.thuee.org/api/auth",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id,
        password: password
      })
    }
  )
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Login failed!");
      }
    })
    .then(res => {
      setToken(res.token);
      setRole(res.role);
      setName(res.name);
      setId(res.id);
      setClass(res.class);
      return Promise.resolve(res);
    });
};

const authedFetch = (url, options) => {
  if (options === undefined) {
    options = {};
  }
  if (options["headers"] === undefined) {
    options["headers"] = {};
  }

  options["headers"]["x-access-token"] = getToken();
  options["headers"]["x-access-id"] = getId();
  return fetch(
    process.env.NODE_ENV !== "production"
      ? url
      : "https://info.thuee.org/api" + url,
    options
  );
};

export default {
  setRole,
  getRole,
  setId,
  getId,
  setToken,
  getToken,
  setName,
  getName,
  setClass,
  getClass,
  setGrade,
  getGrade,
  logout,
  isTokenExpired,
  isLoggedIn,
  login,
  authedFetch
};
