import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import useStartScan from "./utils/useStartScan";
import DirectoryBrowser from "./DirectoryBrowser";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

function App() {
  const { data, err, start, isDone } = useStartScan();
  useEffect(()=>{start()}, [])
  return (
    <>
      {!isDone && (
        <div className="flex justify-center items-center w-full h-screen p-4">
          <Card className="flex flex-col justify-center items-center min-w-6/12 min-h-3/12 p-4">
            {!isDone && <pre className="w-full">{data}</pre>}
            {err && JSON.stringify(err)}
          </Card>
        </div>
      )}
      {isDone && <DirectoryBrowser />}
    </>
  );
}

export default App;
