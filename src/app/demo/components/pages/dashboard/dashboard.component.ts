import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { PublicationService } from 'src/app/demo/service/Publication.service';
import { RDIMemberService } from 'src/app/demo/service/rdi-member.service'; // Import the RDIMemberService

import { RDIService } from 'src/app/demo/service/RDI.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html', // Votre template HTML
  styleUrls: ['./dashboard.component.css'],
  animations: [
    // Animation pour le premier chercheur (gagnant)
    trigger('winnerAnimation', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', [animate('1.5s ease-in-out')]),
    ]),
    // Animation pour les barres de progression
    trigger('progressAnimation', [
      state('void', style({ width: '0%' })),
      state('*', style({ width: '{{percentage}}%' }), { params: { percentage: 0 } }),
      transition(':enter', [animate('1s ease-in-out')]),
    ]),
  ],
})

export class DashboardComponent implements OnInit {
  topRDIMembers: any[] = []; // Liste des 10 RDI Members les plus actifs
  fields: string[] = ['Biology', 'Chemistry', 'Physics', 'Mathematics']; // Champs de recherche
  selectedField = 'All Fields'; // Champ sélectionné par défaut
  barData: any;  // Chart data
  barOptions: any;  // Chart options
  publicationsByMonth:any[];
  publicationsnotrdi:any[];
  totalRDIs: number = 0;
  pieData: any;
  pieOptions: any;
  constructor(private publicationService: PublicationService,private RDIService :RDIService,private RDIMemberService: RDIMemberService,) {}
  num :number=0;
  numo :number=0;
  lineData: any;
  lineOptions: any;
  selectedDuration: string = '12 mois'; // Valeur par défaut pour le filtre de durée
  totalMembers: number = 0;
  percentageNewMembers: number = 0;
  notes: string[] = []; // Liste des notes
  newNote: string = ''; // Nouvelle note à ajouter

  addNote() {
    if (this.newNote.trim()) { // Vérifie que la note n'est pas vide
      this.notes.push(this.newNote); // Ajoute la note à la liste
      this.newNote = ''; // Réinitialise le champ d'entrée
    }
  }

  deleteNote(index: number) {
    this.notes.splice(index, 1); // Supprime la note par son index
  }
  ngOnInit(): void {
    this.fetchTopRDIMembers();
    this.initializeChart();
    this.initializeLineChart(this.selectedDuration); // Initialisation du graphique avec la durée par défaut
    this.RDIMemberService.getAllRDIMembers().subscribe((members) => {
        this.totalMembers = members.length; // Total des membres

        // Obtenir la date du début du mois dernier
        const today = new Date();
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        // Filtrer les membres ajoutés au cours du dernier mois
        const newMembersLastMonth = members.filter((member) => {
            const addedDate = new Date(member.dateP);
            return addedDate >= lastMonthStart && addedDate < thisMonthStart;
        });

        // Calculer le pourcentage des nouveaux membres ajoutés au cours du dernier mois
        if (this.totalMembers > 0) {
            this.percentageNewMembers = (newMembersLastMonth.length / this.totalMembers) * 100;
        }
    });
    this.RDIService.getAllRDIs().subscribe((rdis) => {
        this.totalRDIs = rdis.length; // Total des RDIs

    
    });
    this.RDIService.getAllRDIs().subscribe((rdis) => {
        const themes = rdis.map((rdi) => rdi.theme);
        const themeCount = {};
  
        // Compter le nombre de RDIs par thème
        themes.forEach((theme) => {
          if (!themeCount[theme]) {
            themeCount[theme] = 1;
          } else {
            themeCount[theme]++;
          }
        });
  
        // Créer les données pour le graphique en secteurs
        this.pieData = {
          labels: Object.keys(themeCount), // Les noms des thèmes
          datasets: [
            {
              data: Object.values(themeCount), // Les valeurs correspondantes
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40', // Ajoutez plus de couleurs si nécessaire
              ],
            },
          ],
        };
  
        // Options pour le graphique en secteurs
        this.pieOptions = {
          responsive: true,
          legend: {
            position: 'top',
          },
        };
      });
  }
  getAvatarColor(name: string): string {
    const index = Math.abs(this.hashString(name) % this.pastelColors.length);
    return this.pastelColors[index];
  }
  readonly pastelColors: string[] = [
    '#ffcccc', // Rouge clair
    '#ffddcc', // Orange clair
    '#ffecb3', // Jaune clair
    '#ccffcc', // Vert clair
    '#cceeff', // Bleu clair
    '#e1bee7', // Violet clair
    '#f8bbd0', // Rose clair
    '#d1c4e9', // Indigo clair
  ];
  
  // Fonction pour créer un hash à partir d'une chaîne (nom)
  hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char; // Décalage bitwise
      hash |= 0; // Convertir à 32 bits
    }
    return hash;
  }
  // Charge les publications pour l'année actuelle


  fetchTopRDIMembers() {
    this.publicationService.getTopRDIMembers().subscribe((members) => {
      this.topRDIMembers = members; // Store the fetched data in the component state
    });
  }

  calculateRating(rdiMember: any): number {
    // Convert difficulty score to a rating out of 5
    const maxDifficultyScore = this.topRDIMembers[0]?.difficultyScore || 100;
    return (rdiMember.difficultyScore / maxDifficultyScore) * 5;
  }

  initializeChart() {
    const RDIServices = new Set<string>();
    const publicationsByRDI: number[] = [];

    // Récupérer tous les RDIs
    this.RDIService.getAllRDIs().subscribe((rdi) => {
        if (!rdi || rdi.length === 0) {
            console.error("Aucun RDI récupéré");
            return;
        }

        const publicationsCount = new Map<string, number>();
        const publicationsCountno = new Map<string, number>();
        const   publicationsCountyes= new Map<string, number>();
        // Récupérer les publications par RDI
        const publicationPromises = rdi.map((r) => {
            const firstWord = r.theme;
            const rdiTheme = firstWord.split(" ")[0];

            RDIServices.add(rdiTheme);

            return this.publicationService.getPublicationsByRdiId(r.id).toPromise()
                .then((publications) => {
                    this.num=0;
                    this.numo=0;

                    publications.filter(p=>{p.chercheurs.filter(i=>{if ( i) {
                        if(i.rdi.id===r.id){this.num++;}else{
this.numo++;                    } 
                    } else {
                        console.log(`Aucune chercheur pour le thème ${p}`);
                    }})})
                        publicationsCountno.set(rdiTheme, this.num);
                        publicationsCountyes.set(rdiTheme, this.numo);
                    if (Array.isArray(publications) && publications.length > 0) {
                        publicationsCount.set(rdiTheme, publications.length);
                    } else {
                        console.log(`Aucune publication pour le thème ${rdiTheme}`);
                        publicationsCount.set(rdiTheme, 0);  // Valeur par défaut
                    }
                });
        });

        // Attendre que toutes les publications soient récupérées
        Promise.all(publicationPromises).then(() => {
            const labels = Array.from(RDIServices);
            const rdiDatano= labels.map((theme) => publicationsCountyes.get(theme) || 0);
            const rdiData = labels.map((theme) => publicationsCountno.get(theme) || 0);

            console.log("Données pour le graphique :", rdiData);
            console.log("Données pour le graphique :", rdiDatano);

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            this.barData = {
                labels,
                datasets: [
                    {
                        label: 'Publications par Membres de RDI',
                        backgroundColor: "#920808",
                        borderColor: "#920808",
                         data: rdiData,
                    },{
                        label: 'Publications par Membres d une autre RDI',
                    backgroundColor: "#8a4949",
                    borderColor: "#8a4949",
                    data: rdiDatano,
                    },
                ],
            };

            this.barOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: "#920808",  // couleur pour étiquettes de légende
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500,
                            },
                        },
                        grid: {
                            display: false,
                            drawBorder: false,
                        },
                    },
                    y: {
                        color: textColorSecondary,
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false,
                        },
                    },
                },
            };
        });
    });
}

  changeSelectedField(field: string): void {
    this.selectedField = field;
  }
  
  
