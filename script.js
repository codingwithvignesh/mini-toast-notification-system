/* ============================================================
   MINI CHALLENGE #04
   INTERACTIVE TOAST NOTIFICATION SYSTEM
   ============================================================ */


/* ============================================================
   DOM ELEMENTS
   ============================================================ */

const notificationButtons =
    document.querySelectorAll(
        ".notification-button"
    );

const toastContainer =
    document.getElementById(
        "toastContainer"
    );


/* ============================================================
   NOTIFICATION CONTENT
   ============================================================ */

const notificationData = {

    success: {

        title: "Changes saved",

        description:
            "Your latest changes have been saved successfully.",

        icon:
            "bi-check2-circle"

    },


    info: {

        title: "Just so you know",

        description:
            "This notification will disappear automatically.",

        icon:
            "bi-info-circle"

    },


    warning: {

        title: "Almost out of space",

        description:
            "You are getting close to your storage limit.",

        icon:
            "bi-exclamation-triangle"

    },


    error: {

        title: "Something went wrong",

        description:
            "We couldn't complete that action. Please try again.",

        icon:
            "bi-x-circle"

    }

};


/* ============================================================
   TOAST LIFETIME
   ============================================================ */

const TOAST_DURATION = 3800;


/* ============================================================
   CREATE TOAST
   ============================================================ */

function createToast(type) {

    /*
        Get the content associated with
        the selected notification type.
    */

    const data =
        notificationData[type];

    if (!data) {

        return;

    }


    /* ==========================================
       CREATE ELEMENT
    ========================================== */

    const toast =
        document.createElement("div");


    /* ==========================================
       SET CLASSES
    ========================================== */

    toast.className =
        `toast-message ${type}`;


    /* ==========================================
       ACCESSIBILITY
    ========================================== */

    /*
        Errors deserve stronger announcement
        semantics.
    */

    if (type === "error") {

        toast.setAttribute(
            "role",
            "alert"
        );

    } else {

        toast.setAttribute(
            "role",
            "status"
        );

    }


    /* ==========================================
       CREATE ICON
    ========================================== */

    const icon =
        document.createElement("div");

    icon.className =
        "toast-icon";

    icon.innerHTML =
        `<i
            class="bi ${data.icon}"
            aria-hidden="true"
        ></i>`;


    /* ==========================================
       CREATE CONTENT
    ========================================== */

    const content =
        document.createElement("div");

    content.className =
        "toast-content";


    const title =
        document.createElement("strong");

    title.className =
        "toast-title";

    title.textContent =
        data.title;


    const description =
        document.createElement("span");

    description.className =
        "toast-description";

    description.textContent =
        data.description;


    content.appendChild(title);

    content.appendChild(description);


    /* ==========================================
       CREATE CLOSE BUTTON
    ========================================== */

    const closeButton =
        document.createElement("button");

    closeButton.type =
        "button";

    closeButton.className =
        "toast-close";

    closeButton.setAttribute(
        "aria-label",
        "Dismiss notification"
    );

    closeButton.innerHTML =
        `<i
            class="bi bi-x"
            aria-hidden="true"
        ></i>`;


    /* ==========================================
       PROGRESS BAR
    ========================================== */

    const progress =
        document.createElement("span");

    progress.className =
        "toast-progress";

    progress.setAttribute(
        "aria-hidden",
        "true"
    );


    /* ==========================================
       BUILD TOAST
    ========================================== */

    toast.appendChild(icon);

    toast.appendChild(content);

    toast.appendChild(closeButton);

    toast.appendChild(progress);


    /* ==========================================
       ADD TO PAGE
    ========================================== */

    toastContainer.appendChild(toast);


    /* ==========================================
       CLOSE HANDLER
    ========================================== */

    closeButton.addEventListener(
        "click",
        () => {

            removeToast(toast);

        }
    );


    /* ==========================================
       AUTOMATIC DISMISS
    ========================================== */

    const timeout =
        setTimeout(
            () => {

                removeToast(toast);

            },
            TOAST_DURATION
        );


    /*
        Store timeout on the element.

        This lets us clear the timeout
        if the user manually closes it.
    */

    toast.dataset.timeout =
        timeout;


    /* ==========================================
       LIMIT NUMBER OF TOASTS
    ========================================== */

    limitVisibleToasts();


    /* ==========================================
       RETURN ELEMENT
    ========================================== */

    return toast;
}


/* ============================================================
   REMOVE TOAST
   ============================================================ */

function removeToast(toast) {

    if (!toast) {

        return;

    }


    /*
        Prevent the function from running
        multiple times.
    */

    if (
        toast.classList.contains(
            "is-removing"
        )
    ) {

        return;

    }


    /* ==========================================
       CLEAR AUTOMATIC TIMEOUT
    ========================================== */

    if (toast.dataset.timeout) {

        clearTimeout(
            Number(toast.dataset.timeout)
        );

    }


    /* ==========================================
       EXIT ANIMATION
    ========================================== */

    toast.classList.add(
        "is-removing"
    );


    /*
        Wait for the animation to finish
        before removing the element.
    */

    toast.addEventListener(
        "animationend",
        () => {

            toast.remove();

        },
        {
            once: true
        }
    );

}


/* ============================================================
   LIMIT VISIBLE TOASTS
   ============================================================ */

function limitVisibleToasts() {

    const toasts =
        toastContainer.querySelectorAll(
            ".toast-message:not(.is-removing)"
        );


    /*
        Keep the notification stack readable.

        If too many notifications are triggered,
        remove the oldest one.
    */

    const MAX_VISIBLE_TOASTS = 3;


    if (
        toasts.length >
        MAX_VISIBLE_TOASTS
    ) {

        const oldestToast =
            toasts[0];

        removeToast(
            oldestToast
        );

    }

}


/* ============================================================
   BUTTON EVENTS
   ============================================================ */

notificationButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const type =
                    button.dataset.type;

                createToast(type);

            }
        );

    }
);


/* ============================================================
   ESCAPE KEY
   ============================================================ */

document.addEventListener(
    "keydown",
    event => {

        /*
            Escape dismisses the latest
            visible notification.
        */

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        const toasts =
            toastContainer.querySelectorAll(
                ".toast-message:not(.is-removing)"
            );


        if (
            toasts.length === 0
        ) {

            return;

        }


        const latestToast =
            toasts[
                toasts.length - 1
            ];


        removeToast(
            latestToast
        );

    }
);


/* ============================================================
   INITIAL CONSOLE MESSAGE
   ============================================================ */

console.log(
    "Mini Challenge #04 — Toast Notification System loaded."
);