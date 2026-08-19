import {
    createUploadthing,
    type FileRouter,
  } from "uploadthing/next";
  
  import { getServerSession } from "next-auth";
  import { authOptions } from "@/app/api/auth/[...nextauth]/route";
  
  const f = createUploadthing();
  
  export const ourFileRouter = {
    adImage: f({
      image: {
        maxFileSize: "8MB",
        maxFileCount: 2,
      },
    })
      .middleware(async () => {
        const session = await getServerSession(authOptions);
  
        if (!session?.user?.email) {
          throw new Error("برای آپلود تصویر باید وارد حساب کاربری شوید");
        }
  
        return {
          userEmail: session.user.email,
        };
      })
      .onUploadComplete(async ({ file, metadata }) => {
        console.log("Upload complete:", {
          url: file.ufsUrl,
          key: file.key,
          userEmail: metadata.userEmail,
        });
  
        return {
          url: file.ufsUrl,
          key: file.key,
        };
      }),
  } satisfies FileRouter;
  
  export type OurFileRouter = typeof ourFileRouter;