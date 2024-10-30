import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Purchase from '../../customers/purchase/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Purchase"}))
      }, [])


    return(
        <Purchase/>
    )
}

export default InternalPage