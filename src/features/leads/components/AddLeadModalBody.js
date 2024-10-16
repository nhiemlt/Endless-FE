import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewLead } from "../leadSlice"

const INITIAL_LEAD_OBJ = {
    fullname: "",
    gender: false,
    birthday: "",
    phone: "",
    email: ""
}


function AddVoucherModalBody({closeModal}){

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [leadObj, setLeadObj] = useState(INITIAL_LEAD_OBJ)

    const saveNewLead = () => {
        if (leadObj.fullname.trim() === "") return setErrorMessage("Fullname is required!")
        else if (leadObj.email.trim() === "") return setErrorMessage("Email is required!")
        else if (leadObj.phone.trim() === "") return setErrorMessage("Phone number is required!")
        else {
            let newLeadObj = {
                "id": 7,
                "email": leadObj.email,
                "fullname": leadObj.fullname,
                "gender": leadObj.gender,
                "birthday": leadObj.birthday,
                "phone": leadObj.phone,
                "avatar": "https://reqres.in/img/faces/1-image.jpg" // Giữ nguyên avatar nếu cần
            }
            dispatch(addNewLead({ newLeadObj }))
            dispatch(showNotification({ message: "New Lead Added!", status: 1 }))
            closeModal()
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setLeadObj({ ...leadObj, [updateType]: value })
    }

    return (
        <>
            <InputText 
                type="text" 
                defaultValue={leadObj.fullname} 
                updateType="fullname" 
                containerStyle="mt-4" 
                labelTitle="Fullname" 
                updateFormValue={updateFormValue}
            />

            <div className="mt-4">
                <label className="label cursor-pointer">
                    <span className="label-text">Gender</span>
                    <input 
                        type="checkbox" 
                        checked={leadObj.gender} 
                        onChange={(e) => updateFormValue({ updateType: "gender", value: e.target.checked })} 
                        className="checkbox"
                    />
                </label>
            </div>

            <InputText 
                type="date" 
                defaultValue={leadObj.birthday} 
                updateType="birthday" 
                containerStyle="mt-4" 
                labelTitle="Birthday" 
                updateFormValue={updateFormValue}
            />

            <InputText 
                type="text" 
                defaultValue={leadObj.phone} 
                updateType="phone" 
                containerStyle="mt-4" 
                labelTitle="Phone" 
                updateFormValue={updateFormValue}
            />

            <InputText 
                type="email" 
                defaultValue={leadObj.email} 
                updateType="email" 
                containerStyle="mt-4" 
                labelTitle="Email" 
                updateFormValue={updateFormValue}
            />

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewLead()}>Save</button>
            </div>
        </>
    )
}

export default AddVoucherModalBody

