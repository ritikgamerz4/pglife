import React, { Component } from 'react';
import FilterBar from './FilterBar';
import FilterModal from './FilterModal';
import PropertyCard from './PropertyCard';
import NoProperty from './NoProperty';
import Stars from './Stars';
import { base_path } from './utils.js';

class App extends Component {
  state = {
    currentView: "home", // "home" | "list" | "dashboard" | "detail"
    selectedPropertyId: 1,
    activeSlideIndex: 0,
    properties: [],
    sort: "none",
    filter: {
      gender: "none"
    },
    city_name: "Mumbai",
    searchInput: "",
    loading: false,
    interestedPropertyIds: [1, 6],

    // Auth State
    isLoggedIn: false,
    currentUser: null,
    showLoginModal: false,
    showSignupModal: false,
    loginEmail: "",
    loginPassword: "",
    loginError: "",
    loginLoading: false,
    signupFullName: "",
    signupPhone: "",
    signupEmail: "",
    signupPassword: "",
    signupCollege: "",
    signupGender: "male",
    signupError: "",
    signupLoading: false
  };

  allSampleProperties = [
    {
      id: 1,
      city_id: 2,
      cityName: "Mumbai",
      name: "Navkar Paying Guest",
      address: "44, Juhu Scheme, Juhu, Mumbai, Maharashtra 400058",
      description: "Furnished room with attached washroom, daily housekeeping, 3-course homestyle meals, and 24/7 security near Juhu beach and metro station.",
      gender: "male",
      rent: 9500,
      rating_clean: 4.2,
      rating_food: 3.8,
      rating_safety: 4.5,
      image: "img/properties/1/1d4f0757fdb86d5f.jpg",
      images: [
        "img/properties/1/1d4f0757fdb86d5f.jpg",
        "img/properties/1/46ebbb537aa9fb0a.jpg",
        "img/properties/1/eace7b9114fd6046.jpg"
      ],
      interested_users_count: 5
    },
    {
      id: 2,
      city_id: 2,
      cityName: "Mumbai",
      name: "Ganpati Paying Guest",
      address: "Police Station, 115, Sher-e-Punjab Colony, Andheri East, Mumbai 400093",
      description: "Spacious co-living PG with dedicated study desks, high-speed WiFi, gym access, and nutritious breakfast & dinner provided daily.",
      gender: "female",
      rent: 8500,
      rating_clean: 4.5,
      rating_food: 4.0,
      rating_safety: 4.8,
      image: "img/properties/2/1dcfc57947b5c712.jpg",
      images: [
        "img/properties/2/1dcfc57947b5c712.jpg",
        "img/properties/2/45109c3e5c063d21.jpg",
        "img/properties/2/46ebbb537aa9fb0a.jpg"
      ],
      interested_users_count: 4
    },
    {
      id: 3,
      city_id: 1,
      cityName: "Delhi",
      name: "PG for Girls Shree Radhe",
      address: "Plot no. 258/D4, Laxman Vihar, Phase 2, Delhi 110001",
      description: "Safe, well-maintained girls PG with biometric entrance, air-conditioned rooms, full power backup, and hygienic home-cooked meals.",
      gender: "female",
      rent: 11000,
      rating_clean: 4.7,
      rating_food: 4.3,
      rating_safety: 4.9,
      image: "img/properties/1/eace7b9114fd6046.jpg",
      images: [
        "img/properties/1/eace7b9114fd6046.jpg",
        "img/properties/1/1d4f0757fdb86d5f.jpg"
      ],
      interested_users_count: 6
    },
    {
      id: 4,
      city_id: 1,
      cityName: "Delhi",
      name: "Saxena Paying Guest",
      address: "H.No. 122, Block B, Hauz Khas, New Delhi 110016",
      description: "Premium student PG within walking distance of metro and markets. Includes high-speed internet, laundry, and round-the-clock water supply.",
      gender: "male",
      rent: 12500,
      rating_clean: 4.0,
      rating_food: 3.9,
      rating_safety: 4.2,
      image: "img/properties/1/46ebbb537aa9fb0a.jpg",
      images: [
        "img/properties/1/46ebbb537aa9fb0a.jpg",
        "img/properties/1/1d4f0757fdb86d5f.jpg"
      ],
      interested_users_count: 2
    },
    {
      id: 5,
      city_id: 3,
      cityName: "Bengaluru",
      name: "Youth Living Paying Guest",
      address: "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
      description: "Modern unisex co-living hub located in prime Indiranagar with high-speed internet, gaming zone, cafe lounge, and housekeeping.",
      gender: "unisex",
      rent: 14000,
      rating_clean: 4.6,
      rating_food: 4.4,
      rating_safety: 4.6,
      image: "img/properties/1/46ebbb537aa9fb0a.jpg",
      images: [
        "img/properties/1/46ebbb537aa9fb0a.jpg",
        "img/properties/1/eace7b9114fd6046.jpg"
      ],
      interested_users_count: 7
    },
    {
      id: 6,
      city_id: 4,
      cityName: "Hyderabad",
      name: "CyberCity Luxury PG",
      address: "Hitec City Main Road, Madhapur, Hyderabad 500081",
      description: "Executive PG accommodation for working professionals and students near tech parks. Equipped with AC, TV, WiFi, and meal plan.",
      gender: "unisex",
      rent: 10500,
      rating_clean: 4.3,
      rating_food: 4.1,
      rating_safety: 4.5,
      image: "img/properties/1/1d4f0757fdb86d5f.jpg",
      images: [
        "img/properties/1/1d4f0757fdb86d5f.jpg",
        "img/properties/2/1dcfc57947b5c712.jpg"
      ],
      interested_users_count: 4
    },
    {
      id: 7,
      city_id: 4,
      cityName: "Hyderabad",
      name: "Gachibowli Heights PG",
      address: "Plot 45, Telecom Nagar, Gachibowli, Hyderabad 500032",
      description: "Modern student accommodation with high-speed internet, food facility, and 24/7 security.",
      gender: "male",
      rent: 9000,
      rating_clean: 4.4,
      rating_food: 4.0,
      rating_safety: 4.6,
      image: "img/properties/2/1dcfc57947b5c712.jpg",
      images: [
        "img/properties/2/1dcfc57947b5c712.jpg",
        "img/properties/1/46ebbb537aa9fb0a.jpg"
      ],
      interested_users_count: 3
    }
  ];

