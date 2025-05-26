// Filter types for the filter system

export type SelectOption = { text: string; value: string };

export interface BaseFilterConfig {
  type: string;
  label?: string;
  name: string;
  properties?: any;
}

export interface SelectFilterConfig extends BaseFilterConfig {
  type: "select";
  properties: { options: readonly SelectOption[] };
}

export interface CheckboxFilterConfig extends BaseFilterConfig {
  type: "checkbox";
}

export interface TextFilterConfig extends BaseFilterConfig {
  type: "text";
}

// Helper for type-safe custom filters
export interface CustomFilterConfig<T = any> extends BaseFilterConfig {
  type: "custom";
  render: (
    value: T,
    onChange: (val: T) => void
  ) => React.ReactNode;
}

export type FilterConfig =
  | SelectFilterConfig
  | CheckboxFilterConfig
  | TextFilterConfig
  | CustomFilterConfig<any>;

export type FilterConfigs = readonly FilterConfig[];

export type FilterValueType<C extends FilterConfig> =
  C extends SelectFilterConfig
    ? C["properties"] extends { options: infer O extends readonly SelectOption[] }
      ? O[number]["value"] | undefined
      : string | undefined
    : C extends CheckboxFilterConfig
    ? boolean | undefined
    : C extends TextFilterConfig
    ? string | undefined
    : C extends CustomFilterConfig<infer T>
    ? T
    : any;

export type FilterStateFromConfig<CFG extends FilterConfigs> = {
  [K in CFG[number] as K["name"]]?: FilterValueType<K>;
};
