function watchForm()
{

  let submitButton = document.getElementById( "submitButton" );

  submitButton.addEventListener( "click", ( event ) => {
    event.preventDefault();

    //Validating fullName
    let name = document.getElementById( "name" );
    let nameError = document.getElementById("nameErrorMessage");

    if (name.value === "")
    {
      nameError.textContent = "Please provide your name";
    }
    else
    {
      nameError.textContent = "";
    }

    //Validating email
    let email = document.getElementById("email");
    let emailError = document.getElementById("emailErrorMessage");
    
    if (email.value === "")
    {
      emailError.hidden = false;
    }
    else
    {
      emailError.hidden = true;
    }

    //Validating dropdown menu
    let country = document.getElementById("country");
    let countryError = document.getElementById("countryErrorMessage");

    if (country.value === "0")
    {
      countryError.textContent = "Please select a country";
    }
    else
    {
      countryError.textContent = "";
    }

    //Validating gender inputs
    let genderRadios = document.getElementsByName("gender");
    let genderError = document.getElementById("genderErrorMessage");
    let radioFlag = false;

    for (let i = 0; i < genderRadios.length; i++)
    {
      if (genderRadios[i].checked)
      {
        radioFlag = !radioFlag;
      }
    }

    if (radioFlag)
    {
      genderError.textContent = "";
    }
    else
    {
      genderError.textContent = "Please select a gender";
    }

  });

  let menuItems = document.getElementsByTagName("li");

  for (let i = 0; i < menuItems.length; i++)
  {
    menuItems[i].addEventListener("click", (event) => {
      event.preventDefault();
      let selected = document.getElementsByClassName("selected");
      
      selected[0].className = "";

      event.target.className = "selected";

      //console.log(event.target.id);

      let currentSelected = document.getElementsByClassName("currentSelected");

      currentSelected[0].hidden = true;
      currentSelected[0].className = "";

      let selectedSection = document.getElementById(event.target.id + "Section");

      selectedSection.hidden = false;
      selectedSection.className = "currentSelected";
    });
  }
}

watchForm();