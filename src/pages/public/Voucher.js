import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Voucher from '../../customers/voucher/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Voucher"}))
      }, [])


    return(
        <Voucher/>
    )
}

export default InternalPage