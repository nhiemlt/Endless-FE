import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewVoucher } from "../voucherSlice"

const INITIAL_VOUCHER_OBJ = {
    voucherID: "",
    voucherCode: "",
    leastBill: "",
    leastDiscount: "",
    biggestDiscount: "",
    discountLevel: "",
    discountForm: "",
    startDate: "",
    endDate: ""
}

function AddVoucherModalBody({ closeModal }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [voucherObj, setVoucherObj] = useState(INITIAL_VOUCHER_OBJ)

    const saveNewVoucher = () => {
        // Kiểm tra các trường bắt buộc
        if (voucherObj.voucherCode.trim() === "") return setErrorMessage("Voucher Code is required!");
        if (voucherObj.leastBill.trim() === "") return setErrorMessage("Least Bill is required!");
        if (voucherObj.startDate.trim() === "") return setErrorMessage("Start Date is required!");
        if (voucherObj.endDate.trim() === "") return setErrorMessage("End Date is required!");

        // Tạo voucher mới với ID tự động
        let newVoucherObj = {
            "voucherID": new Date().getTime(), // Tạo ID tự động
            "voucherCode": voucherObj.voucherCode,
            "leastBill": voucherObj.leastBill,
            "leastDiscount": voucherObj.leastDiscount || 0, // Mặc định nếu trống
            "biggestDiscount": voucherObj.biggestDiscount || 0,
            "discountLevel": voucherObj.discountLevel || 0,
            "discountForm": voucherObj.discountForm || "Percentage", // Mặc định "Percentage"
            "startDate": voucherObj.startDate,
            "endDate": voucherObj.endDate
        };

        // Dispatch action để thêm voucher mới
        dispatch(addNewVoucher({ newVoucherObj }));
        dispatch(showNotification({ message: "New Voucher Added!", status: 1 }));
        closeModal();
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("") // Xóa thông báo lỗi
        setVoucherObj({ ...voucherObj, [updateType]: value }) // Cập nhật giá trị của voucher
    }


    return (
        <>
            {/* Các trường nhập liệu cho voucher */}
            <div className="flex">
                <div className="w-1/2 pr-2">
                    <InputText
                        type="text"
                        defaultValue={voucherObj.voucherCode}
                        updateType="voucherCode"
                        containerStyle="mt-4"
                        labelTitle="Mã voucher:"
                        placeholder={"Nhập voucher code"}
                        updateFormValue={updateFormValue}
                    />
                    <InputText
                        type="number"
                        defaultValue={voucherObj.leastBill}
                        updateType="leastBill"
                        containerStyle="mt-4"
                        labelTitle="Giá giảm tối thiểu:"
                        placeholder={"Nhập giá giảm tối thiểu"}
                        updateFormValue={updateFormValue}
                    />
                    <InputText
                        type="number"
                        defaultValue={voucherObj.leastDiscount}
                        updateType="leastDiscount"
                        containerStyle="mt-4"
                        labelTitle="Mức giảm giá:"
                        placeholder={"Nhập mức giảm giá"}
                        updateFormValue={updateFormValue}
                    />
                    <InputText
                        type="date"
                        defaultValue={voucherObj.startDate}
                        updateType="startDate"
                        containerStyle="mt-4"
                        labelTitle="Ngày bắt đầu:"
                        updateFormValue={updateFormValue}
                    />
                </div>
                <div className="w-1/2 pl-2">
                    <InputText
                        type="number"
                        defaultValue={voucherObj.discountLevel}
                        updateType="discountLevel"
                        containerStyle="mt-4"
                        labelTitle="Hóa đơn tối thiểu:"
                        placeholder={"Nhập hóa đơn tối thiểu"}
                        updateFormValue={updateFormValue}
                    />
                    <InputText
                        type="number"
                        defaultValue={voucherObj.biggestDiscount}
                        updateType="biggestDiscount"
                        containerStyle="mt-4"
                        labelTitle="Giá giảm tối đa:"
                        placeholder={"Nhập giá giảm tối đa"}
                        updateFormValue={updateFormValue}
                    />
                    <InputText
                        type="text"
                        defaultValue={voucherObj.discountForm}
                        updateType="discountForm"
                        containerStyle="mt-4"
                        labelTitle="Hình thức giá giảm:"
                        placeholder={"Nhập hình thức giảm giá "}
                        updateFormValue={updateFormValue}
                    />
                    <InputText
                        type="date"
                        defaultValue={voucherObj.endDate}
                        updateType="endDate"
                        containerStyle="mt-4"
                        labelTitle="Ngày kết thúc:"
                        updateFormValue={updateFormValue}
                    />
                </div>
            </div>
            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-sm btn-outline btn-dark btn-ghost" onClick={() => closeModal()}>Hủy</button>
                <button className="btn btn-sm btn-outline btn-success px-6" onClick={() => saveNewVoucher()}>Thêm</button>
            </div>
        </>
    )
}

export default AddVoucherModalBody