import { cn } from "@/lib/utils";
import logo from "@/assets/Logo.png";

interface BrandLogoProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

const BrandLogo = ({ className, size = "md" }: BrandLogoProps) => {
    const sizeMap = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-24 h-24",
        xl: "w-32 h-32",
    };

    return (
        <div className={cn("relative flex items-center justify-center", sizeMap[size], className)}>
            <img
                src={logo}
                alt="BioCactus Logo"
                className="w-full h-full object-contain"
            />
        </div>
    );
};

export default BrandLogo;
