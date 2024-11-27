import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Attribute from '../../features/attribute/index'

function InternalPage() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title: "Thuộc tính" }))
    }, [])


    return (
        <Attribute />
    )
}

export default InternalPage