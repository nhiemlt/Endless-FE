import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import StatisticalRevenue from '../../features/statistical-revenue/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Thống kê doanh thu"}))
      }, [])


    return(
        <StatisticalRevenue />
    )
}

export default InternalPage