import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom' 
import axios from 'axios'
export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [address, setAddress] = useState("")
  const [mobile, setMobile] = useState("")

  const navigate=useNavigate()

  function handleRegister(e){
    e.preventDefault()
    //console.log(e)
    let newUser={name,email,mobile:Number(mobile),password,address}
    console.log(newUser)
    console.log(import.meta.env)
console.log(import.meta.env.VITE_API_BACKEND)

    axios.post("http://localhost:4000/api/create-user",newUser)
      .then((res)=>{
        console.log(res.data)
        if(res.data.status===201){
          navigate("/login")
        }
      })

    setName("")
    setEmail("")
    setPassword("")
    setMobile("")
    setAddress("")
  }

  return (
    <div className='container mt-4'>
      <div className="row">
        <form onSubmit={handleRegister} className='col-12 col-md-6'>
          <h2>Register</h2>
          <div className='mb-3'>
              <label className="form-label">Name </label>
              <input type="text" className="form-control" name="name" value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>

            <div className='mb-3'>
              <label className="form-label">Email </label>
              <input type="email" className="form-control" name="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div className='mb-3'>
              <label className="form-label">Password </label>
              <input type="password" className="form-control" name="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>

            <div className='mb-3'>
              <label className="form-label">Mobile Number</label>
              <input type="text" className="form-control" name="mobile" value={mobile} onChange={(e)=>setMobile(e.target.value)}/>
            </div>

            <div className='mb-3'>
              <label className="form-label">Address </label>
              <input type="text" className="form-control" name="address" value={address} onChange={(e)=>setAddress(e.target.value)}/>
            </div>
            <div className='mb-3'>
              <button className='btn btn-outline-success btn-lg'>Submit</button>
            </div>
        </form>
      </div>
    </div>
  )
}


// name email password mobile address