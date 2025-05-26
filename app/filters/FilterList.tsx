import React from "react";
import type {
    FilterConfig,
    SelectFilterConfig,
    TextFilterConfig,
    CustomFilterConfig,
    FilterConfigs,
    CheckboxFilterConfig,
    FilterStateFromConfig
} from "./types";
import { SelectFilter } from "./SelectFilter";
import { CheckboxFilter } from "./CheckboxFilter";
import { TextFilter } from "./TextFilter";

function getFilterCode(filter: FilterConfig): string {
    switch (filter.type) {
        case "select":
            return `<label>${filter.label ?? ""}\n  <select name=\"${filter.name}\">\n    <option value=\"\">Select...</option>\n    ${(filter.properties.options as readonly { text: string; value: string }[])
                .map(opt => `<option value=\"${opt.value}\">${opt.text}</option>`)
                .join("\n    ")}\n  </select>\n</label>`;
        case "checkbox":
            return `<label>\n  <input type=\"checkbox\" name=\"${filter.name}\" /> ${filter.label ?? ""}\n</label>`;
        case "text":
            return `<label>${filter.label ?? ""}\n  <input type=\"text\" name=\"${filter.name}\" />\n</label>`;
        case "custom":
            return `<label>${filter.label ?? ""}\n  <!-- Custom render -->\n</label>`;
        default:
            return "<Unknown filter type>";
    }
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div
            style={{
                position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
            }}
            onClick={onClose}
        >
            <div
                style={{ background: "#fff", color: "black", padding: 24, borderRadius: 8, minWidth: 320, maxWidth: 600, boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}
                onClick={e => e.stopPropagation()}
            >
                <button style={{ float: "right", fontSize: 18, border: "none", background: "none", cursor: "pointer" }} onClick={onClose}>×</button>
                <div style={{ clear: "both" }} />
                {children}
            </div>
        </div>
    );
}

// Chip and Popover helpers
function Chip({ label, onClick, showClear, onClear }: {
    label: React.ReactNode;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    showClear?: boolean;
    onClear?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
    return (
        <span style={{ display: "inline-flex", alignItems: "center", margin: 4 }}>
            <button
                type="button"
                onClick={onClick}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "6px 14px",
                    borderRadius: 16,
                    background: "#e0e7ef",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: 14,
                    paddingRight: showClear ? 24 : 14,
                }}
            >
                {label}
            </button>
            {showClear && (
                <button
                    type="button"
                    onClick={onClear}
                    style={{
                        marginLeft: -22,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 16,
                        color: "#888",
                        padding: 0,
                        display: "flex",
                        alignItems: "center"
                    }}
                    aria-label="Clear"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            )}
        </span>
    );
}

function Popover({ open, anchorEl, onClose, children }: { open: boolean; anchorEl: HTMLElement | null; onClose: () => void; children: React.ReactNode }) {
    if (!open || !anchorEl) return null;
    const rect = anchorEl.getBoundingClientRect();
    return (
        <div
            style={{
                position: "fixed",
                top: rect.bottom + 6,
                left: rect.left,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 8,
                boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
                zIndex: 2000,
                minWidth: 220,
                padding: 16,
            }}
        >
            <div style={{ position: "relative" }}>
                <button
                    style={{ position: "absolute", top: 2, right: 2, border: "none", background: "none", fontSize: 18, cursor: "pointer" }}
                    onClick={onClose}
                >×</button>
                {children}
            </div>
        </div>
    );
}

function renderFilterInput(filter: FilterConfig, value: any, onChange: (val: any) => void) {
    switch (filter.type) {
        case "select":
            return (
                <SelectFilter filter={filter as SelectFilterConfig} value={value} onChange={onChange} />
            );
        case "checkbox":
            return (
                <CheckboxFilter filter={filter as CheckboxFilterConfig} value={value} onChange={onChange} />
            );
        case "text":
            return (
                <TextFilter filter={filter as TextFilterConfig} value={value} onChange={onChange} />
            );
        case "custom":
            return (filter as CustomFilterConfig).render(value, onChange);
        default:
            return null;
    }
}

export function FilterList<CFG extends FilterConfigs>({
    config,
    value,
    onChange,
}: {
    config: CFG;
    value: FilterStateFromConfig<CFG>;
    onChange: (value: FilterStateFromConfig<CFG>) => void;
}) {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalCode, setModalCode] = React.useState<string>("");
    const [popoverIndex, setPopoverIndex] = React.useState<number | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    function handleChange(name: string, newValue: any) {
        onChange({ ...value, [name]: newValue });
    }

    function handleShowCode(filter: FilterConfig) {
        setModalCode(getFilterCode(filter));
        setModalOpen(true);
    }

    function handleChipClick(idx: number, event: React.MouseEvent<HTMLButtonElement>) {
        setPopoverIndex(idx);
        setAnchorEl(event.currentTarget);
    }

    function handlePopoverClose() {
        setPopoverIndex(null);
        setAnchorEl(null);
    }

    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {config.map((filter, idx) => {
                    const val = value[filter.name as keyof typeof value];
                    let chipLabel = filter.label ?? filter.name;
                    let hasValue = false;
                    if (filter.type === "select" && val) {
                        const opt = (filter as SelectFilterConfig).properties.options.find(o => o.value === val);
                        if (opt) chipLabel = `${filter.label ?? filter.name}: ${opt.text}`;
                        hasValue = !!val;
                    } else if (filter.type === "checkbox") {
                        chipLabel = `${filter.label ?? filter.name}: ${val ? "Yes" : "No"}`;
                        hasValue = val === true;
                    } else if (filter.type === "text" && val) {
                        chipLabel = `${filter.label ?? filter.name}: ${val}`;
                        hasValue = !!val;
                    } else if (filter.type === "custom" && val !== undefined && val !== null && val !== "") {
                        chipLabel = `${filter.label ?? filter.name}: ${val}`;
                        hasValue = true;
                    }
                    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        onChange({ ...value, [filter.name]: undefined });
                        setPopoverIndex(null);
                        setAnchorEl(null);
                    };
                    return (
                        <React.Fragment key={filter.name}>
                            <Chip
                                label={chipLabel}
                                onClick={e => handleChipClick(idx, e)}
                                showClear={hasValue}
                                onClear={handleClear}
                            />
                            <Popover open={popoverIndex === idx} anchorEl={anchorEl} onClose={handlePopoverClose}>
                                <div style={{ marginBottom: 12 }}>
                                    <strong>{filter.label ?? filter.name}</strong>
                                </div>
                                {renderFilterInput(
                                    filter,
                                    value[filter.name as keyof typeof value],
                                    (val: any) => handleChange(filter.name, val)
                                )}
                                <div style={{ marginTop: 12 }}>
                                    <button type="button" onClick={() => handleShowCode(filter)} style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}>
                                        Show Code
                                    </button>
                                </div>
                            </Popover>
                        </React.Fragment>
                    );
                })}
            </div>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <h3 style={{ marginTop: 0 }}>Filter Implementation</h3>
                <pre style={{ background: "#f4f4f4", padding: 12, borderRadius: 4, overflowX: "auto" }}>{modalCode}</pre>
            </Modal>
        </div>
    );
}
