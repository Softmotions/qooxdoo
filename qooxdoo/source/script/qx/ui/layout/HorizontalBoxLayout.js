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

#package(layout)

************************************************************************ */

qx.OO.defineClass("qx.ui.layout.HorizontalBoxLayout", qx.ui.layout.BoxLayout, 
function() {
  qx.ui.layout.BoxLayout.call(this, qx.constant.Layout.ORIENTATION_HORIZONTAL);
});
