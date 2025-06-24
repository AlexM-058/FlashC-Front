import { useAuthStore } from "../stores/authStore";
import { getToken } from "./jwt";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const httpRequest = async (
  url,
  options = {},
  undefinedContentType = false
) => {
  try {
    // Construiește URL complet
    const fullUrl = url.startsWith("https")
      ? url
      : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;

    // Dacă body este FormData, elimină Content-Type din headers
    if (options.body instanceof FormData) {
      if (options.headers) {
        delete options.headers["Content-Type"];
        delete options.headers["content-type"];
      }
    }

    // Copiază headers din opțiuni
    const headers = {
      ...options.headers,
    };

    // Atașează token, dacă există
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Setează Content-Type doar dacă nu este GET și body nu e FormData
    if (
      !undefinedContentType &&
      (!options.method || options.method.toUpperCase() !== "GET") &&
      !(options.body instanceof FormData)
    ) {
      headers["Content-Type"] =
        (options.headers && options.headers["Content-Type"]) ||
        "application/json";
    }

    // Setează credentials la 'include' dacă nu este deja definit
    const fetchOptions = {
      ...options,
      headers,
      credentials: options.credentials || "include",
    };

    const response = await fetch(fullUrl, fetchOptions);

    // Clonează răspunsul pentru a verifica statusul fără a consuma body
    const repClone = response.clone();

    if (repClone.status === 401 || repClone.status === 403) {
      let json = {};
      try {
        json = await repClone.json();
      } catch (e) {
        console.warn("Failed to parse JSON from response:", e);
      }
      if (json.message === "Token expired") {
        handleTokenExpired();
        return Promise.reject("Token has expired");
      }
    }

    return response;
  } catch (err) {
    // Ignoră erorile de tip AbortError fără a le loga
    if (err.name === "AbortError") {
      return Promise.reject(err);
    }

    console.error("HTTP Request failed: ", err);
    throw err;
  }
};

const handleTokenExpired = () => {
  const logout = useAuthStore.getState().logout;
  if (typeof logout === "function") {
    logout();
  }

  toast.error(
    "Your session has expired. You will be redirected to the login page."
  );

  setTimeout(() => {
    window.location.reload();
  }, 3000);
};
