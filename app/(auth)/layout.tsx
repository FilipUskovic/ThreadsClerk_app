import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
//import { dark } from "@clerk/themes";

import "../globals.css";

export const metadata = {
 title: 'Threds',
 description: 'Nextjs MetaThreads app'
};

// subsets mora biti arary jer imamo vise subsetova ofc
const inter = Inter({subsets: ["latin"]});

                                        // tip ovoga objekta ce biti object kojem su "children" jednaki React.ReactNoDE
export default function RootLayout({
    children
}:
     {children: React.ReactNode}){
            //<Ce nam omoguciti koristenje clerk funkcionalnosti        
    return(
     <ClerkProvider>
     <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
            {/* tu odmah zelimo renderati children */}
            <div className="w-full flex justify-center items-center min-h-screen">
      {children} 
      </div>    
        </body>
     </html>
    </ClerkProvider>
    )
}