import { checkStreak } from "./find/streak";
import { positionAnalysis } from "./find/position";
import { coverageForIndex } from "./find/coverage";
import { newIndexSuggestion } from './esr';

import { matchBeforeGroup } from "./aggregation/match_before_group";
import { sortBeforeGroupFirst } from "./aggregation/sort_group_first";
import { sortBeforeInterveningStages } from "./aggregation/sort_intervening";
import { matchAsFirstStage } from "./aggregation/match_first";

import { Reporter } from "../reporter";

export const createAlgos = (reporter: Reporter) => ({
	find: {
		streak: checkStreak(reporter),
		position: positionAnalysis(reporter),
		coverage: coverageForIndex(reporter)
	},
	aggregation: {
		matchBeforeGroup: matchBeforeGroup(reporter),
		sortBeforeGroup: sortBeforeGroupFirst(reporter),
		sortBeforeInterveningStages: sortBeforeInterveningStages(reporter),
		matchAsFirstStage: matchAsFirstStage(reporter)
	},
	esr: newIndexSuggestion(reporter)
});

export type Algorithms = ReturnType<typeof createAlgos>