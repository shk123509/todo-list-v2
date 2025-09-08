import React, { useState } from 'react';

export default function About() {
  const [myStyle, setMyStyle] = useState({
    color: "black",
    backgroundColor: "white"
  });

  const [btnText, setBtnText] = useState("Enable Dark Mode");

  const toggle = () => {
    if (myStyle.color === 'black') {
      setMyStyle({
        color: "white",
        backgroundColor: "black",
       
      });
      setBtnText("Enable Light Mode");
    } 
    else {
      setMyStyle ({
        color: "black",
        backgroundColor: "white",
        border : "1px solid white"
      });
      setBtnText("Enable Dark Mode");
    }
  };

  return (
      <div className="container" style={{ ...myStyle, marginTop: "80px" }}>
      <h2 className="my-2">About This Website</h2>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item" style={myStyle}>
          <h2 className="accordion-header">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" style={myStyle} aria-expanded="true" aria-controls="collapseOne">
                <p>
                     Welcome to <strong>TextUtils</strong> — your go-to platform for quick and efficient text manipulation tools. Whether you're looking to convert case, remove extra spaces, count words, or analyze text, we’ve got you covered.
                      </p>
                       <p>
                      Built with simplicity and performance in mind, TextUtils helps students, developers, writers, and professionals handle text-related tasks with ease. Our goal is to save you time and boost your productivity.
                    </p>
                   <p>
                          This website is developed using <strong>React.js</strong> and styled with <strong>Bootstrap</strong> to provide a fast, responsive, and modern experience.
                     </p>
                    <p>
                           Thank you for visiting TextUtils. Keep exploring and stay productive!
                       </p>
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
            <div className="accordion-body" style={myStyle}>
              <strong>This is the first item’s accordion body.</strong>
            </div>
          </div>
        </div>

        <div className="accordion-item" style={myStyle}>
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" style={myStyle} data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              
<p>
  Hi there! 👋 I'm <strong>Md Shakib</strong>, and I built this website — <strong>TextUtils</strong> — to help people manage their text faster and better.
</p>
<p>
  You can use this tool to format your text, count words and characters, clean up spacing, and much more — all for free!
</p>
<p>
  I created this using <strong>React.js</strong> as a learning project, and I keep improving it with new features and ideas.
</p>
<p>
  Thank you for visiting — feel free to explore and use all the features!
</p>

            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body" style={myStyle}>
              <strong>This is the second item’s accordion body.</strong>
            </div>
          </div>
        </div>

        <div className="accordion-item" style={myStyle}>
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" style={myStyle} data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
             
<p>
  TextUtils is a React-based web application designed to perform common text processing tasks in real-time.
  With features like case conversion, space trimming, and word/character counting, it serves as a handy tool for developers, students, and content creators.
</p>
<p>
  This app is lightweight, responsive, and optimized for performance, offering a seamless user experience without any login or subscription.
</p>
<p>
  Built by <strong>Md Shakib</strong> using <strong>React, JavaScript, and Bootstrap</strong>, TextUtils reflects modern front-end development practices.
</p>

            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body" style={myStyle}>
              <strong>This is the third item’s accordion body.</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-3">
        <button onClick={toggle} className="btn btn-warning mx-4">{btnText}</button>
      </div>
      
    </div>
  );
}
