import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AboutUs from '../../customers/about-us/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "AboutUs"}))
      }, [])


    return(
        <AboutUs/>
    )
}

export default InternalPage