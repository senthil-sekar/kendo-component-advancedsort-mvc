﻿namespace Kendo.Component.AdvancedSort.Mvc.Common
{
    public class AppConstant
    {
        public const string AdvancedSortSharedResourceKey = "LoadAdvancedSortSharedResource";
        public const string WebResourceQueryStringKey = "r";

        public const string WebResourceHandlerUrl = "~/KendoComponentMvcResource.axd?r={0}";
        public const string ViewAdvancedSortToolStrip = "~/Views/AdvancedSort/_AdvancedSortToolStrip.cshtml";
        public const string ViewAdvancedSortModal = "~/Views/AdvancedSort/_AdvancedSortModal.cshtml";
        public const string ViewAdvancedSortSharedResource = "~/Views/AdvancedSort/_AdvancedSortSharedResource.cshtml";

        public const string ErrorMissingGridName = "Error: GridName is required.";
        public const string ErrorMissingResourceName = "Error: ResourceName is required.";
        public const string ErrorMissingResourceQueryParameter = "Error: Missing ResourceName Query Parameter.";
        public const string ErrorResourceNotAvailable = "Error: Requested Resource Not Available.";
    }
}