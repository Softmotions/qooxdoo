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

#package(dom)
#require(qx.sys.Client)
#use(qx.constant.Style)
#use(qx.constant.Core)
#use(qx.constant.Type)

************************************************************************ */

qx.OO.defineClass("qx.dom.DomStyle");

if (Boolean(document.defaultView) && Boolean(document.defaultView.getComputedStyle))
{
  qx.dom.DomStyle.getStylePropertySure = function(el, prop) { return !el ? null : el.ownerDocument ? el.ownerDocument.defaultView.getComputedStyle(el, qx.constant.Core.EMPTY)[prop] : el.style[prop]; };

  qx.dom.DomStyle.getStyleProperty = function(el, prop)
  {
    try
    {
      return el.ownerDocument.defaultView.getComputedStyle(el, qx.constant.Core.EMPTY)[prop];
    }
    catch(ex)
    {
      throw new Error("Could not evaluate computed style: " + el + "[" + prop + "]: " + ex);
    };
  };
}
else if (qx.sys.Client.isMshtml())
{
  qx.dom.DomStyle.getStyleProperty = function(el, prop)
  {
    try
    {
      return el.currentStyle[prop];
    }
    catch(ex)
    {
      throw new Error("Could not evaluate computed style: " + el + "[" + prop + "]: " + ex);
    };
  };

  qx.dom.DomStyle.getStylePropertySure = function(el, prop)
  {
    try
    {
      if (!el) {
        return null;
      };

      if (el.parentNode && el.currentStyle)
      {
        return el.currentStyle[prop];
      }
      else
      {
        var v1 = el.runtimeStyle[prop];

        if (v1 != null && typeof v1 != qx.constant.Type.UNDEFINED && v1 != qx.constant.Core.EMPTY) {
          return v1;
        };

        return el.style[prop];
      };
    }
    catch(ex)
    {
      throw new Error("Could not evaluate computed style: " + el + "[" + prop + "]: " + ex);
    };
  };
}
else
{
  qx.dom.DomStyle.getStylePropertySure = function(el, prop) { return !el ? null : el.style[prop]; };

  qx.dom.DomStyle.getStyleProperty = function(el, prop)
  {
    try
    {
      return el.style[prop];
    }
    catch(ex)
    {
      throw new Error("Could not evaluate computed style: " + el + "[" + prop + "]");
    };
  };
};


qx.dom.DomStyle.getStyleSize = function(el, prop) { return parseInt(qx.dom.DomStyle.getStyleProperty(el, prop)) || 0; };


// Properties
qx.dom.DomStyle.getMarginLeft    = function(el) { return qx.dom.DomStyle.getStyleSize(el, qx.constant.Style.PROPERTY_MARGINLEFT); };
qx.dom.DomStyle.getMarginTop     = function(el) { return qx.dom.DomStyle.getStyleSize(el, qx.constant.Style.PROPERTY_MARGINTOP); };
qx.dom.DomStyle.getMarginRight   = function(el) { return qx.dom.DomStyle.getStyleSize(el, qx.constant.Style.PROPERTY_MARGINRIGHT); };
qx.dom.DomStyle.getMarginBottom  = function(el) { return qx.dom.DomStyle.getStyleSize(el, qx.constant.Style.PROPERTY_MARGINBOTTOM); };

qx.dom.DomStyle.getPaddingLeft   = function(el) { return qx.dom.DomStyle.getStyleSize(el, qx.constant.Style.PROPERTY_PADDINGLEFT); };
qx.dom.DomStyle.getPaddingTop    = function(el) { return qx.dom.DomStyle.getStyleSize(el, qx.constant.Style.PROPERTY_PADDINGTOP); };
qx.dom.DomStyle.getPaddingRight  = function(el) { return qx.dom.DomStyle.getStyleSize(el, qx.constant.Style.PROPERTY_PADDINGRIGHT); };
qx.dom.DomStyle.getPaddingBottom = function(el) { return qx.dom.DomStyle.getStyleSize(el, qx.constant.Style.PROPERTY_PADDINGBOTTOM); };

qx.dom.DomStyle.getBorderLeft    = function(el) { return qx.dom.DomStyle.getStyleProperty(el, "borderLeftStyle")   == qx.constant.Core.NONE ? 0 : qx.dom.DomStyle.getStyleSize(el, "borderLeftWidth"); };
qx.dom.DomStyle.getBorderTop     = function(el) { return qx.dom.DomStyle.getStyleProperty(el, "borderTopStyle")    == qx.constant.Core.NONE ? 0 : qx.dom.DomStyle.getStyleSize(el, "borderTopWidth"); };
qx.dom.DomStyle.getBorderRight   = function(el) { return qx.dom.DomStyle.getStyleProperty(el, "borderRightStyle")  == qx.constant.Core.NONE ? 0 : qx.dom.DomStyle.getStyleSize(el, "borderRightWidth"); };
qx.dom.DomStyle.getBorderBottom  = function(el) { return qx.dom.DomStyle.getStyleProperty(el, "borderBottomStyle") == qx.constant.Core.NONE ? 0 : qx.dom.DomStyle.getStyleSize(el, "borderBottomWidth"); };
