using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Kendo.Component.AdvancedSort.Mvc.Models
{
    public class GridComponentConfigModel
    {
        [Required(ErrorMessage = "GridName is required")]
        public string GridName { get; set; }

        public List<string> ExcludedColumn { get; set; }

        public string ButtonOpenSortStyle { get; set; }

        public string ButtonClearSortStyle { get; set; }

        public bool UseDefaultSortIconStyle { get; set; }

        public bool PreventAutoInitialize { get; set; }
    }
}
