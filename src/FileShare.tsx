'use client';

import download from "js-file-download";
import { Peer, type DataConnection } from "peerjs";
import { useEffect, useState } from "preact/hooks";
import UploadFile from "../components/File/Upload";
import "./app.css";

export enum DataType {
  FILE = "FILE",
  OTHER = "OTHER",
}

export interface Data {
  dataType: DataType;
  file?: Blob;
  fileName?: string;
  fileType?: string;
  message?: string;
}

export function FileShare({  id, url }: { path: string; id?: string, url?: string }) {
  const [connectState, setConnectState] = useState(0)

  const [peer, setPeer] = useState<Peer>();

  const [remoteID, setRemoteID] = useState("");
  const [localID, setLocalID] = useState("");


  const [remoteConn, setRemoteConn] = useState<DataConnection>();
  useEffect(() => {
    import('peerjs').then(({ Peer })=>{
      const peer = new Peer({
        host: "nmmm.top",
        secure: true,
        path: '/peer'
      });
      setPeer(peer);
  
      /** get id from peer js server */
      peer.on("open", (peerID) => {
        setConnectState(prev=>prev|1); //set last bit to 1
        setLocalID(peerID);
        if(id){
          console.log('id existed')
          connectRemote(peer, id);
        }
      });
  
      /** deal with incoming data connection */
      peer.on("connection", (dataConn) => {
        setConnectState(prev=>prev|4)
        console.log(`connect from ${dataConn.peer}`);
        setRemoteConn(dataConn);
        handleData(dataConn)     
      });
    })
    if(id){
      setRemoteID(id);
    }
    
    
  }, [id]);

  const handleData = (dataConn: DataConnection)=>{
    dataConn.on("open", () => {
      dataConn.on("data", (data: any) => {
        console.log(data)
        setConnectState(prev=>prev|8)
        if (data.dataType === DataType.FILE) {
          download(
            data.file || "",
            data.fileName || "fileName",
            data.fileType
          );
          dataConn.send({
            dataType: DataType.OTHER,
            action: 'ack'
          })
        } else {
          if(data.dataType === DataType.OTHER) {
            if (data.action === 'close') closeRemote(dataConn);
            if (data.action === 'ack') console.log(`文件传输完毕`);
          } 
          console.log(data);
        }
      });
      dataConn.send("hello friend");
    });
    dataConn.on('close', ()=>{
      closeRemote(dataConn)
    })
  }
  /**
   * connect remote peer
   */
  const connectRemote = (peer: Peer,id: string) => {
    const conn = peer?.connect(id);
    conn?.on("open", () => {
      setConnectState(prev=>prev|2)
      handleData(conn);
    });
    setRemoteConn(conn);
    conn.on('close', ()=>{
      closeRemote(conn)
    })
  };
  /**
   * close remote connection
   */
  const closeRemote = (dataConn: DataConnection)=>{
    dataConn.send({
      dataType: DataType.OTHER,
      action: 'close'
    })
    dataConn?.close();
    if(connectState & 2){
      setConnectState(connectState-2)
    }
    if(connectState & 4){
      setConnectState(connectState-4)
    }
  }
  /** send file to remote connection */
  const sendFile = (file: Data) => {
    remoteConn?.send(file);
    remoteConn?.dataChannel.onbufferedamountlow
  };
  return (
    <main className="w-full h-full flex flex-col items-center justify-center dark:bg-black">
      { (connectState & 1) === 1 && <p className="text-red-600">初始化</p>}
      { (connectState & 2) === 2 && <p className="text-red-600">发送远程连接</p>}
      { (connectState & 4) === 4 && <p className="text-green-600">被连接</p>}
      { (connectState & 8) === 8 && <p className="text-green-600">数据接受</p>}
      <div className="my-2 w-full rounded-lg bg-slate-200 shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 p-3">
        <div>
          <span className="font-bold text-green-500">本机识别码:</span>
          <p className="mx-2 text-orange-500 inline-block">{localID}</p>
        </div>
        <div>
        <span className="font-bold text-green-500">远程链接:</span>
        <p className="mx-2 text-orange-500 inline-block">{id ? new URL(localID, `https://nmmm.top${url}`).toString(): `https://nmmm.top/fileshare/${localID}` }</p>
        </div>
        <div className="w-full flex flex-row items-center">
          <span className="font-bold text-center text-green-500">
            输入对方识别码:
          </span>
          <input
            type="text"
            onChange={(e) => setRemoteID(e.currentTarget.value)}
            className="switch mx-2 text-orange-500 my-2 inline-block flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 focus:outline-none focus:border-amber-200 focus:ring-pink-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400  sm:text-sm"
          />
        </div>
        { remoteID && !id && <p>点击连接开始与{remoteID}交换文件</p>}
        { peer && (connectState & 2) !== 2 && (connectState & 4) !== 4 && <button
          onClick={()=>connectRemote(peer!, remoteID)}
          className="switch w-full rounded-lg bg-green-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:border-green-300 hover:bg-green-500 focus:ring-2 focus:ring-green-300"
        >
          连接
        </button>}
        { ((connectState & 2) === 2 || (connectState & 4) === 4) && <button
          onClick={()=>closeRemote(remoteConn!)}
          className="my-2 switch w-full rounded-lg bg-red-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:border-red-300 hover:bg-red-500 focus:ring-2 focus:ring-red-300"
        >
          断开
        </button>}
      </div>
      <UploadFile
        onChange={({ currentTarget: { files } }) => {
          remoteConn &&
            sendFile({
              dataType: DataType.FILE,
              file: files![0],
              fileName: files![0].name,
              fileType: files![0].type,
            });
        }}
      />
    </main>
  );
}
