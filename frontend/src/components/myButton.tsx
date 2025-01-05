
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
}

const Button = (props: ButtonProps) => {
  return (
    <button className='bg-orange-500 text-white font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-orange-600 
    duration-500'>
      {props.children}
    </button>
  )
}

export default Button