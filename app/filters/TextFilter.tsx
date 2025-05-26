import React from "react";
import { type TextFilterConfig } from "./types";

export function TextFilter({
    filter,
    value,
    onChange,
}: {
    filter: TextFilterConfig;
    value: any;
    onChange: (val: any) => void;
}) {
    return (
        <input
            autoFocus
            type="text"
            value={String(value ?? "")}
            onChange={e => onChange(e.target.value)}
        />
    );
}
