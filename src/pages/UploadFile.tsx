import React from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function UploadFile() {
  const [file, setFile] = React.useState<any>();
  const [percent, setPercent] = React.useState(0);
  let history = useHistory();

  // Handles input change event and updates state
  function handleChange(event: any) {
    setFile(event.target.files[0]);
  }

  async function handleUpload() {
    if (!file) {
      alert('Please choose a file first!');
    }

    const formData = new FormData();

    formData.append('file', file);

    // const requestOptions = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json;charset=UTF-8',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Method': 'POST',
    //     'Access-Control-Request-Headers': 'Content-Type, Authorization',
    //   },
    //   body: formData,
    // };

    const storageRef = ref(storage, `/files/${file?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    localStorage.setItem("file", file?.name);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          localStorage.setItem("file_url", url);
          console.log(url);
        });
      }
    );

    await axios
    .post("http://aaf6-34-143-255-236.ngrok.io", formData)
    .then((res: any) => {
      console.log(res);
      localStorage.setItem("highlight", JSON.stringify(res.data.data.highlight));
      localStorage.setItem("tile", res.data.data.tile);
      history.push("hightlighter")
    })
    .catch((err: any) => console.warn(err));  
    
  }
    

  return (
    <div>
      <input
        type="file"
        accept="application/pdf,application/vnd.ms-excel"
        onChange={handleChange}
      />
      <button onClick={handleUpload} style={{color: 'black'}}>Upload to Firebase</button>
      <p style={{color: 'red'}}>{percent} "% done"</p>
    </div>
  );
}

export default UploadFile;
