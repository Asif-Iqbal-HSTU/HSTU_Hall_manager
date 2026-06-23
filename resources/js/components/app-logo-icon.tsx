import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img {...props} src="/images/hstu_logo.png" alt="HSTU Logo" className={`object-contain ${props.className || ''}`} />
    );
}
