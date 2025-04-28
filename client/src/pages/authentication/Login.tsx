import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import * as yup from 'yup';
import ModalMFALogin from "../../components/ModalMFALogin";
import { useState, useEffect } from "react";
import { LoginUser } from "../../Model/User";
import { userLogin } from "../../store";
import { useAppDispatch } from '../../hook/use-dispatch-selector';
import Swal from "sweetalert2";

function Login() {
    const [onOpen,setOnOpen] = useState(false);
    const dispatch = useAppDispatch();
    const [userData,setUserData] = useState<LoginUser>();
    const validationSchema = yup.object().shape({
        userId: yup
            .string()
            .email('Please enter correct email.')
            .required('Email is required.'),
        password: yup
            .string()
            .min(8, 'Password must be at least 8 characters.')
            .max(20, 'Passwords can contain up to 20 characters.') // Changed 15 to 18
            .matches(
                /^(?=.*[a-zA-Z])(?=.*\d)/,
                'Password must contain at least one character and one number'
            )
            .required('Password is required.'),
    });

    const formik = useFormik({
        initialValues: {
            userId: '',
            password: '',
        },
        validationSchema: validationSchema,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit: (values) => {
            // Manually validate the form on submission
            validationSchema
              .validate(values, { abortEarly: false }) // abortEarly: false ensures that all validation errors are collected
              .then(() => {
                // Validation successful, you can proceed with form submission
                dispatch(userLogin(values)).then((result:any) => {
                    if(result.payload?.status ===  "UNAUTHORIZED"){
                     Swal.fire({
                         icon: 'error',
                         title: 'Login Failed',
                         text: `${result.payload.msg[0]}`,
                         timer: 2000,
                         timerProgressBar: true,
                         showConfirmButton: false,
                         allowOutsideClick: true,
                     });
                    }else{
                        setUserData(values);
                        setOnOpen(true);
                    }            
                 }); 
              })
              .catch((errors) => {
                // Validation failed, set the form errors
                formik.setErrors(errors.inner.reduce((acc:any, error:any) => {
                  acc[error.path] = error.message;
                  return acc;
                }, {}));
              });
          },
    });

    const handleClose = () => {
        setOnOpen(false);
    }
    const handleResetUser = () => {
        setUserData(undefined);
    }

    return ( 
        <div className="relative flex bg-gray-50 flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-5 m-auto bg-white rounded-md shadow-md lg:max-w-md">
                <h1 className="text-3xl font-semibold text-center text-red-700">
                Sign in
                </h1>
                <form onSubmit={formik.handleSubmit} className="mt-6 px-6">
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            onChange={formik.handleChange}
                            value={formik.values.userId}
                            className="block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:outline-none"
                        />
                        {formik.errors.userId ? (
                            <div className="text-red-500 text-xs">{formik.errors.userId}</div>
                        ) : null}
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            className="block w-full px-4 py-2 mt-2 bg-white border rounded-md  focus:outline-none"
                        />
                        {formik.errors.password ? (
                            <div className="text-red-500 text-xs">{formik.errors.password}</div>
                        ) : null}
                    </div>
                    <div className="mt-6">
                        <button type="submit" className="rounded-full w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-700 hover:bg-red-600 focus:outline-none focus:bg-red-600">
                            Login
                        </button>
                    </div>
                </form>
                {userData &&
                    <ModalMFALogin open={onOpen} onHide={handleClose} user={userData} setUser={handleResetUser} title="MFA Code"/>  
                }   
                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    {" "}
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-red-600 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
     );
}

export default Login;