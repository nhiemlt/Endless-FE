import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import InputText from '../../components/Input/InputText';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import constants from '../../utils/globalConstantUtil';

// Cấu hình Firebase của bạn
const firebaseConfig = {
    apiKey: "AIzaSyBpIeLo-y2e5YLfPTFrY51gBKyqwX3v7DY",
    authDomain: "endlesstechstoreecommerce.firebaseapp.com",
    projectId: "endlesstechstoreecommerce",
    storageBucket: "endlesstechstoreecommerce.appspot.com",
    messagingSenderId: "698894677458",
    appId: "1:698894677458:web:2d9ef0bf1dcc74efedc40b"
};

// Khởi tạo Firebase App nếu chưa khởi tạo
const app = initializeApp(firebaseConfig);

function Login() {
    const INITIAL_LOGIN_OBJ = {
        password: "",
        emailId: "",
        remember: false,
    };

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
    const navigate = useNavigate();

    // Sử dụng auth sau khi Firebase đã được khởi tạo
    const auth = getAuth(app);

    // Kiểm tra token khi component mount
    useEffect(() => {
        const token = getCookie("token");
        if (token) {
            fetch(`${constants.API_BASE_URL}/verify-auth-token?token=${token}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then(response => {
                    if (response.ok) {
                        setTimeout(() => {
                            navigate("/app/welcome");
                            window.location.reload();
                        }, 500); // Chờ 1 giây trước khi navigate
                    } else {
                        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    }
                })
                .catch(error => {
                    console.error("Error verifying token:", error);
                });
        }
    }, [navigate]);


    // Hàm lấy cookie
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setAlert({ type: "", message: "" });

        if (loginObj.emailId.trim() === "") {
            return setAlert({ type: "error", message: "Email không được bỏ trống!" });
        }
        if (loginObj.password.trim() === "") {
            return setAlert({ type: "error", message: "Mật khẩu không được bỏ trống!" });
        }

        setLoading(true);

        try {
            const response = await fetch(`${constants.API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: loginObj.emailId,
                    password: loginObj.password,
                    remember: loginObj.remember,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setAlert({ type: "error", message: data.error || "Đăng nhập thất bại!" });
            } else {
                const token = data.token;
                if (token) {
                    const expires = new Date();
                    if (loginObj.remember) {
                        expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); // 1 ngày
                    } else {
                        expires.setTime(expires.getTime() + 30 * 60 * 1000); // 30 phút
                    }
                    document.cookie = `token=${token}; path=/; expires=${expires.toUTCString()};`;
                    setAlert({ type: "success", message: "Đăng nhập thành công!" });
                    if (data.role) {
                        setTimeout(() => {
                            navigate("/app/welcome");
                            window.location.reload();
                        }, 50);
                    }
                    else {
                        setTimeout(() => {
                            navigate("/home");
                            window.location.reload();
                        }, 50);
                    }
                } else {
                    setAlert({ type: "error", message: "Token không hợp lệ!" });
                }
            }
        } catch (error) {
            setAlert({ type: "error", message: "Đã có lỗi xảy ra khi kết nối tới server." });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const googleLoginModel = {
                googleId: user.uid,
                email: user.email,
                fullName: user.displayName,
                avatar: user.photoURL
            };

            const response = await fetch(`${constants.API_BASE_URL}/login/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(googleLoginModel),
            });

            const data = await response.json();
            if (!response.ok) {
                setAlert({ type: "error", message: data.error || "Đăng nhập bằng Google thất bại!" });
            } else {
                const expires = new Date();
                expires.setTime(expires.getTime() + 6 * 60 * 60 * 1000);
                document.cookie = `token=${data.token}; path=/; expires=${expires.toUTCString()};`;
                setAlert({ type: "success", message: "Đăng nhập thành công!" });
                if (data.role) {
                    setTimeout(() => {
                        navigate("/app/welcome");
                        window.location.reload();
                    }, 50);
                }
                else {
                    setTimeout(() => {
                        navigate("/home");
                        window.location.reload();
                    }, 50);
                }
                window.location.reload();
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        setAlert({ type: "", message: "" });
        setLoginObj({ ...loginObj, [updateType]: value });
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl shadow-xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className="">
                        <LandingIntro />
                    </div>
                    <div className="py-24 px-10">
                        <h2 className="text-3xl font-bold mb-2 mt-34 text-center">Đăng nhập </h2>

                        {alert.message && (
                            <div role="alert" className={`alert alert-${alert.type}`}>
                                <span>{alert.message}</span>
                            </div>
                        )}

                        <form onSubmit={(e) => submitForm(e)}>
                            <InputText
                                type="emailId"
                                defaultValue={loginObj.emailId}
                                updateType="emailId"
                                containerStyle="mt-4"
                                labelTitle="Email"
                                updateFormValue={updateFormValue}
                            />

                            <InputText
                                defaultValue={loginObj.password}
                                type="password"
                                updateType="password"
                                containerStyle="mt-4"
                                labelTitle="Mật khẩu"
                                updateFormValue={updateFormValue}
                            />

                            <div className="flex items-center mt-3 mb-2 justify-between">
                                <div>
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={loginObj.remember}
                                        onChange={(e) => updateFormValue({ updateType: "remember", value: e.target.checked })}
                                    />
                                    <label htmlFor="rememberMe" className="ml-2">Nhớ đăng nhập</label>
                                </div>

                                <div>
                                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div>

                            <button type="submit" className="btn mt-5 w-full btn-primary">
                                <span className={loading ? 'loading loading-dots loading-lg' : ''}>
                                    {!loading ? 'Đăng nhập' : ''}
                                </span>
                            </button>

                            <div className="mt-4 flex items-center justify-center">
                                <div className="border-t border-gray-300 w-full"></div>
                                <span className="px-3 text-gray-500">Hoặc</span>
                                <div className="border-t border-gray-300 w-full"></div>
                            </div>

                            <div className="mt-4 text-center">
                                <button type="button" onClick={handleGoogleLogin} className="btn btn-outline w-full flex items-center justify-center gap-2">
                                    <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google" className="w-5 h-5" />
                                    Đăng nhập bằng Google
                                </button>
                            </div>

                            <div className="text-center mt-4">
                                Chưa có tài khoản? <Link to="/register"><span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Đăng ký</span></Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
