import pandas as pd
import numpy as np


class RuleBasedStrategy:

    VARIABLE_ALIASES = {
        "price": "price",
    }

    OPERATOR_ALIASES = {
        "moves up": "moves_up",
        "moves_up": "moves_up",
        "above": "above",
        "moves down": "moves_down",
        "moves_down": "moves_down",
        "below": "below",
    }

    ACTIONS = {"buy", "sell"}

    def run(
        self,
        df: pd.DataFrame,
        parameters
    ) -> pd.DataFrame:

        result = df.copy()

        signals = np.full(
            len(result),
            "hold",
            dtype=object
        )

        order_percentages = np.zeros(
            len(result),
            dtype=float
        )

        rule_indexes = np.full(
            len(result),
            -1,
            dtype=int
        )

        tokens = getattr(
            parameters,
            "tokens",
            []
        ) or []

        rules = self._parse_rules(tokens)

        if not rules:
            result["signal"] = signals
            result["order_percentage"] = order_percentages
            result["rule_index"] = rule_indexes

            return result

        closes = pd.to_numeric(
            result["close"],
            errors="coerce"
        ).to_numpy(dtype=float)

        for i in range(1, len(result)):

            current_price = closes[i]
            previous_price = closes[i - 1]

            if not np.isfinite(current_price):
                continue

            if not np.isfinite(previous_price):
                continue

            if previous_price <= 0:
                continue

            for rule_index, rule in enumerate(rules):

                if not self._condition_matches(
                    rule=rule,
                    current_price=current_price,
                    previous_price=previous_price
                ):
                    continue

                signals[i] = rule["action"]
                order_percentages[i] = rule["percentage"]
                rule_indexes[i] = rule_index

                # First matching rule wins.
                break

        result["signal"] = signals
        result["order_percentage"] = order_percentages
        result["rule_index"] = rule_indexes

        return result

    def _parse_rules(self, tokens):

        normalized_tokens = []

        for token in tokens:

            if not isinstance(token, dict):
                continue

            normalized_tokens.append({
                "label": str(
                    token.get("label", "")
                ).strip().lower(),

                "value": str(
                    token.get("value", "")
                ).strip().lower(),

                "type": str(
                    token.get("type", "")
                ).strip().lower(),

                "paramValue": token.get("paramValue"),
            })

        if not normalized_tokens:
            return []

        clauses = []
        current_clause = []

        for token in normalized_tokens:

            label = token["label"]
            value = token["value"]

            is_if = (
                label == "if"
                or value == "if"
            )

            if is_if:

                if current_clause:
                    clauses.append(current_clause)

                current_clause = [token]

            else:

                current_clause.append(token)

        if current_clause:
            clauses.append(current_clause)

        rules = []

        for clause in clauses:

            rule = self._parse_single_rule(clause)

            if rule is not None:
                rules.append(rule)

        return rules

    def _parse_single_rule(self, tokens):

        variable = None
        operator = None
        action = None

        operator_value = None
        action_percentage = None

        for token in tokens:

            label = token["label"]
            value = token["value"]
            token_type = token["type"]

            if token_type == "variable":

                variable_value = (
                    value
                    if value
                    else label
                )

                variable_value = (
                    variable_value.strip().lower()
                )

                if variable_value in self.VARIABLE_ALIASES:

                    variable = self.VARIABLE_ALIASES[
                        variable_value
                    ]

            elif token_type == "operator":

                operator_key = (
                    self.OPERATOR_ALIASES.get(value)
                    or self.OPERATOR_ALIASES.get(label)
                )

                if operator_key:

                    operator = operator_key

                    raw_value = token.get(
                        "paramValue"
                    )

                    if raw_value not in (
                        None,
                        ""
                    ):
                        try:
                            operator_value = float(
                                raw_value
                            )
                        except (
                            TypeError,
                            ValueError
                        ):
                            operator_value = None

            elif token_type == "action":

                action_value = (
                    value
                    or label
                ).strip().lower()

                if action_value in self.ACTIONS:

                    action = action_value

                    raw_value = token.get(
                        "paramValue"
                    )

                    if raw_value not in (
                        None,
                        ""
                    ):
                        try:
                            action_percentage = float(
                                raw_value
                            )
                        except (
                            TypeError,
                            ValueError
                        ):
                            action_percentage = None

            if (
                action is None
                and label in self.ACTIONS
            ):

                action = label

                raw_value = token.get(
                    "paramValue"
                )

                if raw_value not in (
                    None,
                    ""
                ):
                    try:
                        action_percentage = float(
                            raw_value
                        )
                    except (
                        TypeError,
                        ValueError
                    ):
                        action_percentage = None

        if variable is None:
            return None

        if operator is None:
            return None

        if action is None:
            return None

        threshold = operator_value

        if operator in {
            "moves_up",
            "moves_down"
        }:

            if threshold is None:
                threshold = 0.0

            threshold = max(
                0.0,
                float(threshold)
            )

        elif operator in {
            "above",
            "below"
        }:

            if threshold is None:
                return None

            threshold = float(threshold)

        if action_percentage is None:
            action_percentage = 100.0

        action_percentage = max(
            0.0,
            min(
                100.0,
                float(action_percentage)
            )
        )

        return {
            "variable": variable,
            "operator": operator,
            "threshold": threshold,
            "action": action,
            "percentage": action_percentage,
        }

    def _condition_matches(
        self,
        rule,
        current_price,
        previous_price
    ):

        variable = rule["variable"]
        operator = rule["operator"]
        threshold = rule["threshold"]

        if variable != "price":
            return False

        value = current_price

        if operator == "moves_up":

            price_change_pct = (
                (
                    current_price
                    - previous_price
                )
                / previous_price
            ) * 100.0

            return (
                price_change_pct
                >= threshold
            )

        if operator == "moves_down":

            price_change_pct = (
                (
                    current_price
                    - previous_price
                )
                / previous_price
            ) * 100.0

            return (
                price_change_pct
                <= -threshold
            )

        if operator == "above":

            return value >= threshold

        if operator == "below":

            return value <= threshold

        return False