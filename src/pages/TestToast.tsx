import React from 'react'
import { toast } from "sonner"

const TestToast = () => {
  return (
    <div>
        <button className='p-2 bg-white' onClick={
            () => {
                toast.success("Hello world")
            }
        }><span className='text-red-500 text-xl'>Click me</span></button>
    </div>
  )
}

export default TestToast