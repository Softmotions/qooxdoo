/* ************************************************************************

   qooxdoo - the new era of web development

   Copyright:
     2004-2006 by Schlund + Partner AG, Germany
     All rights reserved

   License:
     LGPL 2.1: http://creativecommons.org/licenses/LGPL/2.1/

   Internet:
     * http://qooxdoo.org

   Authors:
     * Sebastian Werner (wpbasti)
       <sw at schlund dot de>
     * Andreas Ecker (ecker)
       <ae at schlund dot de>
     * Til Schneider (til132)
       <tilman dot schneider at stz-ida dot de>

************************************************************************ */

/* ************************************************************************

#package(table)
#require(qx.ui.table.AbstractDataCellRenderer)
#require(qx.manager.object.ImageManager)

************************************************************************ */

/**
 * A data cell renderer for boolean values.
 */
qx.OO.defineClass("qx.ui.table.BooleanDataCellRenderer", qx.ui.table.AbstractDataCellRenderer,
function() {
  qx.ui.table.AbstractDataCellRenderer.call(this);
});


// overridden
qx.Proto._getCellStyle = function(cellInfo) {
  var style = qx.ui.table.AbstractDataCellRenderer.prototype._getCellStyle(cellInfo);

  style += qx.ui.table.BooleanDataCellRenderer.MAIN_DIV_STYLE;

  return style;
};


// overridden
qx.Proto._getContentHtml = function(cellInfo) {
  var BooleanDataCellRenderer = qx.ui.table.BooleanDataCellRenderer;
  return BooleanDataCellRenderer.IMG_START + this._getImgUrl(cellInfo) + BooleanDataCellRenderer.IMG_END;
}


// overridden
qx.Proto.updateDataCellElement = function(cellInfo, cellElement) {
  cellElement.firstChild.src = this._getImgUrl(cellInfo);
};


/**
 * Returns the URL of the image to show.
 *
 * @param cellInfo {Map} The information about the cell.
 *        See {@link #createDataCellHtml}.
 * @return {string} the URL of the image to show.
 */
qx.Proto._getImgUrl = function(cellInfo) {
  var BooleanDataCellRenderer = qx.ui.table.BooleanDataCellRenderer;
  switch (cellInfo.value) {
    case true:  return BooleanDataCellRenderer.TRUE_ICON_URL; break;
    case false: return BooleanDataCellRenderer.FALSE_ICON_URL; break;
    default:    return BooleanDataCellRenderer.NULL_ICON_URL; break;
  }
};


qx.Proto._createCellStyle_array_join = function(cellInfo, htmlArr) {
  qx.ui.table.AbstractDataCellRenderer.prototype._createCellStyle_array_join(cellInfo, htmlArr);

  htmlArr.push(qx.ui.table.BooleanDataCellRenderer.MAIN_DIV_STYLE);
};


qx.Proto._createContentHtml_array_join = function(cellInfo, htmlArr) {
  var BooleanDataCellRenderer = qx.ui.table.BooleanDataCellRenderer;

  if (qx.ui.table.TablePane.USE_TABLE) {
    htmlArr.push(BooleanDataCellRenderer.TABLE_DIV);
    htmlArr.push(cellInfo.styleHeight - 2); // -1 for the border, -1 for the padding
    htmlArr.push(BooleanDataCellRenderer.TABLE_DIV_CLOSE);
  }

  htmlArr.push(BooleanDataCellRenderer.IMG_START);
  htmlArr.push(this._getImgUrl(cellInfo));
  htmlArr.push(BooleanDataCellRenderer.IMG_END);

  if (qx.ui.table.TablePane.USE_TABLE) {
    htmlArr.push(BooleanDataCellRenderer.TABLE_DIV_END);
  }
};


/** {string} The URL of the icon showing a true value. */
qx.ui.table.BooleanDataCellRenderer.TRUE_ICON_URL = qx.manager.object.ImageManager.buildUri("widgets/table/boolean-true.png");

/** {string} The URL of the icon showing a false value. */
qx.ui.table.BooleanDataCellRenderer.FALSE_ICON_URL = qx.manager.object.ImageManager.buildUri("widgets/table/boolean-false.png");

/** {string} The URL of the icon showing a null value. */
qx.ui.table.BooleanDataCellRenderer.NULL_ICON_URL = qx.manager.object.ImageManager.buildUri("core/blank.gif");


qx.Class.MAIN_DIV_STYLE = ';text-align:center;padding-top:1px';
qx.Class.IMG_START = '<img src="';
qx.Class.IMG_END = '"/>';

qx.Class.TABLE_DIV = '<div style="overflow:hidden;height:';
qx.Class.TABLE_DIV_CLOSE = 'px">';
qx.Class.TABLE_DIV_END = '</div>';
