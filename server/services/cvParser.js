const fs = require('fs');
const pdfParse = require('pdf-parse-mg');
const mammoth = require('mammoth');

const SKILLS_DB = {
  general: [
    'microsoft office','ms office','excel','word','powerpoint','outlook',
    'google workspace','google docs','google sheets','slides',
    'project management','teamwork','leadership','communication skills',
    'problem solving','analytical skills','critical thinking','time management',
    'presentation skills','report writing','data analysis','research skills',
    'autocad','matlab','python','java','c++','c programming','javascript',
    'sql','database','git','github','linux','windows',
    'technical writing','documentation','quality control','inspection',
  ],
  electrical: [
    'plc','scada','circuit design','pcb design','power systems','power distribution',
    'control systems','microcontroller','arduino','raspberry pi','embedded systems',
    'electrical wiring','transformer','motor control','relay','contactor',
    'solar panel','solar energy','inverter','battery systems','renewable energy',
    'electrical installation','testing and commissioning','single line diagram',
    'etap','proteus','multisim','ltspice','power electronics','drive systems',
    'earthing','grounding','switchgear','substation','transmission','voltage regulator',
  ],
  mechanical: [
    'solidworks','ansys','catia','inventor','fusion 360','revit',
    'thermodynamics','fluid mechanics','machine design','manufacturing processes',
    'welding','machining','cnc','cnc machining','lathe','milling','drilling',
    'hvac','refrigeration','air conditioning','pump selection','pump maintenance',
    'bearing','gear design','shaft design','cad cam','fea','cfd',
    'stress analysis','fatigue analysis','heat transfer','mass transfer',
    'preventive maintenance','predictive maintenance','boiler','compressor',
    'piping','pipeline','structural analysis','material selection',
  ],
  mining: [
    'surpac','whittle','datamine','vulcan','mineplan','maptek',
    'drilling','blasting','excavation','mineral processing','ore extraction',
    'ventilation','rock mechanics','slope stability','geostatistics',
    'underground mining','surface mining','open pit','strip mining',
    'tailings management','mine planning','mine design','surveying',
    'geology','mineral exploration','ore reserve','grade control',
    'dewatering','backfill','ground support','rock bolting',
  ],
  civil: [
    'autocad civil','civil 3d','revit','staad pro','etabs','sap2000','safe',
    'structural design','structural analysis','concrete design','steel design',
    'foundation design','soil mechanics','geotechnical','site investigation',
    'highway design','road design','drainage design','water supply',
    'surveying','total station','gps survey','leveling',
    'construction management','project planning','quantity surveying',
    'beam design','column design','slab design','retaining wall',
    'reinforced concrete','structural steel','load calculation',
  ],
  computer: [
    'programming','software development','web development','mobile development',
    'microcontroller','embedded systems','iot','internet of things',
    'python','java','c++','javascript','typescript','c#','php','rust','go',
    'html','css','react','node.js','django','flask','spring','angular','vue',
    'database','mysql','postgresql','mongodb','firebase','supabase',
    'networking','cybersecurity','linux','docker','git','ci cd',
    'algorithm','data structure','machine learning','artificial intelligence',
    'firmware','rtos','pcb design','fpga','verilog','vhdl',
    'arduino','raspberry pi','esp32','sensor integration','serial communication',
  ],
  chemical: [
    'process design','process simulation','aspen plus','hysys','chemcad',
    'distillation','heat exchanger','reactor design','catalysis',
    'mass transfer','fluid flow','piping design','process control',
    'plant design','plant operations','safety analysis','hazard analysis',
    'polymer','material science','corrosion','waste treatment',
    'quality assurance','laboratory','spectroscopy','chromatography',
    'chemical engineering','reaction engineering','separation processes',
    'thermodynamics','process optimization','pfd','p&id',
  ],
  petroleum: [
    'reservoir engineering','drilling engineering','production engineering',
    'petroleum engineering','well logging','well testing','completion',
    'eclipse','petrel','cmg','prosper','saphir',
    'upstream','downstream','midstream','refining','petrochemical',
    'enhanced oil recovery','eor','water flooding','gas injection',
    'formation evaluation','petrophysics','seismic interpretation',
    'well intervention','workover','artificial lift','esp','gas lift',
    'pipeline design','flow assurance','process safety','hse',
  ],
  aerospace: [
    'aerodynamics','propulsion','flight mechanics','aircraft design',
    'structural analysis','composites','avionics','flight control',
    'catia','ansys','nastran','patran','matlab','simulink',
    'jet engine','turbine','compressor','combustion','nozzle',
    'lift','drag','thrust','stall','flutter','fatigue',
    'certification','airworthiness','testing','simulation',
    'space systems','orbital mechanics','satellite','rocket',
  ],
  agricultural: [
    'irrigation','drainage','farm machinery','tractor','harvester',
    'post-harvest','food processing','food preservation','storage',
    'soil science','crop science','agronomy','plant breeding',
    'greenhouse','hydroponics','aquaponics','precision agriculture',
    'drip irrigation','sprinkler','pump selection','water management',
    'mechanization','automation','sensor','iot in agriculture',
    'agricultural processing','drying','milling','thresher',
  ],
  biomedical: [
    'medical devices','biomedical devices','prosthetics','orthotics',
    'biomaterials','tissue engineering','regenerative medicine',
    'diagnostic','therapeutic','imaging','mri','ct scan','x-ray','ultrasound',
    'sterilization','validation','regulatory','fda','iso 13485',
    'clinical engineering','hospital equipment','maintenance',
    'signal processing','biosensor','bioinstrumentation',
    'implant','wearable','health monitoring','electrocardiogram',
    'biocompatibility','quality system','risk management',
  ],
  geomatic: [
    'gis','arcgis','qgis','gps','gnss','rtk','surveying',
    'remote sensing','photogrammetry','lidar','laser scanning',
    'cartography','mapping','spatial analysis','geodesy',
    'cadastral','land survey','topographic','hydrographic',
    'coordinate system','datum','projection','georeferencing',
    'uav','drone mapping','point cloud','digital elevation model',
    'autocad civil','microstation','global mapper','erdas',
  ],
  materials: [
    'metallurgy','materials science','heat treatment','annealing',
    'quenching','tempering','normalizing','carburizing',
    'alloy','steel','aluminum','copper','titanium','composite',
    'polymer','ceramic','nanomaterial','coating','plating',
    'corrosion','corrosion protection','welding metallurgy',
    'tensile test','hardness test','impact test','fatigue test',
    'microstructure','xrd','sem','tem','optical microscopy',
    'material selection','failure analysis','fracture mechanics',
  ],
};