durationOptions = [
    { label: '1 mois', value: '1 mois' },
    { label: '12 mois', value: '12 mois' },
    { label: '5 ans', value: '5 ans' },
];



// Méthode pour obtenir le score de difficulté pour chaque type de publication
onDurationChange(newDuration: string) {
    this.selectedDuration = newDuration; // Met à jour la durée sélectionnée
    this.initializeLineChart(newDuration); // Recharge le graphique
  }


labelsline:[]=[]
initializeLineChart(duration: string) {
  // Retrieve RDIs and create datasets
  this.RDIService.getAllRDIs().subscribe((rdis) => {
    const lineDataSets: any[] = []; // Initialize dataset array
    const activityPromises = rdis.map((rdi) => {
      // Fetch activity data for each RDI
      return this.publicationService.getActivityData(rdi.id, duration).toPromise().then((response) => {
        const activityByLabel = new Map<string, number>(); // Map to hold activity by label
        
        // Process response data
        const labels = response.labels; // Get labels
        const activityData = response.data; // Get activity data
        
        activityData.forEach((data, index) => {
          const label = labels[index]; // Get corresponding label
          const currentActivity = activityByLabel.get(label) || 0;
          activityByLabel.set(label, currentActivity + data); // Update activity data by label
        });

        // Create a new dataset for each RDI
        lineDataSets.push({
          label: `${rdi.theme} - Activité`, // Dataset label
          data: labels.map((label) => activityByLabel.get(label) || 0), // Populate dataset
          borderColor: this.getColorForRDI(rdi.theme), // Set border color
          fill: false, // No area fill
        });

        // Update labelsline if needed
        this.labelsline = labels;
      });
    });

    // Ensure all activity promises complete
    Promise.all(activityPromises).then(() => {
      // Set line data and line options for the chart
      this.lineData = {
        labels: this.labelsline, // Assign labels
        datasets: lineDataSets, // Assign datasets
      };

      this.lineOptions = {
        scales: {
          x: {
            ticks: {
              autoSkip: true, // Automatically skip ticks if needed
              maxTicksLimit: 5, // Limit the maximum ticks
            },
          },
          y: {
            beginAtZero: true, // Start Y-axis from zero
          },
        },
      };
    });
  });
}

  getColorForRDI(rdiTheme: string): string {
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
    ];
    const index = Math.abs(rdiTheme.charCodeAt(0) % colors.length);
    return colors[index];
  }
}  