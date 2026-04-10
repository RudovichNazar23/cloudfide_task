import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";


import MainPage from "./components/MainPage.tsx";
import FileTree from "./components/FileTree.tsx";
import NodeDetails from "./components/NodeDetails.tsx";

function App() {

  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage/>} />
      <Route path={"/tree"} element={<FileTree/>} />
      <Route path={"/tree/*"} element={<NodeDetails />}/>
    </Routes>
  </BrowserRouter>
}

export default App
