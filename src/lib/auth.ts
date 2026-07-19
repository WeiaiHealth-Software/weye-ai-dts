import { redirect } from "react-router";

const AUTH_KEY = "weiai_auth";

export function isAuthed() {
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function setAuthed() {
  localStorage.setItem(AUTH_KEY, "1");
}

export function clearAuthed() {
  localStorage.removeItem(AUTH_KEY);
}

export function requireAuthLoader() {
  if (!isAuthed()) {
    throw redirect("/login");
  }
  return null;
}

export function redirectIfAuthedLoader() {
  if (isAuthed()) {
    throw redirect("/");
  }
  return null;
}

