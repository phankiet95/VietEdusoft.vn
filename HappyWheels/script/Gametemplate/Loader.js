
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