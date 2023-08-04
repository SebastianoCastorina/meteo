import { Component } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';
import { IGeneral } from 'src/app/models/weather/general';
import { ISearchedCity } from 'src/app/models/weather/searched-city';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  city!: IGeneral;
  day!: Date[];
  searchedCity!: string;
  cityUrl!: string;
  favourites: IGeneral[] = [];
  favouriteButton: string = 'Add To Favourites';

  constructor(private weatherSvc: WeatherService) {}

  getCity(url: string) {
    this.weatherSvc.getCity(url).subscribe((city) => {
      return (this.weatherSvc.searchedCity = city as ISearchedCity[]);
    });
  }

  takeUrl(city: string) {
    this.cityUrl =
      'http://api.openweathermap.org/geo/1.0/direct?q=' +
      city +
      '&limit=5&appid=';
    this.getCity(this.cityUrl);
    this.weatherSvc
      .getWeather(
        'http://api.openweathermap.org/data/2.5/forecast?lat=' +
          this.weatherSvc.searchedCity[0].lat +
          '&lon=' +
          this.weatherSvc.searchedCity[0].lon +
          '&appid=&units=metric'
      )
      .subscribe((city) => {
        this.city = city as IGeneral;
        this.city.list.splice(4, this.city.list.length);
        if (this.favourites.includes(city as IGeneral)) {
          this.favouriteButton = 'Remove From Favourites';
        } else {
          this.favouriteButton = 'Add To Favourites';
        }
        this.day = [];
        this.city.list.forEach((el) => {
          this.day.push(new Date(el.dt * 1000));
        });
      });
  }

  addToFavourites(city: IGeneral) {
    if (this.favourites.includes(city)) {
      this.favourites = this.favourites.filter((el) => el != city);
      this.weatherSvc.favourites = this.favourites;
      this.favouriteButton = 'Add From Favourites';
    } else {
      this.favourites.push(city);
      this.weatherSvc.favourites = this.favourites;
      this.favouriteButton = 'Remove From Favourites';
      console.log(this.weatherSvc.favourites);
    }
  }
}
