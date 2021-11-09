const container = document.querySelector(".container");
const darkMode = document.querySelector(".dark-mode");
const header = document.querySelector("header");
const mainPage = document.querySelector(".main");
const input = document.querySelector(".input-text");
const filter = document.querySelector(".filter");
const filterControl = document.querySelector(".filter-control");
const filterControlSpan = document.querySelector(".filter-control span");
const filterDropDown = document.querySelector(".filter-dropdown");
const countriesDOM = document.querySelector(".countries");
const footer = document.querySelector("footer");

// getting the countries
class Countries {
  async getCountries() {
    try {
      let result = await fetch("https://restcountries.com/v2/all");
      let data = await result.json();

      let countries = data.map(country => {
        const {
          name,
          nativeName,
          flag,
          population,
          capital,
          region,
          subregion,
        } = country;
        const topLevelDomain = country.topLevelDomain;
        const currency = country.currencies;
        const languages = country.languages;
        const borderCountries = country.borders;

        return {
          name,
          nativeName,
          flag,
          population,
          capital,
          region,
          subregion,
          topLevelDomain,
          currency,
          languages,
          borderCountries,
        };
      });
      return countries;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  displayCountries(countries) {
    let count = 0;

    for (const country of countries) {
      const div = document.createElement("div");
      div.className = "country";
      div.innerHTML = `
      <img src=${country.flag} alt="country" />
      <div class="country-info">
        <h2>${country.name}</h2>
        <h3>Population: <span class="info">${country.population}</span></h3>
        <h3>Region: <span class="info">${country.region}</span></h3>
        <h3>Capital: <span class="info">${country.capital}</span></h3>
      </div>
      `;

      countriesDOM.append(div);
      count++;
      if (count > 100) {
        break;
      }
    }
  }

  getCountries() {
    const countries = [...document.querySelectorAll(".country")];
    // countries.forEach(country => {
    //   console.log(country);
    //   country.addEventListener("click",Event => {

    //   } )
    // });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const countries = new Countries();
  const ui = new UI();

  // display countries
  countries
    .getCountries()
    .then(countries => {
      ui.displayCountries(countries);
    })
    .then(() => {
      ui.getCountries();
    });
});

filterControl.addEventListener("click", () => {
  filterDropDown.classList.toggle("slide-down");
  filterControlSpan.classList.toggle("rotate");
});

darkMode.addEventListener("click", () => {
  container.classList.toggle("dark-mode-bg");
  header.classList.toggle("dark-mode-element");
  input.classList.toggle("dark-mode-element");
  filterControl.classList.toggle("dark-mode-element");
  filterDropDown.classList.toggle("dark-mode-element");
  const countryInfos = document.querySelectorAll(".country-info");
  countryInfos.forEach(country =>
    country.classList.toggle("dark-mode-element")
  );
});