async function parseCV(filePath, mimetype, field) {
  let text = '';
  if (mimetype === 'application/pdf') {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    text = data.text;
  } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ path: filePath });
    text = result.value;
  } else {
    throw new Error('Unsupported file type. Upload PDF or DOCX.');
  }

  text = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  const lowerText = text.toLowerCase();

  // Extract skills
  const fieldSkills = (SKILLS_DB[field] || []).filter(s => lowerText.includes(s.toLowerCase()));
  const generalSkills = SKILLS_DB.general.filter(s => lowerText.includes(s.toLowerCase()));
  const allSkills = [...new Set([...fieldSkills, ...generalSkills])];

  // Split into sentences
  const sentences = text.split(/[.!?\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.split(/\s+/).length > 4);

  // Extract projects
  const projects = sentences
    .filter(s => /project|developed|designed|built|created|implemented|prototype|thesis|final year|research|constructed|fabricated/i.test(s))
    .map(s => s.length > 200 ? s.substring(0, 197) + '...' : s)
    .slice(0, 5);

  // Extract experience
  const experience = sentences
    .filter(s => /internship|intern|attachment|company|industry|worked at|employed|position|role|responsib|volunteer|assistant/i.test(s))
    .map(s => s.length > 200 ? s.substring(0, 197) + '...' : s)
    .slice(0, 4);

  return {
    text: text.substring(0, 4000),
    skills: allSkills,
    projects,
    experience,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
}

module.exports = { parseCV, SKILLS_DB };