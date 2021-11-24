// datas of country
let countryData;

// getting the countries
class Countries {
  async getCountries(mode) {
    try {
      let result = await fetch(`https://restcountries.com/v2/${mode}`);
      let data = await result.json();
      let id = 0;

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
        id++;

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
          id,
        };
      });
      return countries;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  createCountry(country) {
    const div = document.createElement("div");
    div.className = "country";
    div.innerHTML = `
      <img src=${country.flag} alt="country"/>
      <div class="country-info">
        <h2 class="country-name">${country.name}</h2>
        <h3>Population: <span class="info">${
          country.population === 0
            ? "Uninhabited"
            : country.population.toLocaleString()
        }</span></h3>
        <h3>Region: <span class="info">${country.region}</span></h3>
        <h3>Capital: <span class="info">${
          country.capital === undefined ? "Not Available" : country.capital
        }</span></h3>
      </div>
      <div class = "details" id = ${country.id}></div>
      `;
    countriesDOM.append(div);
  }

  displayCountries(countries) {
    countries.forEach(country => this.createCountry(country));
  }

  onCountries(countries) {
    countriesDOM.addEventListener("click", Event => {
      if (Event.target.classList.contains("details")) {
        let country = Event.target;
        let id = parseInt(country.id);

        console.log(countries);
        console.log(id);
        let targetCountry = countries.find(country => country.id === id);
        console.log(targetCountry);

        // for inconsistencies in languages & borderCountries data structure
        const languages = targetCountry.languages.map(
          eachLang => eachLang.name
        );

        const borderCountries = () => {
          let result = ``;
          if (targetCountry.borderCountries === undefined) {
            return "Not Available";
          } else {
            for (const border of targetCountry.borderCountries) {
              if (
                country.previousElementSibling.classList.contains(
                  "dark-mode-element"
                )
              ) {
                result += `
              <button class="border-country-btn dark-mode-element">${border}</button>
              `;
              } else {
                result += `
                <button class="border-country-btn">${border}</button>
                `;
              }
            }
            return result;
          }
        };

        detailsPageContent.innerHTML = `
        <div class="image-container">
        <img src=${targetCountry.flag} alt="" class="country-flag" />
        </div>
        <div class="country-details">
          <h2>${targetCountry.name}</h2>
          <div class="country-profile">
            <div class="profile1">
              <h3>Native Name: <span class="info">${
                targetCountry.nativeName
              }</span></h3>
              <h3>Population: <span class="info">${
                targetCountry.population === 0
                  ? "Uninhabited"
                  : targetCountry.population.toLocaleString()
              }</span></h3>
              <h3>Region: <span class="info">${targetCountry.region}</span></h3>
              <h3>Sub Region: <span class="info">${
                targetCountry.subregion
              }</span></h3>
              <h3>Capital: <span class="info">${
                targetCountry.capital === undefined
                  ? "Not Available"
                  : targetCountry.capital
              }</span></h3>
            </div>
            <div class="profile2">
              <h3>Top Level Domain: <span class="info">${
                targetCountry.topLevelDomain
              }</span></h3>
              <h3>Currencies: <span class="info">${
                targetCountry.currency === undefined
                  ? "Not Available"
                  : targetCountry.currency[0].name
              }</span></h3>
              <h3>
                Languages: <span class="info">${languages.join(", ")}</span>
              </h3>
            </div>
          </div>
          <div class="borders">
            <h3>Border Countries:</h3>
            <div class="borders-country">
              ${borderCountries()}
            </div>
          </div>
        </div>
        `;

        // localStorage.setItem("main-page-scroll", countriesDOM.scrollWidth);
        mainPage.classList.toggle("close");
        detailsPage.classList.toggle("close");
      }
    });
  }
}

const domHandler = mode => {
  const countries = new Countries();
  const ui = new UI();
  darkMode.style.display = "none";

  // display countries
  countries
    .getCountries(mode)
    .then(countries => {
      ui.displayCountries(countries);
      countryData = [...countries];
    })
    .then(() => {
      darkMode.style.display = "block";
      ui.onCountries(countryData);
    });
};

document.addEventListener("DOMContentLoaded", domHandler.bind(this, "all"));

filterControlBtn.addEventListener("click", () => {
  filterDropDown.classList.toggle("slide-down");
  filterControlBtn.classList.toggle("rotate");
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
  returnBtn.classList.toggle("dark-mode-element");
  const borderCountries = document.querySelectorAll(".border-country-btn");
  borderCountries.forEach(border =>
    border.classList.toggle("dark-mode-element")
  );
});

returnBtn.addEventListener("click", Event => {
  detailsPage.classList.toggle("close");
  mainPage.classList.toggle("close");
  detailsPageContent.innerHTML = ``;
});

form.addEventListener("submit", Event => {
  Event.preventDefault();

  // const text = input.value.toLowerCase();

  // const countries = countriesDOM.querySelectorAll(".country-name");

  // Array.from(countries).forEach(country => {
  //   const countryName = country.textContent.toLowerCase();

  //   if (countryName.includes(text)) {
  //     country.parentElement.parentElement.style.display = "flex";
  //   } else {
  //     country.parentElement.parentElement.style.display = "none";
  //   }
  // });
});

// weird scroll-height behaviour
input.addEventListener("keyup", Event => {
  Event.preventDefault();

  const text = input.value.toLowerCase();

  const countries = countriesDOM.querySelectorAll(".country-name");

  Array.from(countries).forEach(country => {
    const countryName = country.textContent.toLowerCase();

    if (countryName.indexOf(text) != -1) {
      country.parentElement.parentElement.style.display = "flex";
    } else {
      country.parentElement.parentElement.style.display = "none";
    }
  });
});
