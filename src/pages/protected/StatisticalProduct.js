import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import StatisticalProduct from '../../features/statistical-product/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Thống kê sản phẩm"}))
      }, [])


    return(
        <StatisticalProduct />
    )
}

export default InternalPage