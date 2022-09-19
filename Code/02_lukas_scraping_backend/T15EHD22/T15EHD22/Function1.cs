using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using T15EHD22.Model;
using T15EHD22.Persistance;

namespace T15EHD22
{
    public class Function1
    {
        private readonly ILogger _logger;

        public Function1(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<Function1>();
        }


        [Function("UpdateMunicipalities")]
        public async Task<HttpResponseData> UpdateMunicipalities([HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "municipalities")] HttpRequestData req)
        {
            StreamReader reader = new StreamReader(req.Body);
            string text = reader.ReadToEnd();

            Municipality newMunicipality = JsonConvert.DeserializeObject<Municipality>(text);

            IDatabase db = new IFileDatabase();
            db.Add(newMunicipality);

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/plain; charset=utf-8");

            response.WriteString("OK");

            return response;
        }

        [Function("GetMunicipalities")]
        public async Task<HttpResponseData> GetMunicipalities([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "municipalities")] HttpRequestData req)
        {

            IDatabase db = new IFileDatabase();

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/json; charset=utf-8");

            response.WriteString(JsonConvert.SerializeObject(db.GetAll()));

            return response;
        }

        [Function("GetMunicipality")]
        public async Task<HttpResponseData> GetMunicipality([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "municipalities/{guid}")] HttpRequestData req, string guid)
        {
            IDatabase db = new IFileDatabase();

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/json; charset=utf-8");

            response.WriteString(JsonConvert.SerializeObject(db.Get(guid)));

            return response;
        }
    }
}
