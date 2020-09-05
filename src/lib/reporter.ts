import { writeFileSync } from "fs";
import { MongoIndexKey } from "../utils/types";

type ReportOptions = {
	type: "stdout" | "file";
	format: "json" | "txt";
	path?: string;
};

export const Reporter = () => ({
	_report: {},
	setup: function (collection: string, query: any, sort: any, projection: any) { },
	insert: function (index: string, item: any) {
		if (this._report[index])
			this._report[index].push(item);
		else
			this._report[index] = [item];
	},
	suggest: function (index: string, type: string, fields: string[]) {
		const item = { suggestion: type, fields };
		this.insert(index, item);
	},
	suggestOR: function (index: string, ...suggestions: { type: string; fields: string[]; }[]) {
		const item = {
			relation: "OR",
			suggestions: suggestions.map(({ type, fields }) => ({ suggestion: type, fields }))
		};
		this.insert(index, item);
	},
	suggestAND: function (index: string, ...suggestions: { type: string; fields: string[]; }[]) {
		const item = {
			relation: "AND",
			suggestions: suggestions.map(({ type, fields }) => ({ suggestion: type, fields }))
		};
		this.insert(index, item);
	},
	suggestNewIndex: function (type: string, indexKeys: MongoIndexKey) {
		const item = { suggestion: type, key: indexKeys };
		this.insert('NEW_INDEX_SUGGESTIONS', item);
	},
	report: function ({ type, format, path }: ReportOptions) {
		switch (format) {
			case "json": {
				const json = JSON.stringify(this._report, null, 4)
				switch (type) {
					case "stdout": {
						console.log(json);
						break;
					}
					case "file": {
						if (!path) throw new Error("Please provide a `path` value to `.report()` when using `file` type of reporting.");
						writeFileSync(path, json);
						break;
					}
					default: {
						throw new Error(`Reporting type not implemented for format: ${format}.`);
					}
				}
				break;
			}
			case "txt": {
				switch (type) {
					default: {
						throw new Error(`Reporting type not implemented for format: ${format}.`);
					}
				}
				break;
			}
			default: {
				throw new Error("Reporting format not implemented.");
			}
		}
	}
});

export type Reporter = ReturnType<typeof Reporter>;

/*
	// `_report` structure
	{
		index1: [
			{
				relation: "OR",
				suggestions: [
					{ type, fields }, // SUGGESTION 1
					{ type, fields } // OR SUGGESTION 2
				]
			}
			, ... { type, fields } // OTHER SUGGESTIONS
		],
		index2: [
			{
				relation: "AND",
				suggestions: [
					{ type, fields } // SUGGESTION 1
					{ type, fields } // AND SUGGESTION 2
				]
			}
			, ... { type, fields } // OTHER SUGGESTIONS
		]
	}
*/