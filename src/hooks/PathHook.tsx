import  {useState} from 'react'
import {PathContext} from '../state/PathContext'


export const usePath = ():PathContext => {
    const [path, setPath] = useState('')
    const setCurrentPath =(currenturl:string)=> setPath(currenturl)

    return {path,setCurrentPath}
}
