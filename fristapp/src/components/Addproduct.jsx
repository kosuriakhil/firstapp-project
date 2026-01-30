import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export default function AddProduct() {
    const [name,setName]=useState("")
    const [price,setPrice]=useState("")
    const [description,setDescription]=useState("")
    const [category,setCategory]=useState("")
    const [stock,setStock]=useState("")
    const role=localStorage.getItem("role")
    const navigate=useNavigate()
    async function addProduct(e){
        e.preventDefault()
        const newProduct={
            name,price,description,category,stock:Number(stock),role
        }
        axios.post("http://localhost:4000/api/product/add",newProduct)
          .then((res)=>{
            console.log(res)
            if(res.status==200){
              alert("Product added successfull")
              navigate("/")
            }
          })
          .catch((err)=>{
            alert(err.response.data.message)
          })
    }

    return (
        <div className='container mt-4'>
      <div className="row d-flex justify-content-center ">
        <form onSubmit={addProduct} className='col-12 col-md-6'>
          <h2 className='text-center'>Add a Product</h2>
          <div className='mb-3'>
              <label className="form-label">Name </label>
              <input type="text" className="form-control" name="name" value={name} placeholder="Ex:AC" onChange={(e)=>setName(e.target.value)}/>
            </div>

            <div className='mb-3'>
              <label className="form-label">Price </label>
              <input type="text" className="form-control" name="price" value={price} placeholder="Ex:****" onChange={(e)=>setPrice(e.target.value)}/>
            </div>
            <div className='mb-3'>
              <label className="form-label">Description </label>
              <input type="text" placeholder="Ex:About Product" className="form-control" name="description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
            </div>

            <div className='mb-3'>
              <label className="form-label">Category</label>
              <input type="text" placeholder="Ex:electric/home" className="form-control" name="category" value={category} onChange={(e)=>setCategory(e.target.value)}/>
            </div>

            <div className='mb-3'>
              <label className="form-label">Stock </label>
              <input type="text" placeholder="Ex:Count " className="form-control" name="stock" value={stock} onChange={(e)=>setStock(e.target.value)}/>
            </div>
            <div className='mb-3 d-grid gap-2'>
              <button className='btn btn-success btn-lg'>Add Product</button>
            </div>
        </form>
      </div>
    </div>
    )
}