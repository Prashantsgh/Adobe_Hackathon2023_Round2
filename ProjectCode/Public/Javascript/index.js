let template_id='a';
let component = 1;
// Configuration for Adobe PDF Embed API
const previewConfig = {
    embedMode: "LIGHT_BOX",
    defaultViewMode: "FIT_PAGE",
    showZoomControl: false,
    showAnnotationTools: false,
    showFullScreen: false,
    enableFormFilling: false,
    showPrintPDF: false,
    exitPDFViewerType: "CLOSE",
    showThumbnails: false,
    showBookmarks: false
}

// Function to create JSON string from the form.
function getFormData(){
    let formData = {};
    formData.template_id = (template_id.charCodeAt(0)-'a'.charCodeAt(0)+1).toString();
    formData.personal_information={};
    formData.personal_information.name = $('#first-name').val();
    formData.personal_information.last_name = $('#last-name').val();
    formData.personal_information.email_address = $('#email').val();
    formData.personal_information.phone_number = $('#phone-number').val();
    formData.personal_information.linkedin_url = $('#linkedin-url').val();

    formData.job_title = $('#job-title').val();
    formData.career_objective = $('#career-objective').val();

    let skills = $(".skill span");
    formData.skills=[];
    for(let i = 0; i < skills.length; i++){
        formData.skills.push($(skills[i]).text());
    }

    formData.education=[];
    let school_names = $('[name="education[][school_name]"]');
    let passing_years = $('[name="education[][passing_year]"]');
    let descriptions = $('[name="education[][description]"]');

    for(let i = 0; i < school_names.length; i++){
        let temp={  school_name: $(school_names[i]).val(),
                    passing_year: $(passing_years[i]).val(),
                    description: $(descriptions[i]).val()};
        formData.education.push(temp);
    }

    formData.experience=[];
    let company_names = $('[name="experience[][company_name]"]');
    passing_years = $('[name="experience[][passing_year]"]');
    let responsibilities = $('[name="experience[][responsibilities]"]');
    for(let i = 0; i < company_names.length; i++){
        let temp={  company_name: $(company_names[i]).val(),
                    passing_year: $(passing_years[i]).val(),
                    responsibilities: $(responsibilities[i]).val()};
        formData.experience.push(temp);
    }


    formData.achievements=[];
    let fields = $('[name="achievements[][field]"]');
    let awards = $('[name="achievements[][awards]"]');
    for(let i = 0; i < fields.length; i++){
        let temp={  field: $(fields[i]).val(),
                    awards: $(awards[i]).val()};
        formData.achievements.push(temp);
    }

    // console.log(formData);
    return JSON.stringify(formData);
}

// Function to Fill the Step Bar
function fixStepIndicator(n) {
    //removes the "active" class of all steps
    var i, x = document.getElementsByClassName("stepIndicator");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active1", "");
    }
    //adds the "active" class on the current step:
    x[n].className += " active1";
}
fixStepIndicator(component-1);

// Event Listener on click of next button
$('#next').click(()=>{

    if(component==4){
        if ($(`#show-skills`).find('span').length===0) {
            $(`#skills`)[0].setCustomValidity("Add atleast one Skill");
            $(`#form4`)[0].reportValidity();
            return;
        }
    }
    else if(component>1){
        if ($(`#form${component}`)[0].checkValidity()===false) {
            $(`#form${component}`)[0].reportValidity();
            return;
        }
    }

    $(`#component${component}`).toggleClass("invisible-component");
    component+=1;
    if(component==2){
        $('#prev').toggleClass("invisible-button");
    }
    else if(component==7){
        $('#next').toggleClass("invisible-button");
        $('#submit').toggleClass("invisible-component");
    }
    $(`#component${component}`).toggleClass("invisible-component");
    fixStepIndicator(component-1);
});

// Event Listener on click of previous button
$('#prev').click(()=>{
    $(`#component${component}`).toggleClass("invisible-component");
    component-=1;
    if(component==1){
        $('#prev').toggleClass("invisible-button");
    }
    else if(component==6){
        $('#next').toggleClass("invisible-button");
        $('#submit').toggleClass("invisible-component");
    }
    $(`#component${component}`).toggleClass("invisible-component");
    fixStepIndicator(component-1);
});


// Event listener on click of submit button
$('#submit').click(async ()=>{
    if ($(`#form${component}`)[0].checkValidity()===false) {
        $(`#form${component}`)[0].reportValidity();
        return;
    }

    const url = "https://resume-builder-2cs0.onrender.com";
    let formData = getFormData();
    // console.log(formData);

    $('#loader').removeAttr("hidden");
    $(':button').prop('disabled', true);
    $(':input').prop('disabled', true);
    jQuery('main').css('opacity', '0.6');

    // Fetch request to the API
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/pdf",
        },
        body:formData
    })
    .then(async (response)=>{
        if(response.status != 200){
            response = await response.json();
            throw response.Description;
        }
        let adobeDCView = new AdobeDC.View({clientId: "34c09118f5434dfb9c47a459a2da0796", divId: "adobe-dc-view"});
        adobeDCView.previewFile({
            content:{promise: Promise.resolve(response.arrayBuffer())},
            metaData:{fileName: "Resume.pdf"}
        },previewConfig);
        $('#loader').attr("hidden", true);
        $(':button').prop('disabled', false);
        $(':input').prop('disabled', false);
        $('main').css('opacity', '1');

    })
    .catch(function (err) {
        // Showing Error to the user
        alert(err);
        console.error("Error:" + err);
        
        $('#loader').attr("hidden", true);
        $(':button').prop('disabled', false);
        $(':input').prop('disabled', false);
        $('main').css('opacity', '1');
    });
});