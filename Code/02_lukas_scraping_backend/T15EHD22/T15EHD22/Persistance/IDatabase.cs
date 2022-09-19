using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using T15EHD22.Model;

namespace T15EHD22.Persistance
{
    public interface IDatabase
    {
        public void Add(Municipality municipality);
        public void Remove(Municipality municipality);

        public List<Municipality> GetAll();
        public Municipality Get(string guid);
    }
}
