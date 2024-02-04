import React from 'react';
import { Oval, OvalProps } from 'react-loader-spinner';


const Loader = (props: OvalProps) => {
  return (
    <Oval height={20} width={20} strokeWidth={5} secondaryColor='#fff' color='white' {...props} />
  )
}

export default Loader;