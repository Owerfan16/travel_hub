"use client";
import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const AuthForm = () => {
  // false – показываем форму "Войти", true – "Создать аккаунт"
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter();

  // Form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Error states
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // Loading states
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  // Redirect if already authenticated - moved to useEffect
  useEffect(() => {
    if (isAuthenticated && typeof window !== "undefined") {
      if (window.innerWidth < 1024) {
        // For mobile, redirect to profile
        router.push("/profile");
      }
      // For desktop, stay on current page (Profile_pc component will be activated)
    }
  }, [isAuthenticated, router]);

  // Handle login form submission
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoginLoading(true);

    try {
      await login(loginEmail, loginPassword);
      // Redirect handled in auth context
    } catch (error) {
      setLoginError("Неверный email или пароль");
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Handle registration form submission
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setIsRegisterLoading(true);

    try {
      await register(registerName, registerEmail, registerPassword);
      // Redirect handled in auth context
    } catch (error) {
      setRegisterError("Ошибка при регистрации. Пожалуйста, проверьте данные.");
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <div className="h-[1175px] lg:h-[920px]">
      {/* Desktop версия (md и больше) */}
      <div className="hidden md:flex justify-center py-[36px] px-[24px] sm:px-6 md:px-[60px]">
        <div
          className={`relative rounded-[30px] w-full mb-40 max-w-4xl min-h-[600px] overflow-hidden ${
            isRightPanelActive ? "right-panel-active" : ""
          }`}
        >
          {/* Sign Up Form */}
          <div
            className={`md:absolute md:top-0 md:h-full md:w-1/2 md:left-0 transition-transform duration-600 ease-in-out ${
              isRightPanelActive
                ? "md:translate-x-full md:opacity-100 md:z-50"
                : "md:opacity-0 md:z-10"
            }`}
          >
            <form
              className="bg-[var(--color--auth-left)] h-full flex flex-col items-center justify-center px-8 py-10 md:px-16 md:py-0"
              onSubmit={handleRegister}
            >
              <h1 className="font-medium text-2xl md:text-3xl mb-6">
                Создать аккаунт
              </h1>
              <div className="flex gap-4 my-5">
                <a
                  href="#"
                  className="rounded-full h-10 w-10 flex items-center justify-center"
                >
                  <Image
                    src="/images/google_auth.svg"
                    alt="Google"
                    width={40}
                    height={40}
                  />
                </a>
                <a
                  href="#"
                  className="rounded-full h-10 w-10 flex items-center justify-center"
                >
                  <Image
                    src="/images/vk_auth.svg"
                    alt="vk"
                    width={40}
                    height={40}
                  />
                </a>
                <a
                  href="#"
                  className="rounded-full h-10 w-10 flex items-center justify-center"
                >
                  <Image
                    src="/images/tg_auth.svg"
                    alt="tg"
                    width={40}
                    height={40}
                  />
                </a>
              </div>
              <span className="text-sm my-5">
                или используйте свой email для регистрации
              </span>
              {registerError && (
                <div className="text-red-500 text-sm mb-2 w-full text-center">
                  {registerError}
                </div>
              )}
              <input
                type="text"
                placeholder="Имя"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
                className="bg-[var(--color--input)] border-none py-3 px-4 rounded-[16px] my-2 w-full"
              />
              <input
                type="email"
                placeholder="Электронная почта"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                className="bg-[var(--color--input)] border-none py-3 rounded-[16px] px-4 my-2 w-full"
              />
              <input
                type="password"
                placeholder="Пароль"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                className="bg-[var(--color--input)] border-none py-3 rounded-[16px] px-4 my-2 w-full"
              />
              <button
                type="submit"
                disabled={isRegisterLoading}
                className="rounded-2xl w-full display-flex justify-center items-center border border-[var(--color--input-button)] bg-[var(--color--input-button)] text-white text-xs font-medium py-3 uppercase tracking-wider mt-4 transition-transform duration-80 ease-in"
              >
                {isRegisterLoading ? "Загрузка..." : "Зарегистрироваться"}
              </button>
            </form>
          </div>

          {/* Sign In Form */}
          <div
            className={`md:absolute md:top-0 md:h-full md:w-1/2 md:left-0 transition-transform duration-600 ease-in-out z-20 ${
              isRightPanelActive ? "md:translate-x-full" : ""
            }`}
          >
            <form
              className="bg-[var(--color--auth-left)] h-full flex flex-col items-center justify-center px-8 py-10 md:px-16 md:py-0"
              onSubmit={handleLogin}
            >
              <h1 className="font-medium text-2xl md:text-3xl mb-6">Войти</h1>
              <div className="flex gap-4 my-5">
                <a
                  href="#"
                  className="rounded-full h-10 w-10 flex items-center justify-center"
                >
                  <Image
                    src="/images/google_auth.svg"
                    alt="Google"
                    width={40}
                    height={40}
                  />
                </a>
                <a
                  href="#"
                  className="rounded-full h-10 w-10 flex items-center justify-center"
                >
                  <Image
                    src="/images/vk_auth.svg"
                    alt="vk"
                    width={40}
                    height={40}
                  />
                </a>
                <a
                  href="#"
                  className="rounded-full h-10 w-10 flex items-center justify-center"
                >
                  <Image
                    src="/images/tg_auth.svg"
                    alt="tg"
                    width={40}
                    height={40}
                  />
                </a>
              </div>
              <span className="text-sm my-5">или используйте свой аккаунт</span>
              {loginError && (
                <div className="text-red-500 text-sm mb-2 w-full text-center">
                  {loginError}
                </div>
              )}
              <input
                type="email"
                placeholder="Электронная почта"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="bg-[var(--color--input)] border-none rounded-[16px] py-3 px-4 my-2 w-full"
              />
              <input
                type="password"
                placeholder="Пароль"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="bg-[var(--color--input)] border-none rounded-[16px] py-3 px-4 my-2 w-full"
              />
              <a href="#" className="text-gray-500 text-sm my-3">
                Забыли пароль?
              </a>
              <button
                type="submit"
                disabled={isLoginLoading}
                className="rounded-2xl w-full border border-[var(--color--input-button)] bg-[var(--color--input-button)] text-white text-xs font-medium py-3 px-12 uppercase tracking-wider mt-4 transition-transform duration-80 ease-in"
              >
                {isLoginLoading ? "Загрузка..." : "Войти"}
              </button>
            </form>
          </div>

          {/* Overlay Container */}
          <div
            className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out ${
              isRightPanelActive ? "-translate-x-full" : ""
            }`}
          >
            <div
              className={`relative left-[-100%] h-full w-[200%] bg-[var(--color-footer-background)] text-white transition-transform duration-600 ease-in-out ${
                isRightPanelActive ? "translate-x-1/2" : "translate-x-0"
              }`}
            >
              {/* Overlay Left */}
              <div
                className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-16 py-0 text-center transition-transform duration-600 ease-in-out ${
                  isRightPanelActive ? "translate-x-0" : "-translate-x-[20%]"
                }`}
              >
                <h1 className="text-3xl font-medium mb-6">Добро пожаловать!</h1>
                <p className="text-sm leading-5 my-5">
                  Пожалуйста, войдите в свой аккаунт
                </p>
                <button
                  type="button"
                  onClick={() => setIsRightPanelActive(false)}
                  className="ghost rounded-2xl border border-white bg-transparent lg:w-[245px] text-white text-xs font-medium py-3 px-12 uppercase tracking-wider mt-4"
                >
                  Войти
                </button>
              </div>

              {/* Overlay Right */}
              <div
                className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-16 py-0 text-center transition-transform duration-600 ease-in-out ${
                  isRightPanelActive ? "translate-x-[20%]" : "translate-x-0"
                }`}
              >
                <h1 className="text-3xl font-medium mb-6">Привет!</h1>
                <p className="text-sm leading-5 my-5">
                  Введите свои персональные данные и начните путешествие с нами
                </p>
                <button
                  type="button"
                  onClick={() => setIsRightPanelActive(true)}
                  className="display-flex justify-center items-center ghost rounded-2xl border border-white bg-transparent text-white text-xs font-medium py-3 px-12 uppercase tracking-wider mt-4"
                >
                  Зарегистрироваться
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile версия (до md) с переключателем */}
      <div className="md:hidden flex flex-col items-center py-8 px-4">
        {/* Переключатель-вкладок */}
        <div className="flex mb-6 relative">
          <button
            type="button"
            onClick={() => setIsRightPanelActive(false)}
            className="relative mr-4 px-4 py-2"
          >
            <span
              className={`${
                !isRightPanelActive
                  ? "text-[var(--color--text--auth-mobile)]"
                  : "text-gray-500"
              }`}
            >
              Войти
            </span>
            {!isRightPanelActive && (
              <span className="absolute bottom-0 left-1/2 w-[50%] -translate-x-1/2 border-b-[2px] border-[var(--color--text--auth-mobile)]"></span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsRightPanelActive(true)}
            className="relative px-4 py-2"
          >
            <span
              className={`${
                isRightPanelActive
                  ? "text-[var(--color--text--auth-mobile)]"
                  : "text-gray-500"
              }`}
            >
              Создать аккаунт
            </span>
            {isRightPanelActive && (
              <span className="absolute bottom-0 left-1/2 w-[80%] -translate-x-1/2 border-b-[2px] border-[var(--color--text--auth-mobile)]"></span>
            )}
          </button>
        </div>
        {isRightPanelActive ? (
          <form
            className="bg-[var(--color--auth-left)] w-full max-w-md p-6 rounded-[30px]"
            onSubmit={handleRegister}
          >
            <h1 className="font-medium text-2xl md:text-3xl mb-6">
              Создать аккаунт
            </h1>
            <div className="flex gap-4 my-5 justify-center">
              <a
                href="#"
                className="rounded-full h-10 w-10 flex items-center justify-center"
              >
                <Image
                  src="/images/google_auth.svg"
                  alt="Google"
                  width={40}
                  height={40}
                />
              </a>
              <a
                href="#"
                className="rounded-full h-10 w-10 flex items-center justify-center"
              >
                <Image
                  src="/images/vk_auth.svg"
                  alt="vk"
                  width={40}
                  height={40}
                />
              </a>
              <a
                href="#"
                className="rounded-full h-10 w-10 flex items-center justify-center"
              >
                <Image
                  src="/images/tg_auth.svg"
                  alt="tg"
                  width={40}
                  height={40}
                />
              </a>
            </div>
            <span className="text-sm my-5 block text-center">
              или используйте свой email для регистрации
            </span>
            {registerError && (
              <div className="text-red-500 text-sm mb-2 w-full text-center">
                {registerError}
              </div>
            )}
            <input
              type="text"
              placeholder="Имя"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
              className="bg-[var(--color--input)] border-none py-3 px-4 rounded-[16px] my-2 w-full"
            />
            <input
              type="email"
              placeholder="Электронная почта"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              className="bg-[var(--color--input)] border-none py-3 rounded-[16px] px-4 my-2 w-full"
            />
            <input
              type="password"
              placeholder="Пароль"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              className="bg-[var(--color--input)] border-none py-3 rounded-[16px] px-4 my-2 w-full"
            />
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isRegisterLoading}
                className="rounded-2xl w-full border border-[var(--color--input-button)] bg-[var(--color--input-button)] text-white text-xs font-medium py-3 uppercase tracking-wider"
              >
                {isRegisterLoading ? "Загрузка..." : "Зарегистрироваться"}
              </button>
            </div>
          </form>
        ) : (
          <form
            className="bg-[var(--color--auth-left)] w-full max-w-md p-6 rounded-[30px]"
            onSubmit={handleLogin}
          >
            <h1 className="font-medium text-2xl md:text-3xl mb-6">Войти</h1>
            <div className="flex gap-4 my-5 justify-center">
              <a
                href="#"
                className="rounded-full h-10 w-10 flex items-center justify-center"
              >
                <Image
                  src="/images/google_auth.svg"
                  alt="Google"
                  width={40}
                  height={40}
                />
              </a>
              <a
                href="#"
                className="rounded-full h-10 w-10 flex items-center justify-center"
              >
                <Image
                  src="/images/vk_auth.svg"
                  alt="vk"
                  width={40}
                  height={40}
                />
              </a>
              <a
                href="#"
                className="rounded-full h-10 w-10 flex items-center justify-center"
              >
                <Image
                  src="/images/tg_auth.svg"
                  alt="tg"
                  width={40}
                  height={40}
                />
              </a>
            </div>
            <span className="text-sm my-5 block text-center">
              или используйте свой аккаунт
            </span>
            {loginError && (
              <div className="text-red-500 text-sm mb-2 w-full text-center">
                {loginError}
              </div>
            )}
            <input
              type="email"
              placeholder="Электронная почта"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              className="bg-[var(--color--input)] border-none rounded-[16px] py-3 px-4 my-2 w-full"
            />
            <input
              type="password"
              placeholder="Пароль"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              className="bg-[var(--color--input)] border-none rounded-[16px] py-3 px-4 my-2 w-full"
            />
            <a
              href="#"
              className="text-gray-500 text-sm my-3 block text-center"
            >
              Забыли пароль?
            </a>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isLoginLoading}
                className="rounded-2xl w-full border border-[var(--color--input-button)] bg-[var(--color--input-button)] text-white text-xs font-medium py-3 uppercase tracking-wider"
              >
                {isLoginLoading ? "Загрузка..." : "Войти"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
