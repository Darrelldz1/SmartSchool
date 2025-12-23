// GalleryForm.jsx (upload)
import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
export default function GalleryForm(){
  const {id}=useParams(); const [file,setFile]=useState(null); const navigate=useNavigate();
  useEffect(()=>{ if(id){ /* load data */ } },[id]);
  function submit(e){ e.preventDefault(); /* upload */ alert("Uploaded (dummy)"); navigate("/admin/gallery"); }
  return (
    <form onSubmit={submit}>
      <label>Image</label>
      <input type="file" onChange={e=>setFile(e.target.files[0])} />
      <button className="btn primary">Simpan</button>
    </form>
  );
}
