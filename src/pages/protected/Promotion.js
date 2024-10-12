import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Promotion from '../../features/promotion/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Khuyến mãi"}))
      }, [])


    return(
        <Promotion />
    )
}

export default InternalPage