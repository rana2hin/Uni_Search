// src/app/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ExternalLink, Mail, MapPin, GraduationCap, Users, Building2, Globe, CheckCircle2, CircleX } from "lucide-react";

// ---------------------------
// Types
// ---------------------------

type DegreeType = "Masters" | "PhD";

type Program = {
  subject: string;
  degreeType: DegreeType;
  degreeName: string;
  sessions: string[];
  students: number;
  fundingInternational: boolean;
  assistantship: boolean;
};

type University = {
  id: string;
  name: string;
  website: string;
  location: { city: string; county: string; state: string };
  address: string;
  gradCoordinatorEmail: string;
  programs: Program[];
};

// ---------------------------
// Constants
// ---------------------------

const SUBJECTS = [
  "Statistics",
  "Applied Statistics",
  "Data Science",
  "Biostatistics",
  "Mathematical Statistics",
  "Financial Statistics",
];

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
  "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

// Demo data (replace with NCES/IPEDS-backed dataset)
const UNIVERSITIES: University[] = [
  {
    id: "ucb",
    name: "University of California, Berkeley",
    website: "https://www.berkeley.edu/",
    location: { city: "Berkeley", county: "Alameda", state: "California" },
    address: "200 California Hall, Berkeley, CA 94720 (sample)",
    gradCoordinatorEmail: "gradcoord@stat.berkeley.edu",
    programs: [
      { subject: "Statistics", degreeType: "Masters", degreeName: "MA in Statistics", sessions: ["Fall"], students: 120, fundingInternational: true, assistantship: true },
      { subject: "Statistics", degreeType: "PhD", degreeName: "PhD in Statistics", sessions: ["Fall"], students: 90, fundingInternational: true, assistantship: true },
      { subject: "Data Science", degreeType: "Masters", degreeName: "MIDS (Data Science)", sessions: ["Fall","Spring","Summer"], students: 300, fundingInternational: false, assistantship: false },
      { subject: "Biostatistics", degreeType: "PhD", degreeName: "PhD in Biostatistics", sessions: ["Fall"], students: 60, fundingInternational: true, assistantship: true },
    ]
  },
  {
    id: "utaustin",
    name: "The University of Texas at Austin",
    website: "https://www.utexas.edu/",
    location: { city: "Austin", county: "Travis", state: "Texas" },
    address: "110 Inner Campus Dr, Austin, TX 78712 (sample)",
    gradCoordinatorEmail: "gradcoord@stat.utexas.edu",
    programs: [
      { subject: "Statistics", degreeType: "Masters", degreeName: "MS in Statistics & Data Science", sessions: ["Fall","Spring"], students: 150, fundingInternational: true, assistantship: true },
      { subject: "Statistics", degreeType: "PhD", degreeName: "PhD in Statistics", sessions: ["Fall"], students: 70, fundingInternational: true, assistantship: true },
      { subject: "Applied Statistics", degreeType: "Masters", degreeName: "MS in Applied Statistics", sessions: ["Fall","Spring"], students: 80, fundingInternational: true, assistantship: false },
    ]
  },
  {
    id: "ncsu",
    name: "North Carolina State University",
    website: "https://www.ncsu.edu/",
    location: { city: "Raleigh", county: "Wake", state: "North Carolina" },
    address: "2101 Hillsborough St, Raleigh, NC 27695 (sample)",
    gradCoordinatorEmail: "gradcoord@stat.ncsu.edu",
    programs: [
      { subject: "Statistics", degreeType: "Masters", degreeName: "MS in Statistics", sessions: ["Fall","Spring"], students: 200, fundingInternational: true, assistantship: true },
      { subject: "Statistics", degreeType: "PhD", degreeName: "PhD in Statistics", sessions: ["Fall"], students: 120, fundingInternational: true, assistantship: true },
      { subject: "Biostatistics", degreeType: "Masters", degreeName: "MS in Biostatistics", sessions: ["Fall"], students: 60, fundingInternational: true, assistantship: true },
    ]
  },
  {
    id: "ufl",
    name: "University of Florida",
    website: "https://www.ufl.edu/",
    location: { city: "Gainesville", county: "Alachua", state: "Florida" },
    address: "355 Tigert Hall, Gainesville, FL 32611 (sample)",
    gradCoordinatorEmail: "gradcoord@stat.ufl.edu",
    programs: [
      { subject: "Statistics", degreeType: "Masters", degreeName: "MS in Statistics", sessions: ["Fall","Spring"], students: 140, fundingInternational: true, assistantship: true },
      { subject: "Biostatistics", degreeType: "PhD", degreeName: "PhD in Biostatistics", sessions: ["Fall"], students: 55, fundingInternational: true, assistantship: true },
      { subject: "Data Science", degreeType: "Masters", degreeName: "MS in Data Science", sessions: ["Fall","Spring","Summer"], students: 120, fundingInternational: false, assistantship: false },
    ]
  },
  {
    id: "columbia",
    name: "Columbia University",
    website: "https://www.columbia.edu/",
    location: { city: "New York", county: "New York", state: "New York" },
    address: "116th and Broadway, New York, NY 10027 (sample)",
    gradCoordinatorEmail: "gradcoord@stat.columbia.edu",
    programs: [
      { subject: "Statistics", degreeType: "Masters", degreeName: "MA in Statistics", sessions: ["Fall","Spring"], students: 400, fundingInternational: false, assistantship: false },
      { subject: "Statistics", degreeType: "PhD", degreeName: "PhD in Statistics", sessions: ["Fall"], students: 60, fundingInternational: true, assistantship: true },
      { subject: "Financial Statistics", degreeType: "Masters", degreeName: "MA in Financial Statistics", sessions: ["Fall"], students: 150, fundingInternational: false, assistantship: false },
    ]
  },
  {
    id: "umn",
    name: "University of Minnesota",
    website: "https://twin-cities.umn.edu/",
    location: { city: "Minneapolis", county: "Hennepin", state: "Minnesota" },
    address: "100 Church St SE, Minneapolis, MN 55455 (sample)",
    gradCoordinatorEmail: "gradcoord@stat.umn.edu",
    programs: [
      { subject: "Statistics", degreeType: "Masters", degreeName: "MS in Statistics", sessions: ["Fall","Spring"], students: 130, fundingInternational: true, assistantship: true },
      { subject: "Statistics", degreeType: "PhD", degreeName: "PhD in Statistics", sessions: ["Fall"], students: 80, fundingInternational: true, assistantship: true },
      { subject: "Biostatistics", degreeType: "Masters", degreeName: "MS in Biostatistics", sessions: ["Fall"], students: 70, fundingInternational: true, assistantship: true },
      { subject: "Biostatistics", degreeType: "PhD", degreeName: "PhD in Biostatistics", sessions: ["Fall"], students: 50, fundingInternational: true, assistantship: true },
    ]
  },
  {
    id: "umass",
    name: "University of Massachusetts Amherst",
    website: "https://www.umass.edu/",
    location: { city: "Amherst", county: "Hampshire", state: "Massachusetts" },
    address: "300 Massachusetts Ave, Amherst, MA 01003 (sample)",
    gradCoordinatorEmail: "gradcoord@stat.umass.edu",
    programs: [
      { subject: "Applied Statistics", degreeType: "Masters", degreeName: "MS in Applied Statistics", sessions: ["Fall","Spring"], students: 90, fundingInternational: true, assistantship: false },
      { subject: "Statistics", degreeType: "PhD", degreeName: "PhD in Statistics", sessions: ["Fall"], students: 45, fundingInternational: true, assistantship: true },
    ]
  },
  {
    id: "fsu",
    name: "Florida State University",
    website: "https://www.fsu.edu/",
    location: { city: "Tallahassee", county: "Leon", state: "Florida" },
    address: "600 W College Ave, Tallahassee, FL 32306 (sample)",
    gradCoordinatorEmail: "gradcoord@stat.fsu.edu",
    programs: [
      { subject: "Statistics", degreeType: "Masters", degreeName: "MS in Statistics", sessions: ["Fall","Spring"], students: 110, fundingInternational: true, assistantship: true },
      { subject: "Statistics", degreeType: "PhD", degreeName: "PhD in Statistics", sessions: ["Fall"], students: 40, fundingInternational: true, assistantship: true },
      { subject: "Data Science", degreeType: "Masters", degreeName: "MS in Data Science", sessions: ["Fall","Spring"], students: 100, fundingInternational: false, assistantship: false },
    ]
  },
  {
    id: "tamu",
    name: "Texas A&M University",
    website: "https://www.tamu.edu/",
    location: { city: "College Station", county: "Brazos", state: "Texas" },
    address: "400 Bizzell St, College Station, TX 77843 (sample)",
    gradCoordinatorEmail: "gradcoord@stat.tamu.edu",
    programs: [
      { subject: "Statistics", degreeType: "Masters", degreeName: "MS in Statistics", sessions: ["Fall","Spring"], students: 160, fundingInternational: true, assistantship: true },
      { subject: "Statistics", degreeType: "PhD", degreeName: "PhD in Statistics", sessions: ["Fall"], students: 90, fundingInternational: true, assistantship: true },
    ]
  },
  {
    id: "uw",
    name: "University of Washington",
    website: "https://www.washington.edu/",
    location: { city: "Seattle", county: "King", state: "Washington" },
    address: "1400 NE Campus Pkwy, Seattle, WA 98195 (sample)",
    gradCoordinatorEmail: "gradcoord@stat.washington.edu",
    programs: [
      { subject: "Biostatistics", degreeType: "Masters", degreeName: "MS in Biostatistics", sessions: ["Fall"], students: 100, fundingInternational: true, assistantship: true },
      { subject: "Biostatistics", degreeType: "PhD", degreeName: "PhD in Biostatistics", sessions: ["Fall"], students: 80, fundingInternational: true, assistantship: true },
      { subject: "Statistics", degreeType: "Masters", degreeName: "MS in Statistics", sessions: ["Fall","Spring"], students: 150, fundingInternational: true, assistantship: true },
    ]
  },
];

