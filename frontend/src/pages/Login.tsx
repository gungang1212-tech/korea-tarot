import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";

const schema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(1, "비밀번호를 입력하세요"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.login(data.email, data.password);
      setAuth(res.data.user, res.data.access_token);
      navigate("/");
    } catch (err: any) {
      const msg = err.response?.data?.detail?.detail || "이메일 또는 비밀번호가 올바르지 않습니다";
      setError("root", { message: msg });
    }
  };

  return (
    <PageLayout className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md px-4"
      >
        <div className="bg-navy-800/60 border border-purple-800/30 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-gold-400 text-3xl">✦</span>
            <h1 className="font-serif text-2xl text-white mt-2">로그인</h1>
            <p className="text-purple-400 text-sm mt-1">아르카나에 오신 것을 환영합니다</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="이메일" type="email" placeholder="email@example.com" error={errors.email?.message} {...register("email")} />
            <Input label="비밀번호" type="password" placeholder="비밀번호" error={errors.password?.message} {...register("password")} />

            {errors.root && (
              <p className="text-sm text-red-400 text-center bg-red-900/20 rounded-lg py-2 px-3">
                {errors.root.message}
              </p>
            )}

            <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
              로그인
            </Button>
          </form>

          <p className="text-center text-purple-400 text-sm mt-6">
            계정이 없으신가요?{" "}
            <Link to="/register" className="text-gold-300 hover:text-gold-200">
              회원가입
            </Link>
          </p>
        </div>
      </motion.div>
    </PageLayout>
  );
}
