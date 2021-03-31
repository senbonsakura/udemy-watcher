import React from 'react'

export interface PathContext{
    path:string,
    setCurrentPath: (currentpath:string)=>void
}

export const PATH_DEFAULT_VALUE = {
    path: '',
    setCurrentPath: ()=>{ }
}


export const pathContext = React.createContext<PathContext>(PATH_DEFAULT_VALUE)
