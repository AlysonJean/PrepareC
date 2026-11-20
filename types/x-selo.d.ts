import "react";

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "x-selo": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                site?: string;
                tema?: "auto" | "claro" | "escuro";
                variante?: "completo" | "compacto" | "icone";
            };
        }
    }
}