const DEGREE_MODES = [
  { key: "any", label: "Any" },
  { key: "masters", label: "Masters" },
  { key: "phd", label: "PhD" },
  { key: "both", label: "Both" },
] as const;

type DegreeMode = typeof DEGREE_MODES[number]["key"];

// ---------------------------
// Helpers
// ---------------------------

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function mailtoLink(email: string, uni: University, selectedSubjects: string[]) {
  const subject = encodeURIComponent(`Inquiry about graduate programs in ${selectedSubjects.length ? selectedSubjects.join(", ") : "Statistics"}`);
  const body = encodeURIComponent(
    `Hello Graduate Coordinator,\n\nI am interested in ${selectedSubjects.length ? selectedSubjects.join(", ") : "Statistics"} programs at ${uni.name}. Could you please share details on application timelines, funding for international students, assistantship opportunities, and admission requirements?\n\nThank you.\n`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

function hasBothForSubject(programs: Program[], subject: string) {
  const hasMS = programs.some(p => p.subject === subject && p.degreeType === "Masters");
  const hasPhD = programs.some(p => p.subject === subject && p.degreeType === "PhD");
  return hasMS && hasPhD;
}

function getMatchingPrograms(uni: University, selectedSubjects: string[], mode: DegreeMode): Program[] {
  const pool = selectedSubjects.length ? uni.programs.filter(p => selectedSubjects.includes(p.subject)) : uni.programs;
  if (mode === "any") return pool;
  if (mode === "masters") return pool.filter(p => p.degreeType === "Masters");
  if (mode === "phd") return pool.filter(p => p.degreeType === "PhD");
  if (mode === "both") {
    const subjects = Array.from(new Set(pool.map(p => p.subject)));
    const keepSubjects = subjects.filter(s => hasBothForSubject(pool, s));
    return pool.filter(p => keepSubjects.includes(p.subject));
  }
  return pool;
}

// ---------------------------
// UI Pieces
// ---------------------------

function StateMultiSelect({ selected, setSelected }: { selected: string[]; setSelected: (s: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const toggle = (state: string) => {
    setSelected(selected.includes(state) ? selected.filter(s => s !== state) : [...selected, state]);
  };
  const clearAll = () => setSelected([]);
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">States</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="truncate">{selected.length === 0 ? "Select one or more states" : `${selected.length} state${selected.length>1?"s":""} selected`}</span>
            <Globe className="h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-80" align="start">
          <Command>
            <CommandInput placeholder="Search states..." />
            <CommandList>
              <CommandEmpty>No states found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-64">
                  {STATES.map((s) => (
                    <CommandItem key={s} onSelect={() => toggle(s)}>
                      <div className="mr-2 flex h-4 w-4 items-center justify-center border rounded-sm">
                        {selected.includes(s) && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                      <span>{s}</span>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="flex items-center justify-between p-2 border-t">
            <Button variant="ghost" size="sm" onClick={clearAll}>Clear</Button>
            <Button size="sm" onClick={() => setOpen(false)}>Done</Button>
          </div>
        </PopoverContent>
      </Popover>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map(s => (
            <Badge key={s} className="flex items-center gap-1">
              {s}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggle(s)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function SubjectCheckboxes({ selected, setSelected }: { selected: string[]; setSelected: (s: string[]) => void }) {
  const toggle = (subject: string) => {
    setSelected(selected.includes(subject) ? selected.filter(s => s !== subject) : [...selected, subject]);
  };
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Subjects (Statistics-related)</Label>
      <div className="grid grid-cols-1 gap-2">
        {SUBJECTS.map((subj) => (
          <label key={subj} className="flex items-center gap-2">
            <Checkbox checked={selected.includes(subj)} onCheckedChange={() => toggle(subj)} />
            <span className="text-sm">{subj}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function DegreeModeTabs({ value, onChange }: { value: DegreeMode; onChange: (v: DegreeMode) => void }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Degree availability</Label>
      <Tabs value={value} onValueChange={(v) => onChange(v as DegreeMode)}>
        <TabsList className="grid grid-cols-4 w-full">
          {DEGREE_MODES.map(m => (
            <TabsTrigger key={m.key} value={m.key} className="text-xs">{m.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="text-xs text-muted-foreground leading-relaxed">
        <strong>Any</strong>: Masters or PhD. <strong>Both</strong>: University offers both for a subject.
      </p>
    </div>
  );
}

function ProgramRow({ p }: { p: Program }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border p-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          <span className="font-medium">{p.degreeName}</span>
          <Badge variant="secondary">{p.degreeType}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {p.fundingInternational ? (
            <Badge className="flex gap-1" variant="outline"><CheckCircle2 className="h-3 w-3"/> Intl. Funding</Badge>
          ) : (
            <Badge className="flex gap-1" variant="outline"><CircleX className="h-3 w-3"/> Intl. Funding</Badge>
          )}
          {p.assistantship ? (
            <Badge className="flex gap-1" variant="outline"><CheckCircle2 className="h-3 w-3"/> Assistantship</Badge>
          ) : (
            <Badge className="flex gap-1" variant="outline"><CircleX className="h-3 w-3"/> Assistantship</Badge>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground flex-wrap gap-2">
        <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {p.students} students</div>
        <div className="flex items-center gap-2"><CalendarRange className="h-4 w-4" /> {p.sessions.join(" · ")}</div>
      </div>
    </div>
  );
}

const CalendarRange = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cx("h-4 w-4", props.className)}>
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M8 14h8"/>
    <path d="M8 18h5"/>
  </svg>
);

function UniversityCard({ uni, programsForCard, selectedSubjects }: { uni: University; programsForCard: Program[]; selectedSubjects: string[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="h-full">
      <Card className="h-full flex flex-col rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-xl leading-tight flex items-center gap-2">
                <Building2 className="h-5 w-5"/>{uni.name}
              </CardTitle>
              <div className="mt-1 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                <MapPin className="h-4 w-4" /> {uni.location.city}, {uni.location.county} County, {uni.location.state}
              </div>
              <div className="mt-1 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                <span className="truncate">{uni.address}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end shrink-0">
              <Button asChild size="sm" variant="secondary" className="gap-1">
                <a className="inline-flex" href={uni.website} target="_blank" rel="noreferrer">
                  Visit website <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="sm" className="gap-1">
                <a className="inline-flex" href={mailtoLink(uni.gradCoordinatorEmail, uni, selectedSubjects)}>
                  Contact Grad Coordinator <Mail className="h-4 w-4"/>
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="grid gap-2">
            {programsForCard.map((p, idx) => (<ProgramRow key={idx} p={p} />))}
          </div>
        </CardContent>
        <CardFooter className="pt-0 mt-auto">
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(programsForCard.map(p => p.subject))).map(s => (
              <Badge key={s} variant="outline">{s}</Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// ---------------------------
// Main App Component
// ---------------------------

export default function App() {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Statistics"]);
  const [degreeMode, setDegreeMode] = useState<DegreeMode>("any");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return UNIVERSITIES.filter(uni => {
      if (selectedStates.length > 0 && !selectedStates.includes(uni.location.state)) return false;
      const programs = getMatchingPrograms(uni, selectedSubjects, degreeMode);
      if (programs.length === 0) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!uni.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [selectedStates, selectedSubjects, degreeMode, search]);

  const renderData = filtered.map(uni => ({
    uni,
    programsForCard: getMatchingPrograms(uni, selectedSubjects, degreeMode)
  }));

  const resetFilters = () => {
    setSelectedStates([]);
    setSelectedSubjects(["Statistics"]);
    setDegreeMode("any");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">NCES College Finder — Statistics Focus</h1>
            <p className="text-sm text-muted-foreground mt-1">Modern, interactive search for graduate programs in Statistics and related fields.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-2xl border p-4 md:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold flex items-center gap-2"><Globe className="h-4 w-4"/> Filters</h2>
              <Button variant="ghost" size="sm" onClick={resetFilters}>Reset</Button>
            </div>
            <Separator className="my-3"/>

            <div className="space-y-5">
              <StateMultiSelect selected={selectedStates} setSelected={setSelectedStates} />
              <SubjectCheckboxes selected={selectedSubjects} setSelected={setSelectedSubjects} />
              <DegreeModeTabs value={degreeMode} onChange={setDegreeMode} />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Search by University</Label>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type a university name..." />
              </div>

              {(selectedStates.length + selectedSubjects.length) > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Active Filters</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedStates.map(s => (
                      <Badge key={s} variant="secondary" className="flex items-center gap-1">
                        {s}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedStates(selectedStates.filter(st => st!==s))}/>
                      </Badge>
                    ))}
                    {selectedSubjects.map(s => (
                      <Badge key={s} variant="outline" className="flex items-center gap-1">
                        {s}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedSubjects(selectedSubjects.filter(ss => ss!==s))}/>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Results */}
          <main>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{renderData.length} universit{renderData.length === 1 ? "y" : "ies"} found</p>
              <div className="text-xs text-muted-foreground">Demo dataset — replace with NCES/IPEDS data</div>
            </div>

            {renderData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border rounded-2xl bg-white">
                <p className="text-sm text-muted-foreground">No universities match your filters.</p>
              </div>
            ) : (
              // ✅ One or Two columns only (responsive)
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {renderData.map(({ uni, programsForCard }) => (
                  <UniversityCard key={uni.id} uni={uni} programsForCard={programsForCard} selectedSubjects={selectedSubjects} />
                ))}
              </div>
            )}
          </main>
        </div>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Statistics Program Finder (Demo). For production, connect to NCES/IPEDS APIs or your curated dataset.</p>
        </footer>
      </div>
    </div>
  );
}
