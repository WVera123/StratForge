
export default function ErrorModal({
    type = "error",
    title,
    message,
    onClose,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false
}) {
    if (!message) return null;

    const isConfirm = type === "confirm";

    return (
        <div
            className="error-modal-overlay"
            onClick={isLoading ? undefined : onClose}
        >
            <div
                className="error-modal"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="error-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="error-modal-content">
                    <h2 id="error-modal-title">
                        {title || (isConfirm ? "Are you sure?" : "Something went wrong")}
                    </h2>
                    <p>{message}</p>
                </div>

                <div className="error-modal-actions">
                    {isConfirm && (
                        <button
                            type="button"
                            className="error-modal-cancel"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </button>
                    )}

                    <button
                        type="button"
                        className={isConfirm ? "error-modal-confirm" : "error-modal-close"}
                        onClick={isConfirm ? onConfirm : onClose}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Deleting..."
                            : isConfirm
                                ? confirmText
                                : "Got it"}
                    </button>
                </div>

                <button
                    type="button"
                    className="error-modal-dismiss"
                    onClick={onClose}
                    disabled={isLoading}
                    aria-label="Close modal"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
