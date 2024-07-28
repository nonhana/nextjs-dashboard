import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data";

/* 
  在 Next.js 中，Page 是一个特殊的组件。它就是页面的根组件，用于渲染页面的内容。
  Next.js 会为其自动注入一些特殊的参数。这些参数主要用于服务端渲染和静态生成。
  此处的 params，就是一个这样的参数。它包含了动态路由的参数。
*/
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
