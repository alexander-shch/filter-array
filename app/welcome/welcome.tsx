import { FilterList } from "../filters/FilterList";
import { useState } from "react";
import type { FilterConfigs, FilterStateFromConfig } from "../filters/types";

const filterConfig: FilterConfigs = [
	{
		type: "select",
		label: "Gender",
		name: "gender",
		properties: {
			options: [
				{ text: "Female", value: "female" },
				{ text: "Male", value: "male" },
			],
		},
	},
	{
		type: "checkbox",
		label: "Active",
		name: "active",
	},
	{
		type: "text",
		label: "Name",
		name: "name",
	},
	{
		type: "custom",
		label: "Custom Age",
		name: "age",
		render: (value: number, onChange: (val: number) => void) => (
			<input
				type="number"
				value={value ?? ""}
				onChange={(e) => onChange(Number(e.target.value))}
				placeholder="Age"
				style={{ width: "100%" }}
			/>
		),
	},
] as const;

export function Welcome() {
	const [filters, setFilters] = useState<FilterStateFromConfig<typeof filterConfig>>({});
	return (
		<main className="flex items-center justify-center pt-16 pb-4">
			<div className="flex-1 flex flex-col items-center gap-16 min-h-0">
				<div className="max-w-[300px] w-full space-y-6 px-4">
					<FilterList
						config={filterConfig}
						value={filters}
						onChange={setFilters}
					/>
					{/* Print filters in a user-friendly way */}
					<ul style={{ marginTop: 16, fontSize: 14, color: '#333' }}>
						{Object.entries(filters).length === 0 && <li>No filters selected</li>}
						{Object.entries(filters).map(([key, value]) => (
							value !== undefined && value !== null && value !== "" ? (
								<li key={key}>
									<strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
								</li>
							) : null
						))}
					</ul>
				</div>
			</div>
		</main>
	);
}
