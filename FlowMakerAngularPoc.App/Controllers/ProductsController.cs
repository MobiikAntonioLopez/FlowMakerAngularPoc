using FlowMakerAngularPoc.App.Models;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace FlowMakerAngularPoc.App.Controllers
{
    public class ProductsController : ApiController
    {

        public IHttpActionResult GetProduct()
        {


            var product = new List<Product>
            {
                new Product { Id = 1, Name = "Tomato Soup", Category = "Groceries", Price = 1 },
                new Product { Id = 2, Name = "Yo-yo", Category = "Toys", Price = 3.75M },
                new Product { Id = 3, Name = "Hammer", Category = "Hardware", Price = 16.99M }

            };

            Thread.Sleep(2000);

            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }
    }
}
