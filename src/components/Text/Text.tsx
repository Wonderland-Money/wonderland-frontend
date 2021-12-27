import React, { CSSProperties, forwardRef, ReactNode } from "react";

export enum FontWeight {
    Default = "Montserrat",
    Medium = "Montserrat Medium",
    Semibold = "Montserrat Semibold",
    Bold = "Montserrat Bold",
}

export interface TextProps {
    size?: string;
    weight?: FontWeight;
    children?: ReactNode;
    dimmed?: boolean;
    style?: CSSProperties; // for all kinds of overrides
}

export const Text = forwardRef<HTMLSpanElement, TextProps>(({ size = "14px", weight = FontWeight.Default, dimmed = false, style = {}, children }: TextProps, ref) => {
    const textStyle: CSSProperties = {
        fontSize: size,
        fontFamily: weight,
        color: dimmed ? "rgba(255, 255, 255, 0.6)" : "#fff",
        ...style,
    };
    return (
        <span ref={ref} style={textStyle}>
            {children}
        </span>
    );
});
