import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Rating from '../../features/rating/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Đánh giá"}))
      }, [])


    return(
        <Rating />
    )
}

export default InternalPage