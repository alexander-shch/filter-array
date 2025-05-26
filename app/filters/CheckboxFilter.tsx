import type { CheckboxFilterConfig } from "./types";

export function CheckboxFilter({
    filter,
    value,
    onChange,
}: {
    filter: CheckboxFilterConfig;
    value: any;
    onChange: (val: any) => void;
}) {
    return (
        <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={e => onChange(e.target.checked)}
        />
    );
}
