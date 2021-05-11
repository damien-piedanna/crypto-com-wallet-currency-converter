(function() {
  "use strict";
  let bitcoinprice;
  let currency = "USD";
  let tableLoaded = false;
  let nbtable = 0;

  $(document).ready(function() {
    fetchBitcoinPriceAndInit();
  });

  async function fetchBitcoinPriceAndInit() {
    $.ajax({
      type: "GET",
      url: "https://blockchain.info/ticker",
      success: function (data) {
        console.log(data);
        bitcoinprice = data;
        init();
      }
    });
  }

  function init() {
    let whilenotexist = setInterval(function() {
      let rows = $('table.e-table__body > tbody > tr');
      if (rows.length) {
        if (!tableLoaded) {
          updateTable(rows);
          tableLoaded = true;
        }
      } else {
        tableLoaded = false;
      }
    }, 500);
  }

  function updateTable(rows) {
    nbtable++;
    let select = $('<select id="currency-selector"><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="BTC">BTC</option></select>').on('change', function() {
      currency = this.value;
      updateRows($('table.e-table__body > tbody > tr'));
    });
    $('th.e-table-' + nbtable + '_column_' + ((6*nbtable)-1) + ' > .cell > .sortable').html('‏‏‎ <span class="caret-wrapper"><i class="sort-caret ascending "></i><i class="sort-caret descending "></i></span>').before(select);
    updateRows(rows);
  }

  function updateRows(rows) {
    rows.each(function() {
      let column = $(this).find('.e-table-' + nbtable + '_column_' + ((6*nbtable)-1));
      column.find('.converted-value').remove();

      let amount = currency == "BTC" ? column.find('.cell').html() : Math.round((column.find('.cell').html() * bitcoinprice[currency]['last']) * 10) / 10;
      let convertedCell = '<div class="cell converted-value">' + amount + '</div>';
      column.append(convertedCell);

      column.find('.cell').first().hide().bind('DOMSubtreeModified', function() {
        let amount = currency == "BTC" ? column.find('.cell').html() : Math.round((column.find('.cell').html() * bitcoinprice[currency]['last']) * 10) / 10;
        let convertedCell = '<div class="cell converted-value">' + amount + '</div>';
        column.find('.converted-value').html(convertedCell);
      });

    });
  }
})();
