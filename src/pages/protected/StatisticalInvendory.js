import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import StatisticalInvendory from '../../features/statistical-invendory/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Thống kê kho"}))
      }, [])


    return(
        <StatisticalInvendory />
    )
}

export default InternalPage