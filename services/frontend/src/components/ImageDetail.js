import React, { useState } from 'react';
import PropTypes from 'prop-types';

function ImageDetail({ image }) {
  const [drawBoxes, setDrawBoxes] = useState([]);

  if (image.length === 0) {
    return <div>Loading...</div>
  }

  image = image[0];

  const coordStyle = {
    padding: '5px 10px',
    color: 'maroon',
    letterSpacing: '0.2rem',
    background: 'powderblue',
    borderRadius: '4px',
    margin: '5px',
  };

  const labelStyle = {
    color: 'firebrick',
    letterSpacing: '0.25rem'
  }

  return (
    <div className="ui center aligned two column stackable grid">
      <div className="row">
        <div className="column">
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            width={ image.width }
            height={ image.height }
          >
            <image
              xlinkHref={`${process.env.REACT_APP_API_URL}/api/uploads/${image.name}`}
              x="0" y="0"
              style={ image.width > image.height ? {width: "100%"} : {height: "100%"} } />
            { drawBoxes.length > 0 && drawBoxes.map((box, id) => (
              <rect
                key={ box.id }
                x={ box.x_min }
                y={ box.y_min }
                width={ box.x_max - box.x_min }
                height={ box.y_max - box.y_min }
                style={{fill: "none", stroke: "lime", strokeWidth: "3"}}
              />
            ))}
          </svg>
          <p></p>
          <a href={`${process.env.REACT_APP_API_URL}/api/annotations/kitti/${image.name.replace('.jpg', '.txt')}`}>
            <button className="ui primary button">Download annotation</button>
          </a>
        </div>
        <div className="column">
          <div className="ui left aligned red segment">
            <div className="ui center aligned header">Image details</div>
            <p>Author: <span style={{color: "tomato", fontSize: "1.6rem"}}>{ image.user.username }</span></p>
            <p>Uploaded at: <span style={{color: "chocolate", fontStyle: "italic"}}>{ image.uploaded_at }</span></p>
          </div>
          <div className="ui segments">
            <div className="ui left aligned blue segment">
              <div className="ui center aligned header">Bounding boxes</div>
            </div>
            <div className="ui segments">
              {image.boxes.map(box => (
                <div className="ui segment" key={ box.id }>
                  <div className="ui center aligned divided two column grid">
                    <div className="row">
                      <span
                        className="ui left floated header"
                        style={labelStyle}
                      >
                        { box.label }
                      </span>
                    </div>
                    <div className="row">
                      <div className="column">
                        <span style={ coordStyle }>{ Math.floor(box.x_min) }</span>
                        <span style={ coordStyle }>{ Math.floor(box.y_min) }</span>
                        <span style={ coordStyle }>{ Math.floor(box.x_max) }</span>
                        <span style={ coordStyle }>{ Math.floor(box.y_max) }</span>
                      </div>
                      <div className="column">
                        <span style={{  }}>
                          <i
                            className="eye icon"
                            onClick={ () => {
                              const currentBox = drawBoxes.filter(drawBox => drawBox.id === box.id);
                              if (currentBox.length === 0) {
                                setDrawBoxes([...drawBoxes, box]);
                              } else {
                                const otherBoxes = drawBoxes.filter(drawBox => drawBox.id !== box.id);
                                setDrawBoxes([...otherBoxes]);
                              }
                            }}
                          ></i>
                          <i className="edit icon"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ImageDetail.propTypes = {
  image: PropTypes.array.isRequired
};

export default ImageDetail;