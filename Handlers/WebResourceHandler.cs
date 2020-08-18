using Kendo.Component.AdvancedSort.Mvc.Common;
using System;
using System.IO;
using System.Linq;
using System.Web;

namespace Kendo.Component.AdvancedSort.Mvc
{
    public class WebResourceHandler : IHttpHandler
    {
        /// <summary>
        /// You will need to configure this handler in the Web.config file of your 
        /// web and register it with IIS before being able to use it. For more information
        /// see the following link: https://go.microsoft.com/?linkid=8101007
        /// </summary>
        #region IHttpHandler Members

        public bool IsReusable
        {
            // Return false in case your Managed Handler cannot be reused for another request.
            // Usually this would be false in case you have some state information preserved per request.
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var resourceName = context.Request.QueryString[AppConstant.WebResourceQueryStringKey];

            if(string.IsNullOrEmpty(resourceName))
            {
                throw new ArgumentException(AppConstant.ErrorMissingResourceQueryParameter);
            }

            var embeddedResourceList = typeof(WebResourceLoaderExtension).Assembly.GetManifestResourceNames();
            var resolvedResourceName = embeddedResourceList.FirstOrDefault(x => x.EndsWith(resourceName));

            if (string.IsNullOrEmpty(resolvedResourceName))
            {
                throw new ArgumentException(AppConstant.ErrorResourceNotAvailable);
            }

            var assembly = typeof(WebResourceHandler).Assembly;

            using (Stream resourceStream = assembly.GetManifestResourceStream(resolvedResourceName))
            {
                context.Response.ContentType = ContentType(resourceName);

                byte[] buffer = new byte[4096];

                int byteseq = resourceStream.Read(buffer, 0, 4096);

                while (byteseq > 0)
                {
                    context.Response.OutputStream.Write(buffer, 0, byteseq);
                    byteseq = resourceStream.Read(buffer, 0, 4096);
                }
            }
        }

        private string ContentType(string resourceName)
        {
            string extension = Path.GetExtension(resourceName);

            switch(extension)
            {
                case ".js":
                    {
                        return "text/javascript";
                    }
                case ".css":
                    {
                        return "text/css";
                    }
            }

            return "text/plain";
        }

        #endregion
    }
}
