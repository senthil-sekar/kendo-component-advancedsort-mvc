using Kendo.Component.AdvancedSort.Mvc.Common;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;

namespace Kendo.Component.AdvancedSort.Mvc
{
    public static class WebResourceLoaderExtension
    {
        public static JavaScriptHtmlString LoadJavaScript(this HtmlHelper html, string resourceName = null)
        {
            string path = FullyQualifiedUrl(resourceName);
            return new JavaScriptHtmlString(path);
        }

        public static IHtmlString LoadCss(this HtmlHelper html, string resourceName = null)
        {
            if (string.IsNullOrEmpty(resourceName))
            {
                new MvcHtmlString(AppConstant.ErrorMissingResourceName);
            }

            return Styles.Render(FullyQualifiedUrl(resourceName));
        }

        private static string FullyQualifiedUrl(string resourceName)
        {
            if (string.IsNullOrEmpty(resourceName))
                return string.Empty;
            return VirtualPathUtility.ToAbsolute(string.Format(AppConstant.WebResourceHandlerUrl, resourceName));
        }
    }
}