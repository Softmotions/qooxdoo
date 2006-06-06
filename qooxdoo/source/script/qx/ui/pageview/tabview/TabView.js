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

************************************************************************ */

/* ************************************************************************

#package(tabview)

************************************************************************ */

qx.OO.defineClass("qx.ui.pageview.tabview.TabView", qx.ui.pageview.AbstractPageView, 
function() {
  qx.ui.pageview.AbstractPageView.call(this, qx.ui.pageview.tabview.TabViewBar, qx.ui.pageview.tabview.TabViewPane);
});





/*
---------------------------------------------------------------------------
  PROPERTIES
---------------------------------------------------------------------------
*/

qx.OO.changeProperty({ name : "appearance", type : qx.constant.Type.STRING, defaultValue : "tab-view" });

qx.OO.addProperty({ name : "alignTabsToLeft", type : qx.constant.Type.BOOLEAN, defaultValue : true });
qx.OO.addProperty({ name : "placeBarOnTop", type : qx.constant.Type.BOOLEAN, defaultValue : true });






/*
---------------------------------------------------------------------------
  MODIFIER
---------------------------------------------------------------------------
*/

qx.Proto._modifyAlignTabsToLeft = function(propValue, propOldValue, propData)
{
  var vBar = this._bar;

  vBar.setHorizontalChildrenAlign(propValue ? qx.constant.Layout.ALIGN_LEFT : qx.constant.Layout.ALIGN_RIGHT);

  // force re-apply of states for all tabs
  vBar._addChildrenToStateQueue();

  return true;
};

qx.Proto._modifyPlaceBarOnTop = function(propValue, propOldValue, propData)
{
  // This does not work if we use flexible zones
  // this.setReverseChildrenOrder(!propValue);

  var vBar = this._bar;

  // move bar around
  if (propValue) {
    vBar.moveSelfToBegin();
  } else {
    vBar.moveSelfToEnd();
  };

  // force re-apply of states for all tabs
  vBar._addChildrenToStateQueue();

  return true;
};
