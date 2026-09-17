/** Merged Chinese -> English dictionary. Each area keeps its own part file. */
import { CORE_DICT } from "./dict.core";
import { HOME_DICT } from "./dict.home";
import { REPORTS_DICT } from "./dict.reports";
import { TRENDS_DICT } from "./dict.trends";
import { DAILY_DICT } from "./dict.daily";
import { VISITS_DICT } from "./dict.visits";
import { ACCOUNT_DICT } from "./dict.account";

export const DICT: Record<string, string> = {
  ...CORE_DICT,
  ...HOME_DICT,
  ...REPORTS_DICT,
  ...TRENDS_DICT,
  ...DAILY_DICT,
  ...VISITS_DICT,
  ...ACCOUNT_DICT,
};
