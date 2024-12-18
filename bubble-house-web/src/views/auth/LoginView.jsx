import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, cleanAlert, authMe } from '@/redux/thunks/userThunks';
import { SweetAlertError, SweetAlertSuccess } from "@/assets/js/sweetAlert";

export default function LoginView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: 'jbautista.dormo.corea@gmail.com', password: 'jbdc1234' } });
  const [showPassword, setShowPassword] = useState(false);

  const { errorRedux, loading, message, token } = useSelector((state) => state.user);

  const handleLogin = (formData) => {

    dispatch(loginUser(formData));

  };

  useEffect(() => {
    if (message === "Inicio de sesión exitoso!" && token) {
      navigate('/orders');
      SweetAlertSuccess("Inicio de sesión exitosa");
      dispatch(authMe(token));
      dispatch(cleanAlert());
    }

    if (errorRedux) {
      SweetAlertError(errorRedux);
      dispatch(cleanAlert());
    }
  }, [errorRedux, message, navigate, dispatch, token]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 bg-white shadow-lg rounded-lg"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div className="flex flex-col gap-5 relative">
          <label className="font-normal text-2xl">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          <Tooltip title={showPassword ? "Ocultar" : "Mostrar"} placement='top'>
            <button
              type="button"
              className="absolute right-3 flex items-center justify-center"
              style={{ marginTop: "4.2rem" }}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </Tooltip>
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </div>

        <button
          type="submit"
          className={`flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full border-2 border-t-2 border-t-transparent border-white w-5 h-5"></span>
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>

      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to={'/auth/register'}
          className="text-center text-fuchsia-500 font-normal"
        >
          ¿No tienes una cuenta? {''}
          <span className="font-black">Crear cuenta</span>
        </Link>
      </nav>
    </>
  );
}
