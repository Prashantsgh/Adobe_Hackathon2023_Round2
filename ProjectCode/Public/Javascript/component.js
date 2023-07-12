// Loading All the Components in the Container DIV.
for(let x=1; x<=7; x++){
    $(`#component${x}`).load(`/Components/component${x}.html`,()=>{

        if(x==component){
            $(`#component${x}`).toggleClass("invisible-component");         // Enabling Visibility for the first Component.
        }

        // Setting up Event Listeners for Respective Components.
        if(x==1){
            component1();
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

// Function to Set Component 1 of FORM.
function component1(){
    const templates = document.querySelectorAll('.template');
    // Add OnClick Listener On all the Templates to SELECT Them.
    for(let element of templates){
        element.addEventListener("click",()=>{
            $(`#${template_id}`).removeClass("active");
            element.classList.add("active");
            template_id = element.getAttribute("id");
        });
    }
};

// Function to Set Component 4 of FORM.
function component4(){
    // Event Listener On ADD Skill Button.
    $('#add-skill').click((e)=>{
        // Add the SKILL from Input Field if it is Non Empty.
        if($('#skills').val()!=""){
            let new_skill = document.createElement("div");
            new_skill.innerHTML=`<span>${$('#skills').val()}</span>  <i class="delete-skill fa-solid fa-xmark"></i>`;
            new_skill.classList.add("skill");
            new_skill.style.position = "relative";
            
            $('#skills').val("");
            $('#show-skills').append(new_skill);

            $('.delete-skill').click((e)=>{
                e.target.parentElement.remove();
            });
        }
    });
}

function component5(){
    $('#add-education').click((e)=>{
        let section = document.querySelector(".education");
        section.children[0].removeAttribute("hidden");
        let element = document.createElement("div");
        element.innerHTML = section.innerHTML;
        element.classList.add("education");
        section.insertAdjacentElement('beforebegin', element);

        $('.delete').click((e)=>{
            e.target.parentElement.remove();
            if($(".education").length==1){
                $(".education .delete").attr("hidden",true);
            }
        });
    });

    $('.delete').click((e)=>{
        e.target.parentElement.remove();
        if($(".education").length==1){
            $(".education .delete").attr("hidden",true);
        }
    });
}

function component6(){
    $('#add-experience').click((e)=>{
        let section = document.querySelector(".experience");
        section.children[0].removeAttribute("hidden");
        let element = document.createElement("div");
        element.innerHTML = section.innerHTML;
        element.classList.add("experience");
        section.insertAdjacentElement('beforebegin', element);

        $('.delete').click((e)=>{
            e.target.parentElement.remove();
            if($(".experience").length==1){
                $(".experience .delete").attr("hidden",true);
            }
        });
    });

    $('.delete').click((e)=>{
        e.target.parentElement.remove();
        if($(".experience").length==1){
            $(".experience .delete").attr("hidden",true);
        }
    });
}

function component7(){
    $('#add-achievement').click((e)=>{
        let section = document.querySelector(".achievement");
        section.children[0].removeAttribute("hidden");
        let element = document.createElement("div");
        element.innerHTML = section.innerHTML;
        element.classList.add("achievement");
        section.insertAdjacentElement('beforebegin', element);

        $('.delete').click((e)=>{
            e.target.parentElement.remove();
            if($(".achievement").length==1){
                $(".achievement .delete").attr("hidden",true);
            }
        });
    });

    $('.delete').click((e)=>{
        e.target.parentElement.remove();
        if($(".achievement").length==1){
            $(".achievement .delete").attr("hidden",true);
        }
    });
}

