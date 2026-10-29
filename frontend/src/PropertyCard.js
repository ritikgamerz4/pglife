import React from 'react';
import Stars from './Stars';
import Interested from './Interested';
import { base_path } from './utils.js';

const PropertyCard = props => {
  let total_rating = (parseFloat(props.property.rating_clean) + parseFloat(props.property.rating_food) + parseFloat(props.property.rating_safety)) / 3;
  total_rating = Math.round(total_rating * 10) / 10;
  total_rating = total_rating.toFixed(1);

  const publicUrl = process.env.PUBLIC_URL || '';

  let gender_image;
  if (props.property.gender === "male") {
    gender_image = <img src={`${publicUrl}/img/male.png`} alt="male" />;
  } else if (props.property.gender === "female") {
    gender_image = <img src={`${publicUrl}/img/female.png`} alt="female" />;
  } else {
    gender_image = <img src={`${publicUrl}/img/unisex.png`} alt="unisex" />;
  }

  let rent = new Intl.NumberFormat().format(props.property.rent);
  const detailLink = base_path 
    ? `${base_path}/property_detail.php?property_id=${props.property.id}`
    : `property_detail.php?property_id=${props.property.id}`;

  const imageSrc = props.property.image && props.property.image.startsWith('http')
    ? props.property.image
    : `${publicUrl}/${props.property.image || 'img/properties/1/1d4f0757fdb86d5f.jpg'}`;

  return (
    <div className={`property-card property-id-${props.property.id} row`}>
      <div className="image-container col-md-4">
        <img
          src={imageSrc}
          alt={props.property.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${publicUrl}/img/properties/1/1d4f0757fdb86d5f.jpg`;
          }}
        />
      </div>

      <div className="content-container col-md-8">
        <div className="row no-gutters justify-content-between">
          <Stars rating={total_rating} />

          <Interested
            is_interested={props.property.is_interested}
            toggleInterested={props.toggleInterested}
            user_count={props.property.interested_users_count}
          />
        </div>

        <div className="detail-container">
          <div className="property-name">{props.property.name}</div>
          <div className="property-address">{props.property.address}</div>
          <div className="property-gender">
            {gender_image}
          </div>
        </div>

        <div className="row no-gutters">
          <div className="rent-container col-6">
            <div className="rent">₹ {rent}/-</div>
            <div className="rent-unit">per month</div>
          </div>
          <div className="button-container col-6">
            <a href={detailLink} className="btn btn-primary">View</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
