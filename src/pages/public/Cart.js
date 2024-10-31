import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Cart from '../../customers/cart/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Giỏ hàng"}))
      }, [])


    return(
        <Cart/>
    )
}

export default InternalPage