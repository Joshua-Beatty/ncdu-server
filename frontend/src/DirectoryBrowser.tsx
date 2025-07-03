import { useEffect, useState } from "react";
import type { DirectoryParsed } from "./utils/parseDirectory";
import parseDirectory from "./utils/parseDirectory";
import DirectoryNavigator from "./DirectoryNavigator";

export default function DirectoryBrowser() {
  const [loading, setLoading] = useState(
    "loading" as "loading" | "error" | "loaded"
  );
  const [data, setData] = useState(null as null | DirectoryParsed);
  const [err, setErr] = useState(null as any);

  useEffect(() => {
    fetch("/api/output")
      .then((x) => x.json())
      .then((x) => {
        setData(parseDirectory(x[3]));
        setLoading("loaded");
      })
      .catch((x) => {
        setErr(x);
        setLoading("loading");
      });
  }, []);

  return (
    <>
      {loading == "loading" && <p>Loading</p>}
      {err && <p>{JSON.stringify(err)}</p>}
      {loading == "loaded" && data && (
        <p>{<DirectoryNavigator directory={data} />}</p>
      )}
    </>
  );
}
