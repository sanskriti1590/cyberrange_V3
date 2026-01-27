import React from "react";
import "./App.css";
import Router from "./Routes/Index";
import ThemeConfig from "./theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  //   var g_gTranslateIsAdded = false;
  // const googleTranslateElementInit = () => {
  //   if (!g_gTranslateIsAdded) {
  //     g_gTranslateIsAdded = true;
  //     new window.google.translate.TranslateElement(
  //       {
  //         pageLanguage: "en",
  //         autoDisplay: false,
  //       },
  //       "google_translate_element"
  //     );
  //   }
  // };

  // useEffect(() => {
  //   var addScript = document.createElement("script");
  //   addScript.setAttribute(
  //     "src",
  //     "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
  //   );
  //   document.body.appendChild(addScript);
  //   window.googleTranslateElementInit = googleTranslateElementInit;
  // }, []);

  return (
    <ThemeConfig>
      <Router />
      <ToastContainer />
    </ThemeConfig>
  );
};

export default App;
