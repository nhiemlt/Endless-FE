import { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import constants from '../../utils/globalConstantUtil'

function ForgotPassword() {
    const INITIAL_USER_OBJ = {
        emailId: ""
    }

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [linkSent, setLinkSent] = useState(false);
    const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Kiểm tra nếu emailId rỗng
        if (userObj.emailId.trim() === "") {
            return setErrorMessage("Email là bắt buộc! (nhập giá trị bất kỳ)");
        }

        setLoading(true);
        try {
            // Gọi API để gửi link đặt lại mật khẩu
            const response = await fetch(`${constants.API_BASE_URL}/forgot-password?email=` + encodeURIComponent(userObj.emailId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Nếu phản hồi thành công, cập nhật trạng thái linkSent
                setLinkSent(true);
            } else {
                // Nếu có lỗi từ server, hiển thị thông báo lỗi
                setErrorMessage(data.error || "Đã xảy ra lỗi. Vui lòng thử lại.");
            }
        } catch (error) {
            // Xử lý lỗi kết nối
            setErrorMessage("Lỗi kết nối máy chủ. Vui lòng kiểm tra lại.");
        } finally {
            setLoading(false);
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setUserObj({ ...userObj, [updateType]: value });
    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl shadow-xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className=''>
                        <LandingIntro />
                    </div>
                    <div className='py-24 px-10'>
                        <h1 className='text-2xl text-center font-bold '>
                            <img src="logo-text-dark.png" className="w-32 inline-block mr-2" alt="endless-logo" />
                        </h1>
                        <h2 className='text-3xl font-bold mt-4 mb-2 text-center'>Quên mật khẩu</h2>

                        {
                            linkSent &&
                            <>
                                <div className='text-center mt-8'><CheckCircleIcon className='inline-block w-32 text-success' /></div>
                                <p className='my-4 text-xl font-bold text-center'>Đã gửi liên kết</p>
                                <p className='mt-4 mb-8 font-semibold text-center'>Kiểm tra email của bạn để đặt lại mật khẩu</p>
                                <div className='text-center mt-4'><Link to="/login"><button className="btn btn-block btn-primary ">Đăng nhập</button></Link></div>
                            </>
                        }

                        {
                            !linkSent &&
                            <>
                                <p className='my-8 font-semibold text-center'>Vui lòng nhập email để khôi phục tài khoản!</p>
                                <form onSubmit={(e) => submitForm(e)}>
                                    <div className="mb-4">
                                        <InputText
                                            type="email"
                                            defaultValue={userObj.emailId}
                                            updateType="emailId"
                                            containerStyle="mt-4"
                                            labelTitle="Email"
                                            updateFormValue={updateFormValue}
                                        />
                                    </div>

                                    <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                                    <button type="submit" className="btn mt-5 w-full btn-primary">
                                        <span className={loading ? 'loading loading-dots loading-lg' : ''}>
                                            {!loading ? 'Gửi liên kết' : ''}
                                        </span>
                                    </button>

                                    <div className='text-center mt-4'>
                                        Chưa có tài khoản? <Link to="/register"><button className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Đăng ký</button></Link>
                                    </div>
                                </form>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;
