import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LandingIntro from './LandingIntro'
import InputText from '../../components/Input/InputText'
import axios from 'axios'
import constants from '../../utils/globalConstantUtil'

function Register() {
    const INITIAL_REGISTER_OBJ = {
        username: "",
        emailId: "",
        password: "",
        confirmPassword: ""
    }

    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({ type: "", message: "" })
    const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ)
    const navigate = useNavigate()

    const submitForm = async (e) => {
        e.preventDefault()
        setAlert({ type: "", message: "" })

        // Kiểm tra tính hợp lệ của form bằng HTML5
        if (!e.target.checkValidity()) {
            return // Ngừng nếu form không hợp lệ
        }

        setLoading(true)

        try {
            const response = await axios.post(`${constants.API_BASE_URL}/register`, {
                username: registerObj.username,
                email: registerObj.emailId,
                password: registerObj.password,
            })

            // Nếu đăng ký thành công
            if (response.data.success) {
                setAlert({ type: "success", message: "Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản." })
                setRegisterObj(INITIAL_REGISTER_OBJ) // Xóa dữ liệu form sau khi đăng ký thành công
                setTimeout(() => {
                    setAlert({ type: "", message: "" })
                    navigate('/login') // Chuyển hướng đến trang đăng nhập sau 3 giây
                }, 3000)
            }
        } catch (error) {
            if (error.response) {
                setAlert({ type: "error", message: "Đã xảy ra lỗi trong quá trình đăng ký." })
                console.log(error.response.message)
            } else {
                setAlert({ type: "error", message: "Không thể kết nối với máy chủ. Vui lòng thử lại sau." })
            }
        } finally {
            setLoading(false)
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setAlert({ type: "", message: "" })
        setRegisterObj({ ...registerObj, [updateType]: value })
    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl shadow-xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className="">
                        <LandingIntro />
                    </div>
                    <div className="py-2 px-10">
                        <h1 className="text-2xl text-center font-bold ">
                            <img src="logo-text-dark.png" className="w-20 inline-block mr-2" alt="endless-logo" />
                        </h1>
                        <h2 className="text-3xl font-bold text-center">Đăng ký</h2>

                        {alert.message && (
                            <div role="alert" className={`alert alert-${alert.type}`}>
                                <span>{alert.message}</span>
                            </div>
                        )}

                        <form onSubmit={submitForm} noValidate>
                            <InputText
                                defaultValue={registerObj.username}
                                updateType="username"
                                containerStyle="mt-2"
                                labelTitle="Tên đăng nhập"
                                updateFormValue={updateFormValue}
                                required
                                minLength={5} // Đặt quy tắc cho tên đăng nhập
                            />

                            <InputText
                                defaultValue={registerObj.emailId}
                                updateType="emailId"
                                containerStyle="mt-2"
                                labelTitle="Email"
                                updateFormValue={updateFormValue}
                                type="email" // Sử dụng type email để kích hoạt kiểm tra HTML5
                                required
                            />

                            <InputText
                                defaultValue={registerObj.password}
                                type="password"
                                updateType="password"
                                containerStyle="mt-2"
                                labelTitle="Mật khẩu"
                                updateFormValue={updateFormValue}
                                required
                                minLength={8} // Đặt quy tắc cho mật khẩu
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" // Quy tắc mạnh cho mật khẩu
                            />

                            <InputText
                                defaultValue={registerObj.confirmPassword}
                                type="password"
                                updateType="confirmPassword"
                                containerStyle="mt-4"
                                labelTitle="Nhập lại mật khẩu"
                                updateFormValue={updateFormValue}
                                required
                            />

                            <button type="submit" className="btn mt-5 w-full btn-primary">
                                <span className={loading ? 'loading loading-dots loading-lg' : ''}>
                                    {!loading ? 'Đăng ký' : ''}
                                </span>
                            </button>


                            <div className='text-center mt-2'>Đã có tài khoản? <Link to="/login"><span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Đăng nhập</span></Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
