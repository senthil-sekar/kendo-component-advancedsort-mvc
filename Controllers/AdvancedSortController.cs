using Kendo.Component.AdvancedSort.Mvc.Common;
using System.Web.Mvc;

namespace Kendo.Component.AdvancedSort.Mvc.Controllers
{
    public class AdvancedSortController : Controller
    {
        [HttpGet]
        public ActionResult GetAdvancedSortPopup()
        {
            return PartialView(AppConstant.ViewAdvancedSortModal);
        }
    }
}
