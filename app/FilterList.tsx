import React, { useState } from "react";

// 1. Filter config types
type SelectOption = { text: string; value: string };

interface BaseFilterConfig {
  type: string;
  label?: string;
  name: string;
  properties?: any;
}

interface SelectFilterConfig extends BaseFilterConfig {
  type: "select";
  properties: { options: readonly SelectOption[] };
}

interface CheckboxFilterConfig extends BaseFilterConfig {
  type: "checkbox";
}

interface TextFilterConfig extends BaseFilterConfig {
  type: "text";
}

interface CustomFilterConfig extends BaseFilterConfig {
  type: "custom";
  render: (
    value: any,
    onChange: (val: any) => void
  ) => React.ReactNode;
}

// Add more filter types as needed

type FilterConfig = SelectFilterConfig | CheckboxFilterConfig | TextFilterConfig | CustomFilterConfig;

type FilterConfigArray = readonly FilterConfig[];

// 2. Infer state type from config

type FilterValueType<C extends FilterConfig> =
  C extends SelectFilterConfig ? (C["properties"] extends { options: infer O extends readonly SelectOption[] }
    ? O[number]["value"] | undefined
    : string | undefined)
  : C extends CheckboxFilterConfig ? boolean | undefined
  : C extends TextFilterConfig ? string | undefined
  : C extends CustomFilterConfig ? any
  : any;

// Map config array to state shape
type FilterStateFromConfig<CFG extends FilterConfigArray> = {
  [K in CFG[number] as K["name"]]?: FilterValueType<K>;
};

// 3. Component props
type FilterListProps<CFG extends FilterConfigArray> = {
  config: CFG;
  value: FilterStateFromConfig<CFG>;
  onChange: (value: FilterStateFromConfig<CFG>) => void;
};

function getFilterCode(filter: FilterConfig): string {
  switch (filter.type) {
    case "select":
      return `<label>${filter.label ?? ""}\n  <select name=\"${filter.name}\">\n    <option value=\"\">Select...</option>\n    ${(filter.properties.options as readonly SelectOption[])
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
        style={{ background: "#fff", color:"black", padding: 24, borderRadius: 8, minWidth: 320, maxWidth: 600, boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}
      >
        <button style={{ float: "right", fontSize: 18, border: "none", background: "none", cursor: "pointer" }} onClick={onClose}>×</button>
        <div style={{ clear: "both" }} />
        {children}
      </div>
    </div>
  );
}

// Remove the old implementation and only re-export the new FilterList
export { FilterList } from "./filters/FilterList";

// Usage example (type-safe):
// const config = [
//   { type: "select", label: "Gender", name: "gender", properties: { options: [ { text: "Female", value: "female" }, { text: "Male", value: "male" } ] } },
//   { type: "checkbox", label: "Active", name: "active" },
//   { type: "custom", label: "Custom Age", name: "age", render: (value, onChange) => (
//     <input type="number" value={value ?? ''} onChange={e => onChange(Number(e.target.value))} placeholder="Age" />
//   ) },
// ] as const;
//
// <FilterList
//   config={config}
//   value={{ gender: "female", active: true, age: 30 }}
//   onChange={v => { /* v is type-safe: { gender?: "female"|"male", active?: boolean, age?: any } */ }}
// />
