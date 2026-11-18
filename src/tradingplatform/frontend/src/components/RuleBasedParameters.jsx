import React from "react";

export default function RuleBasedParameters({
    values,
    onChange
}) {
    const tokens = values.tokens || [];

    const availableChips = [
        {
            label: "IF",
            type: "keyword",
            value: "IF"
        },

        {
            label: "THEN",
            type: "keyword",
            value: "THEN"
        },

        {
            label: "OR",
            type: "keyword",
            value: "OR"
        },

        {
            label: "price",
            type: "variable",
            value: "price"
        },

        {
            label: "moves up",
            type: "operator",
            value: "moves_up"
        },

        {
            label: "moves down",
            type: "operator",
            value: "moves_down"
        },

        {
            label: "above",
            type: "operator",
            value: "above"
        },

        {
            label: "below",
            type: "operator",
            value: "below"
        },

        {
            label: "buy",
            type: "action",
            value: "buy"
        },

        {
            label: "sell",
            type: "action",
            value: "sell"
        }
    ];

    function getDefaultParamValue(chip) {
        if (chip.type === "operator") {
            return 1.0;
        }

        return undefined;
    }

    function handleAddToken(chip) {

        const newToken = {
            id: `${Date.now()}-${Math.random()}`,
            type: chip.type,
            label: chip.label,
            value: chip.value,
            paramValue: getDefaultParamValue(chip)
        };

        onChange(
            "tokens",
            [
                ...tokens,
                newToken
            ]
        );
    }

    function handleRemoveToken(id) {

        onChange(
            "tokens",
            tokens.filter(
                (token) => token.id !== id
            )
        );
    }

    function handleUpdateParam(
        id,
        value
    ) {

        const updated = tokens.map(
            (token) => {

                if (token.id !== id) {
                    return token;
                }

                return {
                    ...token,
                    paramValue: value
                };
            }
        );

        onChange(
            "tokens",
            updated
        );
    }

    function shouldShowInput(token) {

        return (
            token.type === "operator"
        );
    }

    function getInputSuffix(token) {

        if (
            token.value === "above" ||
            token.value === "below"
        ) {
            return "";
        }

        return "%";
    }

    function getInputMin(token) {

        if (token.type === "action") {
            return 1;
        }

        return 0;
    }

    function getInputMax(token) {

        if (token.type === "action") {
            return 100;
        }

        return 100;
    }

    return (
        <div className="rule-builder-wrapper">

            <div className="rule-palette-box">

                <span className="rule-palette-title">
                    Click words to build your custom statement:
                </span>

                <div className="rule-palette-chips">

                    {availableChips.map(
                        (chip, index) => (

                            <button
                                key={`${chip.type}-${chip.value}-${index}`}
                                type="button"
                                className="rule-chip-btn"
                                onClick={() =>
                                    handleAddToken(chip)
                                }
                            >
                                + {chip.label}
                            </button>

                        )
                    )}

                </div>

            </div>

            <div className="rule-session-box">

                {tokens.length === 0 ? (

                    <div className="rule-empty-state">
                        Statement is empty. Click words from
                        the palette above to construct your
                        custom rules.
                    </div>

                ) : (

                    <div className="rule-statement-row active-statement-flow">

                        {tokens.map(
                            (token) => (

                                <div
                                    key={token.id}
                                    className="rule-token-pill"
                                >

                                    <span className="rule-token-label">
                                        {token.label}
                                    </span>

                                    {shouldShowInput(token) && (

                                        <div className="rule-input-wrapper-inline">

                                            <input
                                                type="number"
                                                step="0.1"
                                                min={getInputMin(token)}
                                                max={getInputMax(token)}
                                                className="rule-pill-input"
                                                value={
                                                    token.paramValue ?? 1.0
                                                }
                                                onChange={(event) => {

                                                    const raw =
                                                        event.target.value;

                                                    if (raw === "") {

                                                        handleUpdateParam(
                                                            token.id,
                                                            ""
                                                        );

                                                        return;
                                                    }

                                                    handleUpdateParam(
                                                        token.id,
                                                        Number(raw)
                                                    );
                                                }}
                                            />

                                            {getInputSuffix(token) && (

                                                <span className="rule-input-suffix">
                                                    {getInputSuffix(token)}
                                                </span>

                                            )}

                                        </div>

                                    )}

                                    <button
                                        type="button"
                                        className="code-delete-btn"
                                        onClick={() =>
                                            handleRemoveToken(
                                                token.id
                                            )
                                        }
                                    >
                                        ×
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}