"use server"; // Server Actions 只在服务端运行

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// zod 是一个用于验证数据的库，它可以帮助我们定义数据的结构，并验证数据是否符合这个结构。
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // coerce.number() 会将字符串转换为数字
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoice(formData: FormData) {
  // CreateInvoice.parse 方法用于验证 formData 中的数据是否符合 CreateInvoice 的结构
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0]; // 获取当前日期：YYYY-MM-DD

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath("/dashboard/invoices"); // revalidatePath 的作用是重新生成指定路由的页面，以便在下次访问时显示最新数据
  redirect("/dashboard/invoices"); // 重定向
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export const updateInvoice = async (id: string, formData: FormData) => {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100; // 将金额转换为分

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices"); // 重新生成指定路由的页面
  redirect("/dashboard/invoices"); // 重定向
};

export const deleteInvoice = async (id: string) => {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
};
