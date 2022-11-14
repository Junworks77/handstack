'use strict';
let $bs5_13_bs_scripts = {
    hook: {
        pageLoad: function () {
            var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
            popoverTriggerList.map(function (popoverTriggerEl) {
                return new bootstrap.Popover(popoverTriggerEl);
            });

            document.getElementById("toastbtn").onclick = () => {
                var toastElList = [].slice.call(document.querySelectorAll('.toast'));
                var toastList = toastElList.map(function (toastEl) {
                    return new bootstrap.Toast(toastEl);
                })
                toastList.forEach(toast => toast.show());
            }
        }
    }
};
