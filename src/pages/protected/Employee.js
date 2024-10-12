import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Employee from '../../features/employee/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Nhân viên"}))
      }, [])


    return(
        <Employee />
    )
}

export default InternalPage