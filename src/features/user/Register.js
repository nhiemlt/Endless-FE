import {useState} from 'react'
import {Link} from 'react-router-dom'
import LandingIntro from './LandingIntro'
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'

function Register(){

    const INITIAL_REGISTER_OBJ = {
        username: "",
        fullName: "",
        emailId: "",
        password: "",
        confirmPassword: ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ)

    const validateEmail = (email) => {
        // Kiểm tra định dạng email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    const validatePasswordStrength = (password) => {
        // Kiểm tra độ dài mật khẩu (ít nhất 6 ký tự)
        return password.length >= 6
    }

    const submitForm = (e) =>{
        e.preventDefault()
        setErrorMessage("")

        // Kiểm tra các trường nhập liệu
        if (registerObj.username.trim() === "") return setErrorMessage("Tên đăng nhập là bắt buộc!")
        if (registerObj.fullName.trim() === "") return setErrorMessage("Họ và tên là bắt buộc!")
        if (registerObj.emailId.trim() === "") return setErrorMessage("Email là bắt buộc!")
        if (!validateEmail(registerObj.emailId)) return setErrorMessage("Email không hợp lệ!")
        if (registerObj.password.trim() === "") return setErrorMessage("Mật khẩu là bắt buộc!")
        if (!validatePasswordStrength(registerObj.password)) return setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự!")
        if (registerObj.confirmPassword.trim() === "") return setErrorMessage("Vui lòng nhập lại mật khẩu!")
        if (registerObj.password !== registerObj.confirmPassword) return setErrorMessage("Mật khẩu không khớp!")

        // Gọi API để đăng ký người dùng
        setLoading(true)
        // Giả lập lưu token và chuyển hướng
        localStorage.setItem("token", "DumyTokenHere")
        setLoading(false)
        window.location.href = '/app/welcome'
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setRegisterObj({...registerObj, [updateType]: value})
    }

    return(
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl shadow-xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className=''>
                        <LandingIntro />
                    </div>
                    <div className='py-5 px-10'>
                        <h2 className='text-3xl font-bold mb-2 text-center'>Đăng ký</h2>
                        <form onSubmit={(e) => submitForm(e)}>

                            <div className="mb-4">
                                <InputText defaultValue={registerObj.username} updateType="username" containerStyle="mt-4" labelTitle="Tên đăng nhập" updateFormValue={updateFormValue} />

                                <InputText defaultValue={registerObj.fullName} updateType="fullName" containerStyle="mt-4" labelTitle="Họ và tên" updateFormValue={updateFormValue} />

                                <InputText defaultValue={registerObj.emailId} updateType="emailId" containerStyle="mt-4" labelTitle="Email" updateFormValue={updateFormValue} />

                                <InputText defaultValue={registerObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Mật khẩu" updateFormValue={updateFormValue} />

                                <InputText defaultValue={registerObj.confirmPassword} type="password" updateType="confirmPassword" containerStyle="mt-4" labelTitle="Nhập lại mật khẩu" updateFormValue={updateFormValue} />
                            </div>

                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Đăng ký</button>

                            <div className='text-center mt-4'>Đã có tài khoản? <Link to="/login"><span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Đăng nhập</span></Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
