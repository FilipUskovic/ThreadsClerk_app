"use client"
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image"


function Bottombar(){
    const router = useRouter();
    const path = usePathname();


    return(
        <section className="bottombar">
            <div className="bottombar_container">
            {sidebarLinks.map((link) => {
            const isActive = (path.includes(link.route) && link.route.length > 1
            || path === link.route);

            return(
            <Link href={link.route}
            // jer mappiramo over the elements
            key={link.label}
                                                // ako je aktivno renderaj ovaj still
            className={`bottombar_link ${isActive && 'bg-primary-500'}`}
            >
                <Image src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
                />
                                                             {/* ovjde renderamo i splitamo samo prvu rijec da se pokaze na manjim ekranima */}
                <p className="text-subtle-medium text-light-1 max-sm:hidden">{link.label.split(/\s+/)[0]} </p>
            </Link>
        )})}   
            </div>
        </section>
    )
};


export default Bottombar;