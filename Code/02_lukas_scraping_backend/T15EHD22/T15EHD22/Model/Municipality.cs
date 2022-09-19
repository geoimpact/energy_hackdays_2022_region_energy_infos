using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace T15EHD22.Model
{
    public class Municipality
    {
        public string Guid { get; set; }
        public string Source { get; set; }
        public string Name { get; set; }
        public List<Link> Links { get; set; } = new List<Link>();
    }
}
