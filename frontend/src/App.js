import React, { Component } from 'react';
import FilterBar from './FilterBar';
import FilterModal from './FilterModal';
import PropertyCard from './PropertyCard';
import NoProperty from './NoProperty';
import { base_path } from './utils.js';

class App extends Component {
  state = {
    properties: [],
    sort: "none",
    filter: {
      gender: "none"
    },
    city_name: "Mumbai",
    loading: false
  };

  componentDidMount() {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const city = params.get('city') || "Mumbai";
    this.setState({ city_name: city }, () => {
      this.fetchProperties(city);
    });
  }

  fetchProperties = (cityName) => {
    this.setState({ loading: true });
    fetch(`${base_path}/api/get_properties_by_city.php?city=${encodeURIComponent(cityName)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseData => {
        this.setState({
          properties: Array.isArray(responseData) ? responseData : [],
          loading: false
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
        this.setState({ properties: [], loading: false });
      });
  };

  changeCity = (newCity) => {
    this.setState({ city_name: newCity });
    const url = new URL(window.location);
    url.searchParams.set('city', newCity);
    window.history.pushState({}, '', url);
    this.fetchProperties(newCity);
  };

  toggleInterested = property_id => {
    fetch(`${base_path}/api/toggle_interested.php?property_id=${property_id}`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.success) {
          this.updateInterested(property_id);
        } else if (!responseData.success && !responseData.is_logged_in) {
          if (window.$ && window.$("#login-modal").length) {
            window.$("#login-modal").modal("show");
          } else {
            alert("Please log in to mark this property as interested.");
          }
        }
      })
      .catch(error => {
        console.log('Error toggling interested', error);
      });
  };

  updateInterested = property_id => {
    let updated_properties = [...this.state.properties];
    updated_properties.forEach((property) => {
      if (property.id === property_id) {
        property.is_interested = !property.is_interested;
        if (property.is_interested) {
          property.interested_users_count++;
        } else {
          property.interested_users_count--;
        }
      }
    });

    this.setState({
      properties: updated_properties
    });
  };

  updateSort = sort => {
    this.setState({
      sort: sort
    });
  };

  updateFilter = gender => {
    this.setState({
      filter: {
        gender: gender
      }
    });
  };

  render() {
    let properties = [...this.state.properties];

    // Sorting
    if (this.state.sort !== "none") {
      if (this.state.sort === "desc") {
        properties.sort((a, b) => b.rent - a.rent);
      } else {
        properties.sort((a, b) => a.rent - b.rent);
      }
    }

    // Filter
    if (this.state.filter.gender !== "none") {
      properties = properties.filter(property =>
        property.gender === this.state.filter.gender
      );
    }

    let property_cards;
    if (this.state.loading) {
      property_cards = (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading properties in {this.state.city_name}...</p>
        </div>
      );
    } else if (properties.length > 0) {
      property_cards = properties.map(property => (
        <PropertyCard
          key={property.id}
          property={property}
          toggleInterested={() => this.toggleInterested(property.id)}
        />
      ));
    } else {
      property_cards = <NoProperty />;
    }

    const cities = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad"];
    const assetPrefix = base_path ? `${base_path}/` : process.env.PUBLIC_URL + '/';

    return (
      <>
        {/* Header Navigation */}
        <div className="header sticky-top">
          <nav className="navbar navbar-expand-md navbar-light">
            <a className="navbar-brand" href={base_path ? `${base_path}/index.php` : '/'}>
              <img src={`${assetPrefix}img/logo.png`} alt="PG Life Logo" style={{ height: "40px" }} />
            </a>
            <div className="navbar-nav ml-auto d-flex flex-row align-items-center">
              <span className="mr-3 text-muted d-none d-sm-inline">Select City:</span>
              <div className="btn-group" role="group">
                {cities.map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => this.changeCity(city)}
                    className={`btn btn-sm ${this.state.city_name === city ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb py-2">
            <li className="breadcrumb-item">
              <a href={base_path ? `${base_path}/index.php` : '/'}>Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {this.state.city_name}
            </li>
          </ol>
        </nav>

        <div className="page-container">
          <FilterBar
            currentSort={this.state.sort}
            updateSort={this.updateSort}
            currentFilter={this.state.filter}
          />

          {property_cards}
        </div>

        <FilterModal
          currentFilter={this.state.filter}
          updateFilter={this.updateFilter}
        />
      </>
    );
  }
}

export default App;
