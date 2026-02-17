export type NavItem = {
    title: string;
    slug: string;
    children?: NavItem[];
};

export const navigationConfig: NavItem[] = [
    {
        title: "1. Letnik",
        slug: "1-letnik",
        children: [
            {
                title: "Merjenje in merske napake",
                slug: "merjenje-in-merske-napake",
                children: [],
            },
            {
                title: "Kinematika",
                slug: "kinematika",
                children: [
                    { title: "Premo enakomerno gibanje", slug: "premo-enakomerno-gibanje" },
                    { title: "Enakomerno pospešeno gibanje", slug: "enakomerno-pospeseno-gibanje" },
                    { title: "Prosti pad in navpični met", slug: "prosti-pad" },
                    { title: "Relativno gibanje", slug: "relativno-gibanje" },
                    { title: "Vodoravni met", slug: "vodoravni-met" },
                    { title: "Navpični met (izbirno)", slug: "navpicni-met" },
                    { title: "Enakomerno kroženje", slug: "enakomerno-krozenje" },
                ],
            },
            {
                title: "Sila",
                slug: "sila",
                children: [],
            },
            {
                title: "Tlak in navor",
                slug: "tlak-in-navor",
                children: [],
            },
            {
                title: "II. Newtonov zakon",
                slug: "newtonov-zakon",
                children: [],
            },
        ],
    },
    {
        title: "2. Letnik",
        slug: "2-letnik",
        children: [
            {
                title: "Zgradba snovi in temperatura",
                slug: "termodinamika",
                children: [
                    { title: "Plinski zakoni", slug: "plinski-zakoni" },
                    { title: "Splošna plinska enačba", slug: "splosna-plinska-enacba" },
                ],
            },
        ],
    },
    {
        title: "3. Letnik",
        slug: "3-letnik",
        children: [],
    },
    {
        title: "4. Letnik",
        slug: "4-letnik",
        children: [],
    },
];
