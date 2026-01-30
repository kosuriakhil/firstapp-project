import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const role=localStorage.getItem("role")
  const navigate=useNavigate()
  useEffect(() => {
    fetchProducts()
  }, [])

  function addToCart(productId){
    console.log(productId,role)
    const userId=localStorage.getItem("userId")
    if(!userId){
      alert("Login first to access the products")
      return false
    }
    axios.post("http://localhost:4000/api/cart/add",
      {productId, quantity:1}, 
      {params:{userId}
    })
      .then(res=>{
        if(res.status==200){
          alert("Product added successfully to cart")
          navigate("/cart")
        }
        else{
          alert(res.data.message)
        }
      })
      .catch(err=>{
        console.log("error from add cart logic ",err)
      })
  }

  async function fetchProducts() {
    axios.get("http://localhost:4000/api/product")
      .then((res) => {
        console.log(res.data)
        if (res.status == 200) {
          setProducts(res.data)
          setLoading(false)

        }
      })
  }
  return (
    <div className='container mt-4'>
      <h2>Products</h2>
      {
        loading ? (<p>Loading...</p>) : (
          <div className='row row-cols-1 row-cols-md-3 g-4 mt-3'>
            {
              products.map((i) => (
                <div className="col" key={i._id}>
                  <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title"><b>Name:</b>{i.name}</h5>
                        <p className="card-text"><b>Price: </b>{i.price}</p>
                        <p className="card-text"><b>Category: </b>{i.category}</p>
                        <p className="card-text"><b>Description: </b>{i.description}</p>
                        <p className="card-text"><b>Stock: </b>{i.stock}</p>
                        {
                          role=="admin"?(
                            <button onClick={()=>deleteProduct(i._id)} className='btn btn-danger'>Delete</button>
                          ):(
                            <button onClick={()=>addToCart(i._id)} className='btn btn-warning text-white'>Add to Cart</button>
                          )
                        }
                      </div>
                  </div>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  )
}