using FlowMakerAngularPoc.App.Models;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace FlowMakerAngularPoc.App.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }

}