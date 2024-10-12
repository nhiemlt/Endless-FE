import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Customer from '../../features/customer/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Khách hàng"}))
      }, [])


    return(
        <Customer />
    )
}

export default InternalPage