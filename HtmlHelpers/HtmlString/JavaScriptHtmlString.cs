using Kendo.Component.AdvancedSort.Mvc.Common;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;

namespace Kendo.Component.AdvancedSort.Mvc
{
    public class JavaScriptHtmlString : IHtmlString
    {
        public JavaScriptHtmlString(string path)
        {
            _path = path;
            _deferred = false;
        }

        public string ToHtmlString()
        {
            if (string.IsNullOrEmpty(_path))
            {
                new MvcHtmlString(AppConstant.ErrorMissingResourceName);
            }

            if (_deferred)
            {
                return Scripts
                    .RenderFormat(@"<script src='{0}' defer></script>", _path)
                    .ToHtmlString();
            }

            return Scripts
                .Render(_path)
                .ToHtmlString();
        }

        public JavaScriptHtmlString Deferred(bool deffered)
        {
            _deferred = deffered;
            return this;
        }

        private bool _deferred { get; set; }

        private string _path { get; set; }
    }
}