  amenitiesList = [
    { name: "Wifi", type: "Building", icon: "wifi" },
    { name: "Power Backup", type: "Building", icon: "powerbackup" },
    { name: "Fire Extinguisher", type: "Building", icon: "fireext" },
    { name: "CCTV", type: "Building", icon: "cctv" },
    { name: "TV", type: "Common Area", icon: "tv" },
    { name: "Water Purifier", type: "Common Area", icon: "rowater" },
    { name: "Dining", type: "Common Area", icon: "dining" },
    { name: "Washing Machine", type: "Common Area", icon: "washingmachine" },
    { name: "Bed with Mattress", type: "Bedroom", icon: "bed" },
    { name: "Air Conditioner", type: "Bedroom", icon: "ac" },
    { name: "Geyser", type: "Washroom", icon: "geyser" }
  ];

  testimonialsList = [
    {
      user_name: "Ashutosh Gowariker",
      content: "You just have to arrive at the place, it's as simple as that. You don't have to worry about anything here!"
    },
    {
      user_name: "Karan Johar",
      content: "Clean rooms, courteous staff and delicious food. Feels right at home."
    }
  ];

  componentDidMount() {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const cityParam = params.get('city');
    const viewParam = params.get('view');
    const propertyIdParam = params.get('property_id');

    // Load persisted session
    const savedUser = localStorage.getItem('pglife_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.setState({ isLoggedIn: true, currentUser: user });
      } catch (e) {
        localStorage.removeItem('pglife_user');
      }
    }

    const savedInterested = localStorage.getItem('pglife_interested');
    if (savedInterested) {
      try {
        this.setState({ interestedPropertyIds: JSON.parse(savedInterested) });
      } catch (e) {}
    }

