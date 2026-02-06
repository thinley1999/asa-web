import { useState } from "react";
import { RouterProvider, BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes";
import { useRoutes } from "react-router";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="App">
      <RouterProvider router={routes}></RouterProvider>
      <Toaster /> 
    </div>
  );
}

export default App;
