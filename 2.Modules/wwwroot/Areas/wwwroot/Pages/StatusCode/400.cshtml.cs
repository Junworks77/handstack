﻿using Microsoft.AspNetCore.Mvc.RazorPages;

using HandStack.Web.Extensions;

namespace wwwroot.Areas.wwwroot.Pages.StatusCode
{
    public class _400Model : PageModel
    {
        public void OnGet()
        {
            string? custom2 = Request.GetParamData("custom2");
        }
    }
}
