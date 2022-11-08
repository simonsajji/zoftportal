import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  currentPage: any;
  selectedPage: any;
  stationId: any = 1;
  _routeListener: any;
  showTasks: boolean = true;
  receivedActive: boolean = false;
  upcomingActive: boolean = false;
  myTaskClosed: boolean = true;
  windowHeight: number = 0;

  constructor(public router: Router, private route: ActivatedRoute) {
    this.windowHeight = window.outerHeight;
    this._routeListener = router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) this.setRouter();
    })
  }

  ngOnInit(): void {
  }

  showTask() {
    this.showTasks = !this.showTasks;
  }

  ngOnChanges(): void {
  }

  setRouter(): void{
    this.currentPage = this.route?.snapshot;
    this.selectedPage = this.currentPage._routerState.url;
    if (this.currentPage._routerState.url === '/homepage') this.selectedPage = 'home';
    else if (this.currentPage._routerState.url === '/receiving/tasks') this.selectedPage = 'tasks';
    else this.selectedPage = this.currentPage._routerState.url;
    if(this.currentPage?.queryParams?.type === 'Received') this.receivedActive = true;
    else this.receivedActive = false;
    if(this.currentPage?.queryParams?.type === 'Upcoming') this.upcomingActive = true;
    else this.upcomingActive = false;
  }

  navigate(path:any, queryParam:any): void {
    if(queryParam) this.router.navigate([path], {queryParams: { type: queryParam}});
    else this.router.navigate([path]);
  }

  changeMyTaskStatus(event:any): void{
    this.myTaskClosed = event;
  }

  ngOnDestroy() {
    this._routeListener.unsubscribe();
  }

}
