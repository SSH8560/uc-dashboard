"use client";

import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/app/login/actions";

const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string({ required_error: "비밀번호를 입력해주세요." })
    .min(1, { message: "비밀번호를 입력해주세요." }),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = ({ email, password }: z.infer<typeof loginSchema>) =>
    login(email, password);

  return (
    <Form {...form}>
      <form
        className="w-[400px] flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <Input placeholder="이메일" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <Input type="password" placeholder="비밀번호" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">로그인</Button>
      </form>
    </Form>
  );
}
