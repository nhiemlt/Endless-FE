import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ChangePassword from '../../features/settings/billing/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Thay đổi mật khẩu"}))
      }, [])


    return(
        <ChangePassword />
    )
}

export default InternalPage