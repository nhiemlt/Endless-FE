import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import StatisticalInventory from '../../features/statistical-inventory/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Thống kê kho"}))
      }, [])


    return(
        <StatisticalInventory />
    )
}

export default InternalPage