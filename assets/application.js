// Put your application javascript here
$(document).ready(function () {
  let onQuantityButtonCLick = function (event) {
    // alert("Button Clicked");
    let $button = $(this),
      $form = $button.closest("form"),
      $quantity = $form.find(".js-quantity-field"),
      quantityValue = parseInt($quantity.val()),
      max = $quantity.attr("max") ? parseInt($quantity.attr("max")) : null;

    if ($button.hasClass("plus")) {
      $quantity.val(quantityValue + 1).change();
    } else if ($button.hasClass("minus")) {
      $quantity.val(quantityValue - 1).change();
    }
  };

  let onQuantityFieldChange = function (event) {
    let $field = $(this),
      $form = $field.closest("form"),
      $quantityText = $form.find(".js-quantity-text"),
      shouldDisableMinus = parseInt(this.value) === 1,
      shouldDisablePlus = parseInt(this.value) === parseInt($field.attr("max")),
      $minusButton = $form.find(".js-quantity-button.minus"),
      $plusButton = $form.find(".js-quantity-button.plus");

    $quantityText.text(this.value);

    if (shouldDisableMinus) {
      $minusButton.prop("disabled", true);
    } else if ($minusButton.prop("disabled") === true) {
      $minusButton.prop("disabled", false);
    }

    if (shouldDisablePlus) {
      $plusButton.prop("disabled", true);
    } else if ($plusButton.prop("disabled") === true) {
      $plusButton.prop("disabled", false);
    }
  };

  let onVariantRadioChange = function (event) {
    let $radio = $(this),
      $form = $radio.closest("form"),
      max = $radio.attr("data-inventory-quantity"),
      $quantity = $form.find(".js-quantity-field"),
      $addToCartButton = $form.find("#add-to-cart-button");

    if ($addToCartButton.prop("disabled") === true) {
      $addToCartButton.prop("disabled", false);
    }
    $quantity.attr("max", max);

    if (parseInt($quantity.val()) > max) {
      $quantity.val(max).change();
    }
  };

  let onAddToCart = function (event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "/cart/add.js",
      data: $(this).serialize(),
      dataType: "json",
      success: onCartUpdated,
      error: onError,
    });
  };

  let onLineRemoved = function (event) {
    event.preventDefault();
    let $removeLink = $(this);
    let removeQuery = $removeLink.attr("href").split("change?")[1];

    $.post("/cart/change.js", removeQuery, onCartUpdated, "json");
  };

  let onCartUpdated = function () {
    $.ajax({
      type: "GET",
      url: "/cart",
      context: document.body,
      success: function (context) {
        let $dataCartContents = $(context).find(".js-cart-page-contents");
        let dataCartHTML = $dataCartContents.html();
        let dataCartItemCount = $dataCartContents.attr("data-cart-item-count");
        let $miniCartContents = $(".js-mini-cart-contents");
        let $cartItemCount = $(".js-cart-item-count");

        $cartItemCount.text(dataCartItemCount);
        $miniCartContents.html(dataCartHTML);

        if (parseInt(dataCartItemCount) > 0) {
          openCart();
        } else {
          closeCart();
        }
      },
    });
  };

  let onError = function (XMLHTTPRequest, textStatus) {
    let data = XMLHTTPRequest.responseJSON;
    alert(data.status + " - " + data.message + ": " + data.description);
  };

  let openCart = function () {
    $("html").addClass("mini-cart-open");
  };

  let closeCart = function () {
    $("html").removeClass("mini-cart-open");
  };

  let onCartButtonClick = function (event) {
    event.preventDefault();

    let isCartOpen = $("html").hasClass("mini-cart-open");

    if (!isCartOpen) {
      openCart();
    } else {
      closeCart();
    }
  };

  $(document).on("click", ".js-quantity-button", onQuantityButtonCLick);

  $(document).on("change", ".js-quantity-field", onQuantityFieldChange);

  $(document).on("change", ".js-variant-radio", onVariantRadioChange);

  $(document).on("submit", "#add-to-cart-form", onAddToCart);

  $(document).on("click", "#mini-cart .js-remove-line", onLineRemoved);

  $(document).on(
    "click",
    ".js-cart-link, #mini-cart .js-keep-shopping",
    onCartButtonClick
  );
});
