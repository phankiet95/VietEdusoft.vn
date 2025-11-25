// Inject Loader into Body
$(document).ready(function () {
    let htmlLoader = `<div id="loading" style="background: rgba(0, 0, 0, 0.2)" class="d-none w-100 h-100 align-items-center justify-content-center position-absolute fixed-top">
                        <h2 style="color:white">Đang xử lý dữ liệu tải về</h2>
                        <div class="lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        </div>
                    </div>`;
    document.body.innerHTML += htmlLoader;
});

window.isLoading = (bool) => {
    if (bool) {
        $("#loading")
        .removeClass("d-none")
        .addClass("d-flex");
    } else {
        $("#loading")
        .removeClass("d-flex")
        .addClass("d-none");
    }
}