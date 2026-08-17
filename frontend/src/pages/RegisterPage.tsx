import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, FormGroup, Input, Logo } from "../components";
import { useRegister } from "../hooks/useRegister";

interface RegisterForm {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage: React.FC = () => {
  const { register, isLoading, isSuccess, error } = useRegister();
  const [formData, setFormData] = useState<RegisterForm>({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await register(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-5">
      <div className="w-full max-w-md text-center">
        <Card>
          <Logo size="large" className="mb-2.5" />
          <p className="text-text-light -mt-2.5 mb-8">
            Comece a sua busca pelo lugar ideal.
          </p>

          <form onSubmit={handleSubmit}>
            {isSuccess && (
              <div
                id="success-message"
                className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4"
              >
                <p className="text-center font-medium text-green-800">
                  ✓ Conta criada com sucesso!
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <FormGroup label="Nome Completo" htmlFor="fullname">
              <Input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                disabled={isLoading || isSuccess}
              />
            </FormGroup>

            <FormGroup label="E-mail" htmlFor="email">
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading || isSuccess}
              />
            </FormGroup>

            <FormGroup label="Senha" htmlFor="password">
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading || isSuccess}
              />
            </FormGroup>

            <FormGroup label="Confirme sua Senha" htmlFor="confirmPassword">
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading || isSuccess}
              />
            </FormGroup>

            <Button
              type="submit"
              variant="primary"
              className="mt-5 w-full"
              disabled={isLoading || isSuccess}
            >
              {isSuccess
                ? "Conta Criada!"
                : isLoading
                  ? "Criando Conta..."
                  : "Criar Conta"}
            </Button>
          </form>
        </Card>

        <p className="mt-5">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary-500 no-underline transition-colors hover:text-primary-600"
          >
            Faça Login
          </Link>
        </p>
      </div>
    </div>
  );
};
