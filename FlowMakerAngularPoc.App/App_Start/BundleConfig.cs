using System.Web.Optimization;

namespace FlowMakerAngularPoc.App
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            #region Scripts
            bundles.Add(new ScriptBundle("~/bundles/libs").Include(
                        "~/Scripts/jquery-3.1.1.js",
                        "~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularjs")
                .Include("~/Scripts/angular/angular.js")
                .Include("~/Scripts/angular/angular-sanitize.js")
                .Include("~/Scripts/angular/angular-cookies.js")
                .Include("~/Scripts/angular/angular-animate.js")
                .Include("~/Scripts/angular/angular-route.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular-ui").Include(
                        "~/Scripts/angular-ui/ui-bootstrap.js",
                        "~/Scripts/angular-ui/ui-bootstrap-tpls.js"));

            bundles.Add(new ScriptBundle("~/bundles/app")
                .Include("~/Scripts/app/wsConnect.js")
                .Include("~/Scripts/app/devActions.js")
                .Include("~/Scripts/app/app.js")
                .Include("~/Scripts/app/database.js")
                .Include("~/Scripts/app/directives.js")
                .Include("~/Scripts/app/forms-handle.js")
                .Include("~/Scripts/app/simul-actions.js")
                );

            #endregion

            #region CSS
            bundles.Add(new StyleBundle("~/Content/css")
                .Include("~/Content/ui-bootstrap-csp.css")
                .Include("~/Content/site.css"));

            #endregion
        }
    }
}