import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Entry from '../../features/entry/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Nhập hàng"}))
      }, [])


    return(
        <Entry />
    )
}

export default InternalPage