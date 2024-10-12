import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ProductVersion from '../../features/product-version/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Phiên bản sản phẩm"}))
      }, [])


    return(
        <ProductVersion />
    )
}

export default InternalPage