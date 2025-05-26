import { type SelectFilterConfig } from "./types";

export function SelectFilter({
    filter,
    value,
    onChange,
}: {
    filter: SelectFilterConfig;
    value: any;
    onChange: (val: any) => void;
}) {
    const options = filter.properties.options;
    return (
        <select
            value={String(value ?? "")}
            onChange={e => onChange(e.target.value)}
        >
            <option value="">Select...</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.text}</option>
            ))}
        </select>
    );
}
