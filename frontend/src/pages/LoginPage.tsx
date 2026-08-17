import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, FormGroup, Input, Logo } from "../components";
import { useLogin } from "../hooks/useLogin";

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const loginMutation = useLogin();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginMutation.mutate(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md text-center">
        <Card>
          <Logo size="large" className="mb-2.5" />
          <form onSubmit={handleSubmit}>
            <FormGroup label="E-mail" htmlFor="email">
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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
              />
            </FormGroup>

            <Button
              type="submit"
              variant="primary"
              className="mt-2.5 w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {}
          {loginMutation.isError && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                backgroundColor: "#FEE",
                border: "1px solid var(--danger-color)",
                color: "var(--danger-color)",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              {"Email ou senha incorretos"}
            </div>
          )}
        </Card>

        <p className="mt-5">
          Não tem uma conta?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary-500 no-underline transition-colors hover:text-primary-600"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};
