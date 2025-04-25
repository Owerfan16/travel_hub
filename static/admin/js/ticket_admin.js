(function ($) {
  $(document).ready(function () {
    // Function to toggle fields based on has_transfer state
    function toggleTransferFields() {
      const hasTransfer = $("#id_has_transfer").prop("checked");
      const transferRelatedFields = [
        "div.field-transfer_count",
        "div.field-transfer_city",
        "div.field-transfer_duration",
        "div.field-requires_reregistration",
        "div.field-night_transfer",
      ];

      // Show or hide transfer-related fields
      $(transferRelatedFields.join(", ")).toggle(hasTransfer);

      // If "has transfer" is checked and transfer_count is 0, set it to 1
      if (hasTransfer) {
        const transferCount = $("#id_transfer_count").val();
        if (transferCount === "0") {
          $("#id_transfer_count").val("1");
        }
      } else {
        // If "has transfer" is unchecked, set transfer_count to 0
        $("#id_transfer_count").val("0");
      }
    }

    // Initialize fields state on page load
    toggleTransferFields();

    // Add event listener for has_transfer checkbox changes
    $("#id_has_transfer").change(function () {
      toggleTransferFields();
    });

    // Add event listener for transfer_count field
    $("#id_transfer_count").change(function () {
      const transferCount = parseInt($(this).val());

      // If transfer_count > 0, ensure has_transfer is checked
      if (transferCount > 0 && !$("#id_has_transfer").prop("checked")) {
        $("#id_has_transfer").prop("checked", true);
        toggleTransferFields();
      }

      // If transfer_count = 0, ensure has_transfer is unchecked
      if (transferCount === 0 && $("#id_has_transfer").prop("checked")) {
        $("#id_has_transfer").prop("checked", false);
        toggleTransferFields();
      }
    });
  });
})(django.jQuery);
