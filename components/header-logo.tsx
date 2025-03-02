import Link from 'next/link';
import Image from 'next/image';
export const HeaderLogo = () => {
    return(
        <Link href="/">
            <div className='items-start justify-start hidden lg:flex'>
                <p className='font-semibold text-white text-2xl ml-2.5'>
                   SmartFin
                </p>
            </div>
        </Link>
    )
}
