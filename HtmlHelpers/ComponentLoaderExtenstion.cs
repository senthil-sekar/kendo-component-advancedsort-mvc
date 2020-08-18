using Kendo.Component.AdvancedSort.Mvc.Common;
using Kendo.Component.AdvancedSort.Mvc.Models;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace Kendo.Component.AdvancedSort.Mvc
{
    public static class ComponentLoaderExtenstion
    {
        #region Advanced Sort

        public static IHtmlString AdvancedSortFor(this HtmlHelper html, string gridName)
        {
            return html.AdvancedSortFor(gridName, null, null);
        }

        public static IHtmlString AdvancedSortFor(this HtmlHelper html, string gridName, object attributes)
        {
            return html.AdvancedSortFor(gridName, attributes, null);
        }

        public static IHtmlString AdvancedSortFor(this HtmlHelper html, string gridName, object attributes, List<string> excludedColumn)
        {
            if (string.IsNullOrEmpty(gridName))
                new MvcHtmlString(AppConstant.ErrorMissingGridName);

            var model = new GridComponentConfigModel
            {
                GridName = gridName,
                ExcludedColumn = excludedColumn ?? new List<string>(),
                UseDefaultSortIconStyle = false,
                PreventAutoInitialize = false
            };

            // bind attributes
            if (attributes != null)
            {
                model.ButtonOpenSortStyle = Convert.ToString(attributes.GetType()?.GetProperty("ButtonOpenSortStyle")?.GetValue(attributes));
                model.ButtonClearSortStyle = Convert.ToString(attributes.GetType()?.GetProperty("ButtonClearSortStyle")?.GetValue(attributes));
                model.UseDefaultSortIconStyle = Convert.ToBoolean(attributes.GetType()?.GetProperty("UseDefaultSortIconStyle")?.GetValue(attributes));
                model.PreventAutoInitialize = Convert.ToBoolean(attributes.GetType()?.GetProperty("PreventAutoInitialize")?.GetValue(attributes));
            }

            return html.Partial(AppConstant.ViewAdvancedSortToolStrip, model);
        }

        public static IHtmlString AdvancedSortSharedResource(this HtmlHelper html, object attributes = null)
        {
            // assing a flag, so we can use this to avoid printing common resources more than once
            // this is needed to support sort component in mutiple grids in the same page
            SetFlagToHttpContext(AppConstant.AdvancedSortSharedResourceKey);

            var model = new GridComponentConfigModel
            {
                UseDefaultSortIconStyle = false
            };

            // bind attributes
            if (attributes != null)
            {
                model.UseDefaultSortIconStyle = Convert.ToBoolean(attributes.GetType()?.GetProperty("UseDefaultSortIconStyle")?.GetValue(attributes));
            }

            return html.Partial(AppConstant.ViewAdvancedSortSharedResource, model);
        }

        #endregion Advanced Sort

        private static void SetFlagToHttpContext(string key)
        {
            var context = HttpContext.Current;
            if (!context.Items.Contains(key))
            {
                context.Items.Add(key, true);
            }
            else
            {
                context.Items[key] = false;
            }
        }
    }
}
