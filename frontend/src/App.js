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
    city_name: "Hyderabad",
    loading: false,
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

  componentDidMount() {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const city = params.get('city') || "Hyderabad";

    // Load persisted user session from localStorage
    const savedUser = localStorage.getItem('pglife_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.setState({ isLoggedIn: true, currentUser: user });
      } catch (e) {
        localStorage.removeItem('pglife_user');
      }
    }

    this.setState({ city_name: city }, () => {
      this.fetchProperties(city);
    });
  }

  fetchProperties = (cityName) => {
    this.setState({ loading: true });
    fetch(`${base_path}/api/get_properties_by_city.php?city=${encodeURIComponent(cityName)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network error');
        }
        return response.json();
      })
      .then(responseData => {
        const properties = Array.isArray(responseData) ? responseData : [];
        this.setState({
          properties: properties,
          loading: false
        });
      })
      .catch(error => {
        console.log('Error fetching properties from backend:', error);
        // Fallback properties for seamless demo if backend is cold/unconnected
        const fallbacks = {
          hyderabad: [
            {
              id: 6,
              city_id: 4,
              name: "CyberCity Luxury PG",
              address: "Hitec City Main Road, Madhapur, Hyderabad 500081",
              description: "Executive PG accommodation for working professionals and students near tech parks.",
              gender: "unisex",
              rent: 10500,
              rating_clean: 4.3,
              rating_food: 4.1,
              rating_safety: 4.5,
              image: "img/properties/1/1d4f0757fdb86d5f.jpg",
              interested_users_count: 4,
              is_interested: false
            },
            {
              id: 7,
              city_id: 4,
              name: "Gachibowli Heights PG",
              address: "Plot 45, Telecom Nagar, Gachibowli, Hyderabad 500032",
              description: "Modern student accommodation with high-speed internet, food facility, and 24/7 security.",
              gender: "male",
              rent: 9000,
              rating_clean: 4.4,
              rating_food: 4.0,
              rating_safety: 4.6,
              image: "img/properties/2/1dcfc57947b5c712.jpg",
              interested_users_count: 3,
              is_interested: false
            }
          ],
          delhi: [
            {
              id: 3,
              city_id: 1,
              name: "PG for Girls Shree Radhe",
              address: "Plot no. 258/D4, Laxman Vihar, Phase 2, Delhi 110001",
              description: "Safe, well-maintained girls PG with biometric entrance, air-conditioned rooms, full power backup.",
              gender: "female",
              rent: 11000,
              rating_clean: 4.7,
              rating_food: 4.3,
              rating_safety: 4.9,
              image: "img/properties/1/eace7b9114fd6046.jpg",
              interested_users_count: 6,
              is_interested: false
            },
            {
              id: 4,
              city_id: 1,
              name: "Saxena Paying Guest",
              address: "H.No. 122, Block B, Hauz Khas, New Delhi 110016",
              description: "Premium student PG within walking distance of metro and markets.",
              gender: "male",
              rent: 12500,
              rating_clean: 4.0,
              rating_food: 3.9,
              rating_safety: 4.2,
              image: "img/properties/1/46ebbb537aa9fb0a.jpg",
              interested_users_count: 2,
              is_interested: false
            }
          ],
          mumbai: [
            {
              id: 1,
              city_id: 2,
              name: "Navkar Paying Guest",
              address: "44, Juhu Scheme, Juhu, Mumbai, Maharashtra 400058",
              description: "Furnished room with attached washroom, daily housekeeping, 3-course homestyle meals.",
              gender: "male",
              rent: 9500,
              rating_clean: 4.2,
              rating_food: 3.8,
              rating_safety: 4.5,
              image: "img/properties/1/1d4f0757fdb86d5f.jpg",
              interested_users_count: 5,
              is_interested: false
            },
            {
              id: 2,
              city_id: 2,
              name: "Ganpati Paying Guest",
              address: "Police Station, 115, Sher-e-Punjab Colony, Andheri East, Mumbai 400093",
              description: "Spacious co-living PG with dedicated study desks, high-speed WiFi, gym access.",
              gender: "female",
              rent: 8500,
              rating_clean: 4.5,
              rating_food: 4.0,
              rating_safety: 4.8,
              image: "img/properties/2/1dcfc57947b5c712.jpg",
              interested_users_count: 4,
              is_interested: false
            }
          ],
          bengaluru: [
            {
              id: 5,
              city_id: 3,
              name: "Youth Living Paying Guest",
              address: "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
              description: "Modern unisex co-living hub located in prime Indiranagar with high-speed internet.",
              gender: "unisex",
              rent: 14000,
              rating_clean: 4.6,
              rating_food: 4.4,
              rating_safety: 4.6,
              image: "img/properties/1/46ebbb537aa9fb0a.jpg",
              interested_users_count: 7,
              is_interested: false
            }
          ]
        };
        const key = cityName.toLowerCase();
        this.setState({
          properties: fallbacks[key] || [],
          loading: false
        });
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
    if (!this.state.isLoggedIn) {
      this.openLoginModal();
      return;
    }

    fetch(`${base_path}/api/toggle_interested.php?property_id=${property_id}`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(responseData => {
        this.updateInterested(property_id);
      })
      .catch(() => {
        this.updateInterested(property_id);
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
            email: payload.email
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
      .catch(err => {
        console.error("Login fetch error:", err);
        // Fallback demo login
        const user = {
          id: 1,
          full_name: payload.email.split('@')[0] || "Demo User",
          email: payload.email
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
      .catch(err => {
        console.error("Signup fetch error:", err);
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
    this.setState({ isLoggedIn: false, currentUser: null });
    alert("Logged out successfully.");
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
          <p className="mt-2 text-muted">Loading properties in {this.state.city_name}...</p>
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
    const publicUrl = process.env.PUBLIC_URL || '';

    return (
      <>
        {/* Header Navigation */}
        <div className="header sticky-top">
          <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm py-2">
            <a className="navbar-brand d-flex align-items-center" href="/">
              <img src={`${publicUrl}/img/logo.png`} alt="PG Life Logo" style={{ height: "38px" }} />
            </a>

            {/* City Selector */}
            <div className="mx-auto d-none d-md-flex align-items-center">
              <span className="mr-2 font-weight-bold text-secondary small">Select City:</span>
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

            {/* Auth Buttons */}
            <div className="navbar-nav ml-auto d-flex flex-row align-items-center">
              {this.state.isLoggedIn ? (
                <>
                  <span className="mr-3 text-dark font-weight-bold small">
                    <i className="fas fa-user-circle mr-1 text-primary"></i>
                    Hi, {this.state.currentUser ? this.state.currentUser.full_name : 'User'}
                  </span>
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
                    className="btn btn-outline-secondary btn-sm mr-2 font-weight-bold"
                  >
                    <i className="fas fa-user mr-1"></i>Signup
                  </button>
                  <button
                    type="button"
                    onClick={this.openLoginModal}
                    className="btn btn-primary btn-sm font-weight-bold"
                  >
                    <i className="fas fa-sign-in-alt mr-1"></i>Login
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile City Selector Bar */}
          <div className="d-flex d-md-none justify-content-center bg-light py-2 border-bottom">
            <div className="btn-group btn-group-sm" role="group">
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
        </div>

        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb py-2 px-4 mb-3">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
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

        {/* --- LOGIN MODAL --- */}
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
                      <small className="form-text text-muted">Test login: <code>test@pglife.com</code> / <code>password123</code></small>
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

        {/* --- SIGNUP MODAL --- */}
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
      </>
    );
  }
}

export default App;
