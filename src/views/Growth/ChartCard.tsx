import React, { MutableRefObject, ReactNode, RefObject } from "react";
import { FontWeight, Text } from "src/components/Text/Text";
import "./growth.scss";

export const ChartCard = ({ children, title, valueRef, initValue }: { children: ReactNode; title: string; valueRef: RefObject<HTMLSpanElement>; initValue: string }) => {
    return (
        <div className="chart-card">
            <div className="text-wrapper">
                <Text weight={FontWeight.Medium} dimmed size="20px">
                    {title}
                </Text>
                <Text ref={valueRef} weight={FontWeight.Bold} size="24px">
                    {initValue}
                </Text>
            </div>

            {children}
        </div>
    );
};