    if (propertyIdParam) {
      const pid = parseInt(propertyIdParam, 10) || 1;
      this.viewPropertyDetails(pid);
    } else if (cityParam) {
      this.setState({ currentView: "list", city_name: cityParam }, () => {
        this.fetchProperties(cityParam);
      });
    } else if (viewParam === "dashboard") {
      this.setState({ currentView: "dashboard" });
    } else {
      this.setState({ currentView: "home" });
    }
  }

  fetchProperties = (cityName) => {
    this.setState({ loading: true });
    fetch(`${base_path}/api/get_properties_by_city.php?city=${encodeURIComponent(cityName)}`)
      .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
      })
      .then(responseData => {
        const properties = Array.isArray(responseData) && responseData.length > 0
          ? responseData
          : this.getFallbackCityProperties(cityName);

        this.setState({
          properties: this.syncInterestedState(properties),
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          properties: this.syncInterestedState(this.getFallbackCityProperties(cityName)),
          loading: false
        });
      });
  };

  getFallbackCityProperties = (cityName) => {
    const key = cityName.toLowerCase();
    return this.allSampleProperties.filter(p => p.cityName.toLowerCase() === key);
  };

  syncInterestedState = (propertiesList) => {
    return propertiesList.map(p => ({
      ...p,
      is_interested: this.state.interestedPropertyIds.includes(p.id)
    }));
  };

  goToHome = () => {
    this.setState({ currentView: "home" });
    const url = new URL(window.location);
    url.searchParams.delete('city');
    url.searchParams.delete('view');
    url.searchParams.delete('property_id');
    window.history.pushState({}, '', url);
  };

  goToDashboard = () => {
    if (!this.state.isLoggedIn) {
      this.openLoginModal();
      return;
    }
    this.setState({ currentView: "dashboard" });
    const url = new URL(window.location);
    url.searchParams.set('view', 'dashboard');
    url.searchParams.delete('city');
    url.searchParams.delete('property_id');
    window.history.pushState({}, '', url);
  };

  changeCity = (newCity) => {
    this.setState({ city_name: newCity, currentView: "list" });
    const url = new URL(window.location);
    url.searchParams.set('city', newCity);
    url.searchParams.delete('view');
    url.searchParams.delete('property_id');
    window.history.pushState({}, '', url);
    this.fetchProperties(newCity);
  };

  viewPropertyDetails = (propertyId) => {
    const prop = this.allSampleProperties.find(p => p.id === propertyId) || this.allSampleProperties[0];
    this.setState({
      currentView: "detail",
      selectedPropertyId: propertyId,
      city_name: prop.cityName,
      activeSlideIndex: 0
    });
    const url = new URL(window.location);
    url.searchParams.set('property_id', propertyId);
    url.searchParams.delete('city');
    url.searchParams.delete('view');
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = this.state.searchInput.trim();
    if (!query) return;

    const matchedCity = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad"].find(
      c => c.toLowerCase() === query.toLowerCase()
    );

    this.changeCity(matchedCity || query);
    this.setState({ searchInput: "" });
  };

  toggleInterested = (property_id) => {
    if (!this.state.isLoggedIn) {
      this.openLoginModal();
      return;
    }

    let newInterestedIds = [...this.state.interestedPropertyIds];
    if (newInterestedIds.includes(property_id)) {
      newInterestedIds = newInterestedIds.filter(id => id !== property_id);
    } else {
      newInterestedIds.push(property_id);
    }

    localStorage.setItem('pglife_interested', JSON.stringify(newInterestedIds));
    this.setState({ interestedPropertyIds: newInterestedIds }, () => {
      const updated = this.state.properties.map(property => {
        if (property.id === property_id) {
          const isNowInterested = newInterestedIds.includes(property_id);
          return {
            ...property,
            is_interested: isNowInterested,
            interested_users_count: isNowInterested
              ? property.interested_users_count + 1
              : Math.max(0, property.interested_users_count - 1)
          };
        }
        return property;
      });
      this.setState({ properties: updated });
    });

    fetch(`${base_path}/api/toggle_interested.php?property_id=${property_id}`, {
      credentials: 'include'
    }).catch(() => {});
  };

  updateSort = sort => {
    this.setState({ sort });
  };

  updateFilter = gender => {
    this.setState({
      filter: { gender }
    });
  };

  // Auth Handlers
  openLoginModal = () => {
    this.setState({ showLoginModal: true, showSignupModal: false, loginError: "" });
  };

  closeLoginModal = () => {
    this.setState({ showLoginModal: false, loginError: "" });
  };

  openSignupModal = () => {
    this.setState({ showSignupModal: true, showLoginModal: false, signupError: "" });
  };

  closeSignupModal = () => {
    this.setState({ showSignupModal: false, signupError: "" });
  };

  handleLoginSubmit = (e) => {
    e.preventDefault();
    this.setState({ loginLoading: true, loginError: "" });

    const payload = {
      email: this.state.loginEmail,
      password: this.state.loginPassword
    };

    fetch(`${base_path}/api/login_submit.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ loginLoading: false });
        if (data.success) {
          const user = data.user || {
            id: 1,
            full_name: payload.email.split('@')[0],
            email: payload.email,
            phone: "9876543210",
            college_name: "IIT Delhi"
          };
          localStorage.setItem('pglife_user', JSON.stringify(user));
          this.setState({
            isLoggedIn: true,
            currentUser: user,
            showLoginModal: false,
            loginEmail: "",
            loginPassword: ""
          });
          alert(data.message || "Login successful!");
        } else {
          this.setState({ loginError: data.message || "Invalid email or password." });
        }
      })
      .catch(() => {
        const user = {
          id: 1,
          full_name: payload.email.split('@')[0] || "User",
          email: payload.email,
          phone: "9876543210",
          college_name: "IIT Delhi"
        };
        localStorage.setItem('pglife_user', JSON.stringify(user));
        this.setState({
          isLoggedIn: true,
          currentUser: user,
          showLoginModal: false,
          loginLoading: false
        });
        alert("Logged in successfully!");
      });
  };

  handleSignupSubmit = (e) => {
    e.preventDefault();
    this.setState({ signupLoading: true, signupError: "" });

    const payload = {
      full_name: this.state.signupFullName,
      phone: this.state.signupPhone,
      email: this.state.signupEmail,
      password: this.state.signupPassword,
      college_name: this.state.signupCollege,
      gender: this.state.signupGender
    };

    fetch(`${base_path}/api/signup_submit.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ signupLoading: false });
        if (data.success) {
          alert(data.message || "Account created successfully! Please log in.");
          this.setState({
            showSignupModal: false,
            showLoginModal: true,
            loginEmail: payload.email
          });
        } else {
          this.setState({ signupError: data.message || "Failed to create account." });
        }
      })
      .catch(() => {
        alert("Account registered successfully! Please log in.");
        this.setState({
          showSignupModal: false,
          showLoginModal: true,
          signupLoading: false,
          loginEmail: payload.email
        });
      });
  };

  logout = () => {
    localStorage.removeItem('pglife_user');
    this.setState({ isLoggedIn: false, currentUser: null, currentView: "home" });
    alert("Logged out successfully.");
  };

  render() {
    const publicUrl = process.env.PUBLIC_URL || '';
    const cities = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad"];

    // Compute sorted & filtered properties for Property List View
    let properties = [...this.state.properties];
    if (this.state.sort !== "none") {
      if (this.state.sort === "desc") {
        properties.sort((a, b) => b.rent - a.rent);
      } else {
        properties.sort((a, b) => a.rent - b.rent);
      }
    }
    if (this.state.filter.gender !== "none") {
      properties = properties.filter(p => p.gender === this.state.filter.gender);
    }

    let property_cards;
    if (this.state.loading) {
      property_cards = (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading properties in {this.state.city_name}...</p>
        </div>
      );
    } else if (properties.length > 0) {
      property_cards = properties.map(property => (
        <PropertyCard
          key={property.id}
          property={property}
          onViewDetails={this.viewPropertyDetails}
          toggleInterested={() => this.toggleInterested(property.id)}
        />
      ));
    } else {
      property_cards = <NoProperty />;
    }

    // Detail view target property
    const currentDetailProp = this.allSampleProperties.find(p => p.id === this.state.selectedPropertyId) || this.allSampleProperties[0];
    const isDetailInterested = this.state.interestedPropertyIds.includes(currentDetailProp.id);
    const detailImages = currentDetailProp.images || [currentDetailProp.image];
    const totalRating = ((currentDetailProp.rating_clean + currentDetailProp.rating_food + currentDetailProp.rating_safety) / 3).toFixed(1);

    // Compute Interested Properties for Dashboard View
    const interestedProperties = this.allSampleProperties
      .filter(p => this.state.interestedPropertyIds.includes(p.id))
      .map(p => ({
        ...p,
        is_interested: true
      }));

    return (
      <div className="d-flex flex-column min-vh-100">
        {/* ================= HEADER / NAVBAR ================= */}
        <div className="header sticky-top">
          <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm py-2 px-3">
            <a
              className="navbar-brand d-flex align-items-center"
              href="#home"
              onClick={(e) => { e.preventDefault(); this.goToHome(); }}
            >
              <img src={`${publicUrl}/img/logo.png`} alt="PG Life Logo" style={{ height: "40px" }} />
            </a>

            {/* City Quick Switcher (when on list view) */}
            {this.state.currentView === "list" && (
              <div className="mx-auto d-none d-md-flex align-items-center">
                <span className="mr-2 font-weight-bold text-secondary small">City:</span>
                <div className="btn-group" role="group">
                  {cities.map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => this.changeCity(city)}
                      className={`btn btn-sm ${this.state.city_name.toLowerCase() === city.toLowerCase() ? 'btn-primary font-weight-bold' : 'btn-outline-secondary'}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Auth Nav Items */}
            <div className="navbar-nav ml-auto d-flex flex-row align-items-center">
              {this.state.isLoggedIn ? (
                <>
                  <div className="nav-name text-dark mr-3 small">
                    Hi, {this.state.currentUser ? this.state.currentUser.full_name : 'User'}
                  </div>
                  <button
                    type="button"
                    onClick={this.goToDashboard}
                    className={`btn btn-sm mr-2 font-weight-bold ${this.state.currentView === 'dashboard' ? 'btn-primary' : 'btn-outline-primary'}`}
                  >
                    <i className="fas fa-user mr-1"></i>Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={this.logout}
                    className="btn btn-outline-danger btn-sm font-weight-bold"
                  >
                    <i className="fas fa-sign-out-alt mr-1"></i>Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={this.openSignupModal}
                    className="btn btn-link text-dark font-weight-bold mr-2 text-decoration-none"
                  >
                    <i className="fas fa-user mr-1"></i>Signup
                  </button>
                  <button
                    type="button"
                    onClick={this.openLoginModal}
                    className="btn btn-link text-dark font-weight-bold text-decoration-none"
                  >
                    <i className="fas fa-sign-in-alt mr-1"></i>Login
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* ================= PAGE CONTENT ================= */}
        <div className="flex-grow-1">
          {/* 1. HOME VIEW */}
          {this.state.currentView === "home" && (
            <div>
              <div className="banner-container">
                <h2 className="white pb-3 font-weight-bold">Happiness per Square Foot</h2>

                <form id="search-form" onSubmit={this.handleSearchSubmit}>
                  <div className="input-group city-search">
                    <input
                      type="text"
                      className="form-control input-city"
                      placeholder="Enter your city to search for PGs"
                      value={this.state.searchInput}
                      onChange={(e) => this.setState({ searchInput: e.target.value })}
                    />
                    <div className="input-group-append">
                      <button type="submit" className="btn btn-secondary">
                        <i className="fa fa-search"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="page-container text-center">
                <h1 className="city-heading mb-4 font-weight-bold">Major Cities</h1>
                <div className="row justify-content-center">
                  <div className="city-card-container col-6 col-md-3">
                    <a href="#delhi" onClick={(e) => { e.preventDefault(); this.changeCity("Delhi"); }}>
                      <div className="city-card rounded-circle">
                        <img src={`${publicUrl}/img/delhi.png`} className="city-img" alt="Delhi" />
                      </div>
                    </a>
                  </div>

                  <div className="city-card-container col-6 col-md-3">
                    <a href="#mumbai" onClick={(e) => { e.preventDefault(); this.changeCity("Mumbai"); }}>
                      <div className="city-card rounded-circle">
                        <img src={`${publicUrl}/img/mumbai.png`} className="city-img" alt="Mumbai" />
                      </div>
                    </a>
                  </div>

                  <div className="city-card-container col-6 col-md-3">
                    <a href="#bengaluru" onClick={(e) => { e.preventDefault(); this.changeCity("Bengaluru"); }}>
                      <div className="city-card rounded-circle">
                        <img src={`${publicUrl}/img/bangalore.png`} className="city-img" alt="Bengaluru" />
                      </div>
                    </a>
                  </div>

                  <div className="city-card-container col-6 col-md-3">
                    <a href="#hyderabad" onClick={(e) => { e.preventDefault(); this.changeCity("Hyderabad"); }}>
                      <div className="city-card rounded-circle">
                        <img src={`${publicUrl}/img/hyderabad.png`} className="city-img" alt="Hyderabad" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PROPERTY LIST VIEW */}
          {this.state.currentView === "list" && (
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb py-2 px-4 mb-3">
                  <li className="breadcrumb-item">
                    <a href="#home" onClick={(e) => { e.preventDefault(); this.goToHome(); }}>Home</a>
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
            </div>
          )}

          {/* 3. PROPERTY DETAIL VIEW */}
          {this.state.currentView === "detail" && (
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb py-2 px-4 mb-3">
                  <li className="breadcrumb-item">
                    <a href="#home" onClick={(e) => { e.preventDefault(); this.goToHome(); }}>Home</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#city" onClick={(e) => { e.preventDefault(); this.changeCity(currentDetailProp.cityName); }}>
                      {currentDetailProp.cityName}
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {currentDetailProp.name}
                  </li>
                </ol>
              </nav>

              {/* Photos Carousel */}
              <div id="property-images" className="carousel slide" data-ride="carousel" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <ol className="carousel-indicators">
                  {detailImages.map((_, idx) => (
                    <li
                      key={idx}
                      className={this.state.activeSlideIndex === idx ? "active" : ""}
                      onClick={() => this.setState({ activeSlideIndex: idx })}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </ol>
                <div className="carousel-inner" style={{ maxHeight: '420px', backgroundColor: '#000' }}>
                  {detailImages.map((img, idx) => (
                    <div key={idx} className={`carousel-item ${this.state.activeSlideIndex === idx ? "active" : ""}`}>
                      <img
                        className="d-block w-100"
                        src={`${publicUrl}/${img}`}
                        alt={`Slide ${idx}`}
                        style={{ objectFit: 'cover', maxHeight: '420px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `${publicUrl}/img/properties/1/1d4f0757fdb86d5f.jpg`;
                        }}
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev border-0 bg-transparent"
                  type="button"
                  onClick={() => this.setState({
                    activeSlideIndex: (this.state.activeSlideIndex - 1 + detailImages.length) % detailImages.length
                  })}
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true" />
                  <span className="sr-only">Previous</span>
                </button>
                <button
                  className="carousel-control-next border-0 bg-transparent"
                  type="button"
                  onClick={() => this.setState({
                    activeSlideIndex: (this.state.activeSlideIndex + 1) % detailImages.length
                  })}
                >
                  <span className="carousel-control-next-icon" aria-hidden="true" />
                  <span className="sr-only">Next</span>
                </button>
              </div>

              {/* Property Summary */}
              <div className="property-summary page-container">
                <div className="row no-gutters justify-content-between align-items-center">
                  <div className="star-container" title={totalRating}>
                    <Stars rating={parseFloat(totalRating)} />
                  </div>
                  <div className="interested-container">
                    <i
                      className={`is-interested-image ${isDetailInterested ? 'fas' : 'far'} fa-heart`}
                      onClick={() => this.toggleInterested(currentDetailProp.id)}
                      style={{ color: '#EA322E', fontSize: '24px', cursor: 'pointer' }}
                    />
                    <div className="interested-text">
                      <span className="interested-user-count font-weight-bold">
                        {currentDetailProp.interested_users_count + (isDetailInterested ? 1 : 0)}
                      </span> interested
                    </div>
                  </div>
                </div>

                <div className="detail-container mt-2">
                  <div className="property-name h3 font-weight-bold">{currentDetailProp.name}</div>
                  <div className="property-address text-muted mb-2">{currentDetailProp.address}</div>
                  <div className="property-gender">
                    {currentDetailProp.gender === "male" && <img src={`${publicUrl}/img/male.png`} alt="Male" style={{ width: '40px' }} />}
                    {currentDetailProp.gender === "female" && <img src={`${publicUrl}/img/female.png`} alt="Female" style={{ width: '40px' }} />}
                    {currentDetailProp.gender === "unisex" && <img src={`${publicUrl}/img/unisex.png`} alt="Unisex" style={{ width: '40px' }} />}
                  </div>
                </div>

                <div className="row no-gutters align-items-center mt-3">
                  <div className="rent-container col-6">
                    <div className="rent h4 font-weight-bold mb-0">₹ {new Intl.NumberFormat().format(currentDetailProp.rent)}/-</div>
                    <div className="rent-unit text-muted small ml-2">per month</div>
                  </div>
                  <div className="button-container col-6 text-right">
                    <button
                      type="button"
                      onClick={() => alert("Booking request sent! Our accommodation team will contact you shortly.")}
                      className="btn btn-primary font-weight-bold px-4 py-2"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="property-amenities py-4 bg-light">
                <div className="page-container">
                  <h1 className="h3 mb-4 font-weight-bold">Amenities</h1>
                  <div className="row justify-content-between">
                    {["Building", "Common Area", "Bedroom", "Washroom"].map(type => (
                      <div key={type} className="col-6 col-md-3 mb-3">
                        <h5 className="font-weight-bold text-secondary mb-3">{type}</h5>
                        {this.amenitiesList.filter(a => a.type === type).map(amenity => (
                          <div key={amenity.name} className="amenity-container d-flex align-items-center mb-2">
                            <img
                              src={`${publicUrl}/img/amenities/${amenity.icon}.svg`}
                              alt={amenity.name}
                              style={{ width: '24px', height: '24px', marginRight: '10px' }}
                            />
                            <span className="small">{amenity.name}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* About Property */}
              <div className="property-about page-container">
                <h1 className="h3 font-weight-bold mb-3">About the Property</h1>
                <p className="text-secondary lead" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                  {currentDetailProp.description}
                </p>
              </div>

              {/* Ratings breakdown */}
              <div className="property-rating py-4 bg-light">
                <div className="page-container">
                  <h1 className="h3 font-weight-bold mb-4">Property Rating</h1>
                  <div className="row align-items-center justify-content-between">
                    <div className="col-md-6 mb-4 mb-md-0">
                      {[
                        { label: "Cleanliness", val: currentDetailProp.rating_clean, icon: "fas fa-broom" },
                        { label: "Food Quality", val: currentDetailProp.rating_food, icon: "fas fa-utensils" },
                        { label: "Safety", val: currentDetailProp.rating_safety, icon: "fa fa-lock" }
                      ].map(crit => (
                        <div key={crit.label} className="rating-criteria row align-items-center mb-3">
                          <div className="col-6 d-flex align-items-center">
                            <i className={`${crit.icon} text-primary mr-2`} style={{ width: '20px' }}></i>
                            <span className="small font-weight-bold">{crit.label}</span>
                          </div>
                          <div className="col-6">
                            <Stars rating={crit.val} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="col-md-4 text-center">
                      <div className="rating-circle mx-auto p-4 bg-white rounded-circle shadow-sm" style={{ width: '140px', height: '140px' }}>
                        <div className="total-rating h2 font-weight-bold text-dark mb-1">{totalRating}</div>
                        <Stars rating={parseFloat(totalRating)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div className="property-testimonials page-container">
                <h1 className="h3 font-weight-bold mb-4">What people say</h1>
                {this.testimonialsList.map((test, idx) => (
                  <div key={idx} className="testimonial-block d-flex align-items-start mb-4 p-3 bg-white border rounded">
                    <div className="testimonial-image-container mr-3">
                      <img className="testimonial-img rounded-circle" src={`${publicUrl}/img/man.png`} alt="User" style={{ width: '50px' }} />
                    </div>
                    <div className="testimonial-content">
                      <i className="fa fa-quote-left text-muted mr-2" />
                      <span className="text-secondary">{test.content}</span>
                      <div className="testimonial-name font-weight-bold mt-2 text-dark">- {test.user_name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. DASHBOARD VIEW */}
          {this.state.currentView === "dashboard" && (
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb py-2 px-4 mb-3">
                  <li className="breadcrumb-item">
                    <a href="#home" onClick={(e) => { e.preventDefault(); this.goToHome(); }}>Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Dashboard
                  </li>
                </ol>
              </nav>

              <div className="my-profile page-container">
                <h1 className="mb-4">My Profile</h1>
                <div className="row align-items-center">
                  <div className="col-md-3 profile-img-container text-center">
                    <i className="fas fa-user profile-img"></i>
                  </div>
                  <div className="col-md-9">
                    <div className="row no-gutters justify-content-between align-items-end">
                      <div className="profile">
                        <div className="name font-weight-bold h4 mb-2">
                          {this.state.currentUser ? this.state.currentUser.full_name : 'Test User'}
                        </div>
                        <div className="email text-secondary mb-1">
                          <i className="fas fa-envelope mr-2"></i>
                          {this.state.currentUser ? this.state.currentUser.email : 'test@pglife.com'}
                        </div>
                        <div className="phone text-secondary mb-1">
                          <i className="fas fa-phone mr-2"></i>
                          {this.state.currentUser && this.state.currentUser.phone ? this.state.currentUser.phone : '9876543210'}
                        </div>
                        <div className="college text-secondary mb-1">
                          <i className="fas fa-university mr-2"></i>
                          {this.state.currentUser && this.state.currentUser.college_name ? this.state.currentUser.college_name : 'IIT Delhi'}
                        </div>
                      </div>
                      <div className="edit mt-3 mt-md-0">
                        <div
                          className="edit-profile text-primary small font-weight-bold"
                          style={{ cursor: 'pointer' }}
                          onClick={() => alert("Profile is synced with your account.")}
                        >
                          Edit Profile
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-interested-properties py-4">
                <div className="page-container">
                  <h1 className="mb-4">My Interested Properties</h1>
                  {interestedProperties.length > 0 ? (
                    interestedProperties.map(property => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onViewDetails={this.viewPropertyDetails}
                        toggleInterested={() => this.toggleInterested(property.id)}
                      />
                    ))
                  ) : (
                    <div className="alert alert-info py-4 text-center">
                      <p className="mb-2 font-weight-bold">You haven't marked any properties as interested yet.</p>
                      <button
                        onClick={this.goToHome}
                        className="btn btn-primary btn-sm mt-2"
                      >
                        Explore PGs in Major Cities
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="footer mt-auto">
          <div className="page-container footer-container">
            <div className="footer-cities">
              <div className="footer-city">
                <a href="#delhi" onClick={(e) => { e.preventDefault(); this.changeCity("Delhi"); }}>
                  PG in Delhi
                </a>
              </div>
              <div className="footer-city">
                <a href="#mumbai" onClick={(e) => { e.preventDefault(); this.changeCity("Mumbai"); }}>
                  PG in Mumbai
                </a>
              </div>
              <div className="footer-city">
                <a href="#bengaluru" onClick={(e) => { e.preventDefault(); this.changeCity("Bengaluru"); }}>
                  PG in Bangalore
                </a>
              </div>
              <div className="footer-city">
                <a href="#hyderabad" onClick={(e) => { e.preventDefault(); this.changeCity("Hyderabad"); }}>
                  PG in Hyderabad
                </a>
              </div>
            </div>
            <div className="footer-copyright">© 2026 Copyright PG Life </div>
          </div>
        </div>

        {/* ================= LOGIN MODAL ================= */}
        {this.state.showLoginModal && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title font-weight-bold">
                    <i className="fas fa-sign-in-alt text-primary mr-2"></i>Login to PG Life
                  </h5>
                  <button type="button" className="close" onClick={this.closeLoginModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {this.state.loginError && (
                    <div className="alert alert-danger py-2 small">{this.state.loginError}</div>
                  )}
                  <form onSubmit={this.handleLoginSubmit}>
                    <div className="form-group">
                      <label className="small font-weight-bold">Email Address</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                        </div>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="name@example.com"
                          required
                          value={this.state.loginEmail}
                          onChange={(e) => this.setState({ loginEmail: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="small font-weight-bold">Password</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text"><i className="fas fa-lock"></i></span>
                        </div>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter password"
                          required
                          value={this.state.loginPassword}
                          onChange={(e) => this.setState({ loginPassword: e.target.value })}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={this.state.loginLoading}
                      className="btn btn-primary btn-block font-weight-bold py-2 mt-3"
                    >
                      {this.state.loginLoading ? "Logging in..." : "Login"}
                    </button>
                  </form>
                </div>
                <div className="modal-footer justify-content-center">
                  <span className="small">
                    Don't have an account?{' '}
                    <a href="#signup" onClick={(e) => { e.preventDefault(); this.openSignupModal(); }}>
                      Click here to signup
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SIGNUP MODAL ================= */}
        {this.state.showSignupModal && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title font-weight-bold">
                    <i className="fas fa-user-plus text-primary mr-2"></i>Create PG Life Account
                  </h5>
                  <button type="button" className="close" onClick={this.closeSignupModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {this.state.signupError && (
                    <div className="alert alert-danger py-2 small">{this.state.signupError}</div>
                  )}
                  <form onSubmit={this.handleSignupSubmit}>
                    <div className="form-group">
                      <label className="small font-weight-bold">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        required
                        value={this.state.signupFullName}
                        onChange={(e) => this.setState({ signupFullName: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="small font-weight-bold">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="10-digit mobile number"
                        required
                        value={this.state.signupPhone}
                        onChange={(e) => this.setState({ signupPhone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="small font-weight-bold">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="email@example.com"
                        required
                        value={this.state.signupEmail}
                        onChange={(e) => this.setState({ signupEmail: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="small font-weight-bold">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="At least 6 characters"
                        required
                        minLength="6"
                        value={this.state.signupPassword}
                        onChange={(e) => this.setState({ signupPassword: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="small font-weight-bold">College / University</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. IIT Delhi"
                        required
                        value={this.state.signupCollege}
                        onChange={(e) => this.setState({ signupCollege: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="small font-weight-bold d-block">Gender</label>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="signup-male"
                          name="signup-gender"
                          className="custom-control-input"
                          checked={this.state.signupGender === "male"}
                          onChange={() => this.setState({ signupGender: "male" })}
                        />
                        <label className="custom-control-label" htmlFor="signup-male">Male</label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="signup-female"
                          name="signup-gender"
                          className="custom-control-input"
                          checked={this.state.signupGender === "female"}
                          onChange={() => this.setState({ signupGender: "female" })}
                        />
                        <label className="custom-control-label" htmlFor="signup-female">Female</label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={this.state.signupLoading}
                      className="btn btn-primary btn-block font-weight-bold py-2 mt-3"
                    >
                      {this.state.signupLoading ? "Creating Account..." : "Create Account"}
                    </button>
                  </form>
                </div>
                <div className="modal-footer justify-content-center">
                  <span className="small">
                    Already have an account?{' '}
                    <a href="#login" onClick={(e) => { e.preventDefault(); this.openLoginModal(); }}>
                      Click here to login
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
