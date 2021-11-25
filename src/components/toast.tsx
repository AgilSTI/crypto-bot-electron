/* eslint-disable prettier/prettier */
import React from 'react';

type ToastProps = {
  children: React.ReactNode;
};
export default function Toast({ children }: ToastProps) {
  return <>
  <div className="notification">
        {children}
  </div>
  
  </>;
}
