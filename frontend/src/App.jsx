import React, { useState } from "react";
import FileUpload from "./components/FileUpload";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <FileUpload />
    </div>
  );
}

export default App;
