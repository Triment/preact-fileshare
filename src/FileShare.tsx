import { useEffect, useState } from "preact/hooks";
import UploadFile from "../components/File/Upload";
import "./app.css";
import Peer, { DataConnection } from "peerjs";

export function FileShare({ path, id }: { path: string; id?: string }) {
  const [peer, setPeer] = useState<Peer>();

  const [remoteID, setRemoteID] = useState("");
  const [localID, setLocalID] = useState("");

  const [file, setFile] = useState<File>();

  const [remoteConn, setRemoteConn] = useState<DataConnection>();
  useEffect(() => {
    const peer = new Peer({
      host: "nmmm.top",
      secure: true,
    });
    peer.on("open", (id) => {
      setLocalID(id);
    });
    peer.on("connection", (dataConn) => {
      console.log(`connect from ${dataConn.peer}`);
      setRemoteConn(dataConn);

      dataConn.on("open", () => {
        dataConn.on("data", (data) => {
          console.log(data);
        });
        dataConn.send("hello friend");
      });
      setRemoteConn(dataConn);
    });
    setPeer(peer);
  }, []);

  const connectRemote = () => {
    const conn = peer?.connect(remoteID);
    conn?.on("open", () => {
      conn?.on("data", (data) => {
        console.log(data);
      });
      conn?.send("hello");
    });
    setRemoteConn(conn);
  };

  const sendFile = (file: File)=>{
    remoteConn?.send(file)
  }
  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 p-3">
        <div>
          <span className="font-bold text-green-500">本机识别码:</span>
          <p className="text-orange-500 inline-block">{localID}</p>
        </div>
        <div className="w-full flex flex-row items-center">
          <span className="font-bold text-center text-green-500">
            输入对方识别码:
          </span>
          <input
            type="text"
            onChange={(e) => setRemoteID(e.currentTarget.value)}
            className="mx-2 text-orange-500 my-2 inline-block flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 focus:border-amber-200 focus:ring-pink-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400  sm:text-sm"
          />
        </div>
        <button
          onClick={connectRemote}
          className="switch w-full rounded-lg bg-green-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:border-green-300 hover:bg-green-500 focus:ring-2 focus:ring-green-300"
        >
          连接
        </button>
      </div>
      <UploadFile
        onChange={({ currentTarget: { files } }) => {
          remoteConn && sendFile(files![0]);
        }}
      />
      {id}
    </main>
  );
}
