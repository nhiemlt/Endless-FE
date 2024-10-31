import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ProductDetail from '../../customers/product-detail/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "ProductDetail"}))
      }, [])


    return(
        <ProductDetail/>
    )
}

export default InternalPage