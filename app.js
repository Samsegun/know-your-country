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
          alpha3Code,
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
          alpha3Code,
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

// client-height
let clientHeight;

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
        <h3 class="region">Region: <span class="info">${
          country.region
        }</span></h3>
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

        // for window scrolling
        clientHeight = country.parentElement.offsetTop;

        let targetCountry = countries.find(country => country.id === id);

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
              let countryName = countries.find(
                country => country.alpha3Code === border
              );

              if (
                country.previousElementSibling.classList.contains(
                  "dark-mode-element"
                )
              ) {
                result += `
              <button class="border-country-btn dark-mode-element">${countryName.name}</button>
              `;
              } else {
                result += `
                <button class="border-country-btn">${countryName.name}</button>
                `;
              }
            }
            return result;
          }
        };

        detailsPageContent.innerHTML = this.articlePageContent(
          targetCountry,
          borderCountries,
          languages
        );

        mainPage.classList.toggle("close");
        detailsPage.classList.toggle("close");

        detailsPage.addEventListener("click", Event => {
          if (Event.target.classList.contains("border-country-btn")) {
            let newTargetCountry = countries.find(
              country => country.name === Event.target.textContent
            );

            const newBorderCountries = () => {
              let result = ``;
              if (newTargetCountry.borderCountries === undefined) {
                return "Not Available";
              } else {
                for (const border of newTargetCountry.borderCountries) {
                  let countryName = countries.find(
                    country => country.alpha3Code === border
                  );
                  if (
                    country.previousElementSibling.classList.contains(
                      "dark-mode-element"
                    )
                  ) {
                    result += `
                  <button class="border-country-btn dark-mode-element">${countryName.name}</button>
                  `;
                  } else {
                    result += `
                    <button class="border-country-btn">${countryName.name}</button>
                    `;
                  }
                }
                return result;
              }
            };

            const newLanguages = newTargetCountry.languages.map(
              eachLang => eachLang.name
            );

            detailsPageContent.innerHTML = this.articlePageContent(
              newTargetCountry,
              newBorderCountries,
              newLanguages
            );
          }
        });
      }
    });
  }

  articlePageContent(item, brdrCountries, langs) {
    return `
    <div class="image-container">
    <img src=${item.flag} alt="" class="country-flag" />
    </div>
    <div class="country-details">
      <h2>${item.name}</h2>
      <div class="country-profile">
        <div class="profile1">
          <h3>Native Name: <span class="info">${item.nativeName}</span></h3>
          <h3>Population: <span class="info">${
            item.population === 0
              ? "Uninhabited"
              : item.population.toLocaleString()
          }</span></h3>
          <h3>Region: <span class="info">${item.region}</span></h3>
          <h3>Sub Region: <span class="info">${item.subregion}</span></h3>
          <h3>Capital: <span class="info">${
            item.capital === undefined ? "Not Available" : item.capital
          }</span></h3>
        </div>
        <div class="profile2">
          <h3>Top Level Domain: <span class="info">${
            item.topLevelDomain
          }</span></h3>
          <h3>Currencies: <span class="info">${
            item.currency === undefined
              ? "Not Available"
              : item.currency[0].name
          }</span></h3>
          <h3>
            Languages: <span class="info">${langs.join(", ")}</span>
          </h3>
        </div>
      </div>
      <div class="borders">
        <h3>Border Countries:</h3>
        <div class="borders-country">
          ${brdrCountries()}
        </div>
      </div>
    </div>
    `;
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
  window.scrollTo({
    top: clientHeight - 120,
    behavior: "instant",
  });
});

form.addEventListener("submit", Event => {
  Event.preventDefault();
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

continents.addEventListener("click", Event => {
  if (Event.target.classList.contains("continent")) {
    const text = Event.target.textContent.toLowerCase();

    const countries = countriesDOM.querySelectorAll(".region .info");

    Array.from(countries).forEach(country => {
      const countryName = country.textContent.toLowerCase();

      if (countryName === text) {
        country.parentElement.parentElement.parentElement.style.display =
          "flex";
      } else {
        country.parentElement.parentElement.parentElement.style.display =
          "none";
      }
    });
  }
});
