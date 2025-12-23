// GalleryList.jsx (ringkas)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function GalleryList(){
  const [items,setItems]=useState([]);
  useEffect(()=> setItems([{id:1,src:"/images/g1.jpg"}]),[]);
  return (
    <div>
      <div className="header"><h2>Gallery</h2><Link to="/admin/gallery/create" className="btn primary">Tambah</Link></div>
      <div className="gallery-admin-grid">
        {items.map(it=>(
          <div key={it.id} className="gallery-card">
            <img src={it.src} alt="" />
            <div className="card-actions"><Link to={`/admin/gallery/edit/${it.id}`} className="btn small">Edit</Link></div>
          </div>
        ))}
      </div>
    </div>
  );
}
