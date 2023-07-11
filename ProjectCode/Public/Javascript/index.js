let template_id='a';
let component = 5;
function component1(){
    const templates = document.querySelectorAll('.template');
    for(let element of templates){
        element.addEventListener("click",()=>{
            if(template_id!=undefined){
                let temp = document.querySelector(`#${template_id}`);
                temp.classList.remove("active");
            }
            element.classList.add("active");
            template_id = element.getAttribute("id");
        });
    }
};

function component4(){
    // Event Listener On ADD Skill Button
    $('#add-skill').click((e)=>{
        e.preventDefault();
        if($('#skills').val()!=""){
            let new_skill = document.createElement("span");
            new_skill.setAttribute("name", "skills[]");
            new_skill.classList.add("skill");
            new_skill.innerText=$('#skills').val();
            $('#skills').val("");
            $('#show-skills').append(new_skill);
        }
    });
}

function component5(){
    $('#add-education').click((e)=>{
        e.preventDefault();
        let section = document.querySelector(".education");
        section.children[0].classList.remove('invisible-component');
        let element = document.createElement("div");
        element.innerHTML = section.innerHTML;
        element.classList.add("education");
        section.insertAdjacentElement('beforebegin', element);

        $(element.children[0]).click((e)=>{
            e.target.parentElement.parentElement.remove();
            if($(".education").length==1){
                $(".education #delete").addClass('invisible-component');
            }
        });
    });

    $('#delete').click((e)=>{
        console.log(e.target);
        e.target.parentElement.parentElement.remove();
        if($(".education").length==1){
            $(".education #delete").addClass('invisible-component');
        }
    });
}

function component6(){
    $('#add-experience').click((e)=>{
        e.preventDefault();
        let section = document.querySelector(".experience");
        let element = document.createElement("div");
        element.innerHTML = section.innerHTML;
        element.classList.add("experience");
        section.insertAdjacentElement('beforebegin', element);
    });
}

function component7(){
    $('#add-achievement').click((e)=>{
        e.preventDefault();
        let section = document.querySelector(".achievement");
        let element = document.createElement("div");
        element.innerHTML = section.innerHTML;
        element.classList.add("achievement");
        section.insertAdjacentElement('beforebegin', element);
    });
}

function validateForm(){

}

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

    let skills = $(".skill");
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

    console.log(formData);
    return JSON.stringify(formData);
}

for(let x=1; x<=7; x++){
    $(`#component${x}`).load(`/Components/component${x}.html`,()=>{
        if(x!=component){
            $(`#component${x}`).addClass("invisible-component");
        }
        if(x==1){
            component1();
            $('#prev').addClass("invisible-button");
        }
        else if(x==4){
            component4();
        }
        else if(x==5){
            component5();
        }
        else if(x==6){
            component6();
        }
        else if(x==7){
            component7();
        }
    });
}

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
});

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
});

$('#submit').click(async ()=>{
    if ($(`#form${component}`)[0].checkValidity()===false) {
        $(`#form${component}`)[0].reportValidity();
        return;
    }

    const url = "http://localhost:8080/resume";
    let formData = getFormData();
    console.log(formData);

    $('#loader').toggleClass('invisible-component');
    $(':button').prop('disabled', true);
    $(':input').prop('disabled', true);
    jQuery('main').css('opacity', '0.6');

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/pdf",
        },
        body:formData
    })
    .then(response=>response.blob())
    .then(function (blob) {
        let downloadUrl = URL.createObjectURL(blob);
        window.open(downloadUrl, '_blank');
        URL.revokeObjectURL(downloadUrl);
        
        $('#loader').toggleClass('invisible-component');
        $(':button').prop('disabled', false);
        $(':input').prop('disabled', false);
        $('main').css('opacity', '1');
    })
    .catch(function (err) {
        console.error("Error:" + err);
        
        $('#loader').toggleClass('invisible-component');
        $(':button').prop('disabled', false);
        $(':input').prop('disabled', false);
        $('main').css('opacity', '1');
    });
});