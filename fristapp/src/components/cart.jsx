import React, { useState, useEffect } from 'react'
import axios from 'axios'
export default function Cart() {
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const userId=localStorage.getItem("userId")
    useEffect(()=>{
        fetchCartItems()
    },[])
    async function fetchCartItems(){
        await axios.get("http://localhost:4000/api/cart",
            {params:{userId}}
        )
        .then((res)=>{
            console.log(res)
            if(res.status==200){
                setCartItems(res.data.items)
                setLoading(false)
            }
        })
    }
    return (
        <div className='container mt-4'>
      <h2>Cart List</h2>
      {
        loading ? (<p>Loading...</p>) : (
          <div className='row row-cols-1 row-cols-md-3 g-4 mt-3'>
            {
              cartItems.map((i) => (
                <div className="col" key={i.product._id}>
                  <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title"><b>Name:</b>{i.product.name}</h5>
                        <p className="card-text"><b>Price: </b>{i.product.price}</p>
                        <p className="card-text"><b>Category: </b>{i.product.category}</p>
                        <p className="card-text"><b>Description: </b>{i.product.description}</p>
                        <p className="card-text"><b>Stock: </b>{i.product.stock}</p>
                        <p className="card-text"><b>Quantity: </b>{i.quantity}</p>
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