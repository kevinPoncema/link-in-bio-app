import React, { useState } from 'react';
import { Mail, Lock, User, CheckCircle, XCircle, Facebook, Twitter, Chrome, Loader2, Eye, EyeOff } from 'lucide-react';

// --- MOCK API CALL (To make the component runnable without external dependencies) ---
// Since the original code depended on an external 'AuthRequest', we mock it here.
const AuthRequest = {
  login: (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'test@dark.com' && credentials.password === '12345') {
          resolve({ token: 'mock-token-login' });
        } else {
          reject(new Error('Credenciales inválidas.'));
        }
      }, 1500);
    });
  },
  register: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email.includes('fail')) {
          reject(new Error('Este email ya está en uso.'));
        } else {
          resolve({ user: { name: data.name, email: data.email } });
        }
      }, 1500);
    });
  },
};
// ---------------------------------------------------------------------------------

// Tailwind CSS classes for the primary gradient (Red/Orange) used on buttons
const gradientPrimary = 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600';
const gradientActive = 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-lg shadow-yellow-500/30';
const gradientInactive = 'bg-gray-700 text-gray-400 hover:bg-gray-600';

// Componente externo para manejar la lógica de botones sociales y acceso al estado de error
// MOVIDO FUERA de App para evitar re-renders innecesarios.
const SocialButton = ({ icon: Icon, color, setError }) => (
  <button
    className={`p-3 rounded-full shadow-lg ${gradientPrimary} transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-800 focus:ring-orange-500`}
    aria-label={`Login con ${color}`}
    // Muestra un mensaje de error no bloqueante en lugar de usar alert()
    onClick={() => setError(`El login con ${color} no está implementado en esta demostración.`)}
  >
    <Icon className="w-5 h-5 text-white" />
  </button>
);

// Componente de campo de entrada que incluye el botón de mostrar/ocultar contraseña
// MOVIDO FUERA de App para evitar re-renders innecesarios y la pérdida de foco.
const InputField = ({ id, name, type, value, placeholder, required, icon: Icon, label, autoComplete = 'off', handleInputChange, showPassword, setShowPassword }) => {
    const isPassword = name.includes('password');
    // Determina el tipo de input: 'text' si se debe mostrar, o 'password'/'email'/'text' según el prop original
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="relative">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
        <div className="flex items-center">
          {/* Ícono de campo */}
          <Icon className="absolute left-3 w-5 h-5 text-orange-400 z-10" />
          <input
            id={id}
            name={name}
            type={inputType} 
            required={required}
            value={value}
            onChange={handleInputChange} // Uso la función pasada por props
            autoComplete={autoComplete}
            // Agrega padding a la derecha (pr-12) para hacer espacio para el botón de "ojo"
            className="appearance-none relative block w-full pl-10 pr-12 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-inner shadow-black/20"
            placeholder={placeholder}
          />
          {/* Botón de alternancia de contraseña, visible solo para campos de contraseña */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1 rounded-full text-gray-400 hover:text-white transition-colors z-20"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    );
};


function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Función de manejo de cambio de input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ // Esto sigue disparando el re-render de App, pero no reconstruye InputField
      ...formData,
      [name]: value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await AuthRequest.login({
          email: formData.email,
          password: formData.password,
        });
        setSuccess('¡Inicio de sesión exitoso!');
      } else {
        if (formData.password !== formData.password_confirmation) {
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }
        const response = await AuthRequest.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        });
        setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
        
        // Cambiar a modo login después del registro
        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            name: '',
            email: formData.email,
            password: '',
            password_confirmation: '',
          });
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700">
        
        {/* Toggle Buttons */}
        <div className="flex justify-center p-1 rounded-full bg-gray-700 shadow-inner">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 text-sm font-semibold py-2 px-4 rounded-full transition-all ${
              isLogin ? gradientActive : gradientInactive
            }`}
          >
            Log in
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 text-sm font-semibold py-2 px-4 rounded-full transition-all ${
              !isLogin ? gradientActive : gradientInactive
            }`}
          >
            Register
          </button>
        </div>

        {/* Botones de inicio de sesión social (Facebook, Twitter, Google) */}
        {/* Estos botones simulan el acceso rápido utilizando credenciales de terceros. 
            Al hacer clic, usan la función setError para mostrar un mensaje informativo no bloqueante. */}
        <div className="flex justify-center space-x-4 pt-4">
          <SocialButton icon={Facebook} color="Facebook" setError={setError} />
          <SocialButton icon={Twitter} color="Twitter" setError={setError} />
          <SocialButton icon={Chrome} color="Google" setError={setError} />
        </div>
        
        <div className="border-t border-gray-700 pt-4"></div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Form Fields */}
          <div className="space-y-5">
            {/* Name field - only for register */}
            {!isLogin && (
              <InputField
                id="name"
                name="name"
                type="text"
                required={!isLogin}
                value={formData.name}
                label="Nombre completo"
                placeholder="Ingresa tu nombre"
                icon={User}
                autoComplete='name'
                handleInputChange={handleInputChange} // Pasar la función de manejo de cambios
              />
            )}

            {/* Email field */}
            <InputField
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              label="Email"
              placeholder="ejemplo@correo.com"
              icon={Mail}
              autoComplete='email'
              handleInputChange={handleInputChange} // Pasar la función de manejo de cambios
            />

            {/* Password field */}
            <InputField
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              label="Contraseña"
              placeholder="••••••••"
              icon={Lock}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              handleInputChange={handleInputChange} // Pasar la función de manejo de cambios
              showPassword={showPassword}           // Pasar estado de contraseña
              setShowPassword={setShowPassword}     // Pasar función para cambiar estado
            />

            {/* Password confirmation - only for register */}
            {!isLogin && (
              <InputField
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required={!isLogin}
                value={formData.password_confirmation}
                label="Confirmar contraseña"
                placeholder="••••••••"
                icon={Lock}
                autoComplete='new-password'
                handleInputChange={handleInputChange} // Pasar la función de manejo de cambios
                showPassword={showPassword}           // Pasar estado de contraseña
                setShowPassword={setShowPassword}     // Pasar función para cambiar estado
              />
            )}
            
            {/* Remember Me / Terms (Only for Login/Register) */}
            <div className="flex justify-between items-center text-sm text-gray-400">
                {isLogin ? (
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-orange-500 border-gray-600 rounded bg-gray-700 focus:ring-orange-500"
                        />
                        <label htmlFor="remember-me" className="ml-2 block">
                            Recordar mi sesión
                        </label>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <input
                            id="terms-and-conditions"
                            name="terms-and-conditions"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-orange-500 border-gray-600 rounded bg-gray-700 focus:ring-orange-500"
                        />
                        <label htmlFor="terms-and-conditions" className="ml-2 block">
                            Acepto los <a href="#" className="font-medium text-orange-400 hover:text-orange-300">términos</a>
                        </label>
                    </div>
                )}
            </div>

          </div>

          {/* Messages */}
          {error && (
            <div className="flex items-center space-x-2 bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm shadow-md">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm shadow-md">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-extrabold rounded-xl text-white ${gradientPrimary} focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider`}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Procesando...
                </span>
              ) : (
                <span>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;