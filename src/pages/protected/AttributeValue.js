import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AttributeValue from '../../features/attributeValue/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Giá trị thuộc tính"}))
      }, [])


    return(
        <AttributeValue />
    )
}

export default InternalPage