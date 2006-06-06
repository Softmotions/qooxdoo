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

#package(font)
#require(qx.renderer.font.Font)

************************************************************************ */

qx.OO.defineClass("qx.renderer.font.FontCache");

qx.renderer.font.FontCache = function(propValue, propData)
{
  var propKey;
  var propKeyAsStyle = false;

  switch(typeof propValue)
  {
    case qx.constant.Type.STRING:
      if (propValue != qx.constant.Core.EMPTY)
      {
        propValue = propKey = propValue.toLowerCase();
        break;
      };

      return propValue;

    case qx.constant.Type.NUMBER:
      propKey = propValue.toString();
      break;

    case qx.constant.Type.OBJECT:
      if (propValue == null || propValue instanceof qx.renderer.font.Font) {
        return propValue;
      };

      // Try to detect array of RGB values
      if (typeof propValue.join === qx.constant.Type.FUNCTION)
      {
        propKey = propValue.join(qx.constant.Core.SPACE).toLowerCase();
        break;
      };

    default:
      return propValue;
  };

  if (qx.renderer.font.FontCache._data[propKey]) {
    return qx.renderer.font.FontCache._data[propKey];
  };

  return qx.renderer.font.FontCache._data[propKey] = qx.renderer.font.Font.fromString(propKey);
};

qx.renderer.font.FontCache._data = {};
