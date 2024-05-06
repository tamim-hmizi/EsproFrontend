import { Component,OnInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { UserService } from 'src/app/demo/service/user.service'; 
@Component({
  selector: 'app-stats-component',
 // standalone: true,
 // imports: [],
  templateUrl: './stats-component.component.html',
  styleUrl: './stats-component.component.scss'
})
export class StatsComponentComponent implements OnInit{
  chart: any;
  enabledCount: number;
  disabledCount: number;
  constructor(private http: HttpClient,private userService: UserService) { }

  ngOnInit(): void {
    
    this.fetchStatss();
    this.fetchStats();
   this. grouping();
  }





  fetchStats() {
    this.userService.getEnabledAccountCount().subscribe(
        (data) => {
            this.enabledCount = data;
            if (this.enabledCount !== undefined && this.disabledCount !== undefined) 
       
           {this.renderChart();} 
        },
        (error) => {
            // Gérer les erreurs
            console.error("Une erreur s'est produite lors de la récupération du nombre de comptes activés :", error);
        }
    );
}


fetchStatss() {
  this.userService.getDisabledAccountCount().subscribe(
      (rep) => {
          this.disabledCount = rep;
          if (this.enabledCount !== undefined && this.disabledCount !== undefined) 
          {this.renderChart();}
      },
      (error) => {
          // Gérer les erreurs
          console.error("Une erreur s'est produite lors de la récupération du nombre de comptes activés :", error);
      }
  );
}





grouping(){


  this.userService.getUserCountByPosition().subscribe(
    (data: any[]) => {
      const positions = data.map(item => item[0]);
      const userCounts = data.map(item => item[1]);
      this.createChart(positions, userCounts);
    },
    error => {
      console.error('Error fetching user count by position:', error);
    }
  );

}createChart(positions: string[], userCounts: number[]): void {
  const colors = ['#616a78', '#2d3a8c', '#5a4f6e', '#298585', '#806716']; // Tableau de couleurs
  const repeatedColors = Array.from({ length: positions.length }, (_, index) => colors[index % colors.length]);

  // Création du graphique avec les données et les couleurs répétées
  this.chart = new Chart('userPositionChart', {
    type: 'bar',
    data: {
      labels: positions,
      datasets: [{
        label: 'Nombre d\'utilisateurs',
        data: userCounts,
        backgroundColor: repeatedColors, // Utilisation des couleurs répétées pour chaque barre
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Évolution du nombre d\'utilisateurs par position'
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          title: {
            display: true,
            text: 'Positions'
          }
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          title: {
            display: true,
            text: 'Nombre d\'utilisateurs'
          }
        }
      }
    }
  });
}



renderChart() {
  this.chart = new Chart('accountStatsChart', {
    type: 'doughnut',
    data: {
      labels: ['Comptes Activés', 'Comptes Désactivés'],
      datasets: [{
        label: 'Nombre de comptes',
        data: [this.enabledCount, this.disabledCount],
        backgroundColor: [
          'rgba(29, 145, 37,3)', // Rouge foncé pour les comptes activés
          'rgba(222, 38, 38, 3)'   // Vert foncé pour les comptes désactivés
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

 




 
  }
