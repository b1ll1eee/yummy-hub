import { useState } from "react";
import { useFormik } from 'formik';
import ModalMFARegister from "../../components/ModalMFARegister";
import { useRegisterMutation } from "../../store";
import * as yup from 'yup';
import Swal from "sweetalert2";
import CircularProgress from '@mui/material/CircularProgress';

function Register() {
    const [ registerCheck ] = useRegisterMutation();
    const [onOpen,setOnOpen] = useState(false);
    const [userData,setUserData] = useState<any>([]);
    const [spin,setSpin] = useState(false);

    const validationSchema = yup.object().shape({
        userId: yup
            .string()
            .email('Please enter correct email.')
            .required('Email is required.'),
        firstname: yup
            .string()
            .min(3,'Firstname must be at least 3 characters.')
            .max(20,'Firstname can contain up to 18 characters.')
            .required('Firstname is require'),
        lastname: yup
            .string()
            .min(3,'Lastname must be at least 3 characters.')
            .max(20,'Lastname can contain up to 20 characters.')
            .required('Lastname is require'),
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
            firstname:'',
            lastname:'',
            password: '',
        },
        validationSchema: validationSchema,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit: (values) => {
            // Manually validate the form on submission
            validationSchema
              .validate(values, { abortEarly: false }) // abortEarly: false ensures that all validation errors are collected
              .then( async () => {
                if (acceptedPrivacyPolicy) {
                    setSpin(true);
                    await registerCheck(values).then((res:any)=>{
                        if(res?.data.status === "BAD_REQUEST"){
                            Swal.fire({
                                icon: 'error',
                                title: 'Register Failed',
                                text: `${res.data.msg[0]}`,
                                timer: 2000,
                                timerProgressBar: true,
                                showConfirmButton: false,
                                allowOutsideClick: true,
                            });
                        }else{
                            setUserData(values);
                            setOnOpen(!onOpen);
                        }
                    })
                    setSpin(false);
                  } else {
                    alert('Please accept both terms & conditions and privacy policy to register.');
                  }
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

    const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);

    const togglePrivacyPolicyAcceptance = () => {
        setAcceptedPrivacyPolicy(!acceptedPrivacyPolicy);
      };

    return ( 
        <div className="relative flex bg-gray-50 flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-5 m-auto bg-white rounded-md shadow-md lg:max-w-md">
                <h1 className="text-3xl font-semibold text-center text-red-700">
                Register
                </h1>
                <form className="mt-6 px-6" onSubmit={formik.handleSubmit}>
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
                            disabled={spin}
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
                            First Name
                        </label>
                        <input
                            id="firstname"
                            name="firstname"
                            onChange={formik.handleChange}
                            value={formik.values.firstname}
                            type="text"
                            disabled={spin}
                            className="block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:outline-none"
                        />
                        {formik.errors.firstname ? (
                            <div className="text-red-500 text-xs">{formik.errors.firstname}</div>
                        ) : null}
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Last Name
                        </label>
                        <input
                            disabled={spin}
                            type="text"
                            id="lastname"
                            name="lastname"
                            onChange={formik.handleChange}
                            value={formik.values.lastname}
                            className="block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:outline-none"
                        />
                        {formik.errors.lastname ? (
                            <div className="text-red-500 text-xs">{formik.errors.lastname}</div>
                        ) : null}
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Password
                        </label>
                        <input
                            disabled={spin}
                            type="password"
                            id="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            className="block w-full px-4 py-2 mt-2 bg-white border rounded-md  focus:outline-none"
                        />
                    </div>
                    {formik.errors.password ? (
                        <div className="text-red-500 text-xs mb-3">{formik.errors.password}</div>
                    ) : null}
                    <div className="mb-4">
                        <label className="flex items-center">
                        <input
                            disabled={spin}
                            type="checkbox"
                            className="mr-3"
                            checked={acceptedPrivacyPolicy}
                            onChange={togglePrivacyPolicyAcceptance}
                        />
                        I accept the Privacy Policy
                        </label>
                    </div>
                    <div className="my-6">
                        {!acceptedPrivacyPolicy && !spin && (
                            <button 
                                type="submit" 
                                className="rounded-full w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-300"
                                disabled={spin}
                            >
                                Register
                            </button>
                        )}
                        {acceptedPrivacyPolicy && !spin && (
                            <button 
                                disabled={spin}
                                type="submit" 
                                className="rounded-full w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-700 hover:bg-red-600 focus:outline-none focus:bg-red-600"
                            >
                                Register
                            </button>
                        )}
                        {acceptedPrivacyPolicy && spin && (
                            <button 
                                type="submit" 
                                className="rounded-full w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-300 flex justify-center items-center"
                                disabled={spin}
                            >
                                <CircularProgress size={25}  thickness={5}/>
                            </button>
                        )}
                    </div>
                </form>
                <ModalMFARegister setUser={setUserData} open={onOpen} setOpen={setOnOpen} user={userData} title="MFA Code"/>
            </div>
        </div>
     );
}

export default Register;