import { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app'; // Import initializeApp từ Firebase

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

    // Sử dụng auth sau khi Firebase đã được khởi tạo
    const auth = getAuth(app);

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
            const response = await fetch("http://localhost:8080/login", {
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
                    localStorage.setItem("token", token);
                    setAlert({ type: "success", message: "Đăng nhập thành công!" });
                    window.location.href = "/app/welcome";
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
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
    
            // Lấy thông tin từ Firebase user
            const googleLoginModel = {
                googleId: user.uid,
                email: user.email,
                fullName: user.displayName,
                avatar: user.photoURL
            };
    
            // Gửi thông tin này về backend
            const response = await fetch("http://localhost:8080/login/google", {
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
                localStorage.setItem("token", data.token);
                setAlert({ type: "success", message: "Đăng nhập thành công!" });
                window.location.href = "/app/welcome";
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        } finally {
            setLoading(false);
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
                        <h2 className="text-3xl font-bold mb-2 mt-34 text-center">Đăng nhập</h2>

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

                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={loginObj.remember}
                                    onChange={(e) => updateFormValue({ updateType: "remember", value: e.target.checked })}
                                />
                                <label htmlFor="rememberMe" className="ml-2">Nhớ đăng nhập</label>
                            </div>

                            <button type="submit" className={`btn mt-2 w-full btn-primary${loading ? " loading" : ""}`}>Đăng nhập</button>

                            <div className="mt-4 text-center">
                                <button type="button" onClick={handleGoogleLogin} className="btn btn-outline">
                                    Đăng nhập bằng Google
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
