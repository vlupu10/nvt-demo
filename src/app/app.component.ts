import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Time } from './time.model';
import { ClockService } from './clock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('hoursEl', {static: false}) hoursElement!: ElementRef<any>;
  @ViewChild('minutesEl', {static: false}) minutesElement!: ElementRef<any>;
  @ViewChild('secondsEl', {static: false}) secondsElement!: ElementRef<any>;
  title = 'clocks';
  currentTime: Time = {hours: 0, minutes: 0, seconds: 0};
  hours: number = 0;
  minutes: number = 0;
  seconds: string = '00';
  hoursStr: string = '00';
  minutesStr: string = '00';
  increaseHr: number = 0;
  increaseMin: number = 0;

  constructor(
    private readonly clockService: ClockService,
  ) {}

  ngOnInit(): void {
    this.clockService.getClock().subscribe(data => {
      let currentTime = '';
      currentTime = data.toLocaleTimeString('en-GB').replace(/PM|AM/, '');
      this.hours = parseInt(currentTime.substring(0,2)) + this.increaseHr;
      if (this.hours > 23) this.hours = this.hours - 24;
      this.minutes = parseInt(currentTime.substring(3,5)) + this.increaseMin;
      if (this.minutes > 59) this.minutes = this.minutes - 60;
      this.seconds = currentTime.substring(6,8);
      this.hoursStr = String(this.hours).length === 1 ? '0' + String(this.hours) : String(this.hours);
      this.minutesStr = String(this.minutes);
      this.minutesStr = String(this.minutes).length === 1 ? '0' + String(this.minutes) : String(this.minutes);
      this.setTime({
        hours: this.hours,
        minutes: this.minutes,
        seconds: parseInt(this.seconds)
      });
    });
  }

  rotate(element: { style: { transform: string; }; }, angle: number): void {
    angle = angle + 180;
    element.style.transform = 'rotate(' + angle + 'deg)';
  }

  setTime(time: Time): void {
    if(this.hoursElement) {
      if (time.hours > 12) {
        time.hours = time.hours - 12;
      }
      this.rotate(this.hoursElement.nativeElement, time.hours * 30 + Math.round(time.hours / 12));
    }
    if(this.minutesElement) {
      this.rotate(this.minutesElement.nativeElement, time.minutes * 6);
    }
    if(this.secondsElement) {
      this.rotate(this.secondsElement.nativeElement, time.seconds * 6);
    }
  }

  increaseHours(): void {
    this.increaseHr = this.increaseHr + 1;
  }

  increaseMinutes(): void {
    this.increaseMin = this.increaseMin + 1;
  }

  decreaseHours(): void {
    this.increaseHr = this.increaseHr - 1;
  }

  decreaseMinutes(): void {
    this.increaseMin = this.increaseMin - 1;
  }

  reset(): void {
    this.increaseHr = 0;
    this.increaseMin = 0;
  }
}
