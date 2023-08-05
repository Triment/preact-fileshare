export const DataConnDownload = (data: any) => {
    setConnectState(prev=>prev|8)
    console.log(typeof data);
    if (data.dataType === DataType.FILE) {
      download(
        data.file || "",
        data.fileName || "fileName",
        data.fileType
      );
    } else {
      console.log(data);
    }
  });