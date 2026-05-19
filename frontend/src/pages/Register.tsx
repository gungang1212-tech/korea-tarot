import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { authApi } from "@/api/auth";

const schema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  nickname: z.string().min(2, "닉네임은 2자 이상이어야 합니다").max(20, "닉네임은 20자 이하"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다").regex(/(?=.*[a-zA-Z])(?=.*\d)/, "영문과 숫자를 조합해주세요"),
  passwordConfirm: z.string(),
}).refine((d) => d.password === d.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["passwordConfirm"],
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await authApi.register(data.email, data.password, data.nickname);
      navigate("/login", { state: { message: "회원가입이 완료되었습니다. 로그인하세요." } });
    } catch (err: any) {
      const code = err.response?.data?.detail?.code;
      if (code === "EMAIL_ALREADY_EXISTS") {
        setError("email", { message: "이미 사용 중인 이메일입니다" });
      } else {
        setError("root", { message: "회원가입에 실패했습니다. 다시 시도해 주세요." });
      }
    }
  };

  return (
    <PageLayout className="flex items-center justify-center min-h-screen py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md px-4"
      >
        <div className="bg-navy-800/60 border border-purple-800/30 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-gold-400 text-3xl">✦</span>
            <h1 className="font-serif text-2xl text-white mt-2">회원가입</h1>
            <p className="text-purple-400 text-sm mt-1">아르카나와 함께 당신의 이야기를 시작하세요</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="이메일" type="email" placeholder="email@example.com" error={errors.email?.message} {...register("email")} />
            <Input label="닉네임" type="text" placeholder="나만의 이름" error={errors.nickname?.message} {...register("nickname")} />
            <Input label="비밀번호" type="password" placeholder="영문+숫자 8자 이상" error={errors.password?.message} {...register("password")} />
            <Input label="비밀번호 확인" type="password" placeholder="비밀번호 재입력" error={errors.passwordConfirm?.message} {...register("passwordConfirm")} />

            {errors.root && (
              <p className="text-sm text-red-400 text-center bg-red-900/20 rounded-lg py-2 px-3">
                {errors.root.message}
              </p>
            )}

            <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
              회원가입
            </Button>
          </form>

          <p className="text-center text-purple-400 text-sm mt-6">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-gold-300 hover:text-gold-200">
              로그인
            </Link>
          </p>
        </div>
      </motion.div>
    </PageLayout>
  );
}
