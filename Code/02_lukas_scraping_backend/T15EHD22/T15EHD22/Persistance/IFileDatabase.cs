using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using T15EHD22.Model;

namespace T15EHD22.Persistance
{
    public class IFileDatabase : IDatabase
    {
        private const string FILE = @"C:\Users\Lukas Oberholzer\Documents\GitHub\t15ehd22b\T15EHD22\T15EHD22\bin\Debug\net6.0\persistance\municipalities.json";
        private List<Municipality> _municipalities = new List<Municipality>();

        public IFileDatabase()
        {
            try
            {
                _municipalities = JsonConvert.DeserializeObject<List<Municipality>>(File.ReadAllText(FILE));
            }
            catch (Exception)
            {
                _municipalities = new List<Municipality>();
            }
            if (_municipalities == null)
                _municipalities = new List<Municipality>();
        }

        public void Add(Municipality municipality)
        {
            if (_municipalities.Any(x => x.Guid == municipality.Guid))
            {
                Municipality existing = _municipalities.FirstOrDefault(x => x.Guid == municipality.Guid);
                existing.Links = municipality.Links;
            }
            else
            {
                _municipalities.Add(municipality);
            }
            File.WriteAllText(FILE, JsonConvert.SerializeObject(_municipalities));
        }

        public Municipality Get(string guid)
        {
            return _municipalities.FirstOrDefault(x => x.Guid == guid);
        }

        public List<Municipality> GetAll()
        {
            return _municipalities;
        }

        public void Remove(Municipality municipality)
        {
            _municipalities.Remove(municipality);
            File.WriteAllText(FILE, JsonConvert.SerializeObject(_municipalities));
        }
    }
}
