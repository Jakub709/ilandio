$(document).on("click", (e) => {
  const target = $(e.target);
  if (target.hasClass("leaveChat")) {
    if (target.data().id != null) {
      const chatId = target.data().id;
      Swal.fire({
        icon: "question",
        title: "Chcete chat skutečně smazat?",
        showCancelButton: true,
        confirmButtonText: "Smazat",
        cancelButtonText: "Zrušit",
        confirmButtonColor: "#147aed",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          $.ajax({
            url: `/api/chats/${chatId}/leaveChat`,
            type: "PUT",
            success: () => location.reload(),
            error: () => confirm("Nelze aktualizovat. Prosím zkus to znovu."),
          });
        }
      });
    }
    return false;
  }
});

$(document).on("click", (e) => {
  const target = $(e.target);
  if (target.hasClass("leaveChat")) {
    if (target.data().id != null) {
      const chatId = target.data().id;
      if (confirm("Chcete doopravdy smazat tento chat?")) {
        $.ajax({
          url: `/api/chats/${chatId}/leaveChat`,
          type: "PUT",
          success: () => location.reload(),
          error: () => confirm("Nelze aktualizovat. Prosím zkus to znovu."),
        });
      }
    }
    return false;
  }
});
