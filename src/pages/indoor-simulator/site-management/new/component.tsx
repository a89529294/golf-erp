import plusIcon from "@/assets/plus-icon.svg";
import { IconButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UnderscoredInput } from "@/components/underscored-input";
import { MainLayout } from "@/layouts/main-layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import redXIcon from "@/assets/red-x-icon.svg";

const fileWithIdSchema = z.object({
  file: z.instanceof(File),
  id: z.string(),
});

type FileWithId = z.infer<typeof fileWithIdSchema>;

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  imageFiles: z.array(fileWithIdSchema),
});

export function Component() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageFiles: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  function onRemoveImage(id: string) {
    const imageFiles = form.getValues("imageFiles");
    form.setValue(
      "imageFiles",
      imageFiles.filter((f) => f.id !== id),
    );
  }

  return (
    <MainLayout
      headerChildren={
        <>
          <IconButton icon="back" onClick={() => navigate(-1)}>
            返回
          </IconButton>
          <IconButton icon="save" onClick={() => {}}>
            儲存
          </IconButton>
        </>
      }
    >
      <div className="flex w-full flex-col gap-10 border border-line-gray bg-light-gray p-1">
        <h1 className="bg-mid-gray py-2.5 text-center text-black">
          建立場地資料
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10 px-56"
          >
            <section className="space-y-6 border border-line-gray bg-white px-12 py-10">
              <FormTextField name="name" label="場地名稱" />
              <FormTextField name="description" label="場地簡介" />
            </section>

            <section>
              <header className="flex items-center py-2.5 pl-5 ">
                <span className="font-semibold">場地圖片</span>
                <span className="ml-1 text-sm text-word-red">
                  (圖片上限10張)
                </span>

                <label className="relative ml-auto bg-white">
                  <div className={button({ size: "short" })}>
                    <img src={plusIcon} />
                    新增圖片
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files) return;

                      let filesArray: FileWithId[] = [];

                      filesArray = Array.from(files).map((file) => ({
                        file: file,
                        id: crypto.randomUUID(),
                      }));

                      form.setValue("imageFiles", [
                        ...form.getValues("imageFiles"),
                        ...filesArray,
                      ]);
                    }}
                  />
                </label>
              </header>

              <div className="border-y border-line-gray bg-white text-center text-word-gray">
                {form.watch("imageFiles").length ? (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] px-3 py-5">
                    {form.getValues("imageFiles").map((file) => {
                      return (
                        <PreviewImage
                          key={file.id}
                          file={file}
                          onRemoveImage={onRemoveImage}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="py-2.5">尚未新增圖片</p>
                )}
              </div>
            </section>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}

function FormTextField({
  name,
  label,
}: {
  name: "name" | "description";
  label: string;
}) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-baseline gap-5">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <UnderscoredInput
              placeholder={`請輸入${label}`}
              className="h-7 p-0 pb-1"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function PreviewImage({
  file,
  onRemoveImage,
}: {
  file: FileWithId;
  onRemoveImage: (id: string) => void;
}) {
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    const reader = new FileReader();
    reader.readAsDataURL(file.file);
    reader.onload = (e) => {
      setImgSrc((e.target?.result ?? "") as string);
    };
  }, [file]);

  return (
    <div className="group relative h-32 w-32">
      <button
        type="button"
        className="absolute right-0 top-0 hidden h-5 w-5 -translate-y-1/2 translate-x-1/2 rounded-full border border-line-red group-hover:block"
        onClick={() => onRemoveImage(file.id)}
      >
        <img src={redXIcon} />
      </button>
      <img src={imgSrc} className="h-full w-full  object-contain" />
    </div>
  );
}
