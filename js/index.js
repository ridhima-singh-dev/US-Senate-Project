var data;
var sentor_list;
var curr_data;
var no_entries = 10
var filter;
var filterDropdown = []
var xmlhttp = new XMLHttpRequest();
var url = "../senators.json";
var filterOptions = ['showall', 'showall', 'showall']
var data_id = []
var _gl_page_start;

var listState = true



xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        data = JSON.parse(xmlhttp.responseText);
        sentor_list = sortByParty(data.objects)
        curr_data = data.objects
        count(sentor_list)
        stateData();
        rankData();
        generate_page_no(sentor_list)
        toggle_leadership(sentor_list,listState)
    }

};

xmlhttp.open("GET", url, true);
xmlhttp.send();


document.getElementById('leadership_container-title-box').addEventListener('click', function (e) {
    e.stopPropagation()
    toggle_leadership(sentor_list, listState)
})

document.getElementById('clear_all').addEventListener('click', function (e) {
    e.stopPropagation()
    reset_filter()
})

const count = (data) => {
    let party_list = []
    let party_count_list = []
    for (let i = 0; i <= data.length - 1; i++) {
        if (data[i].party !== null && data[i].party !== "") {
            if (party_list.indexOf(data[i].party) == -1) {
                party_list.push(data[i].party)
                party_count_list.push(0)
            }
            else {
                party_count_list[party_list.indexOf(data[i].party)] += 1
            }
        }
    }
    
    partData(party_list)


    for(let i = 0; i<party_list.length; i++){
        let element = 
        `
        <div class="party_count">
            <div class="party-count--value">
              ${party_count_list[i]}
            </div>
            <div class="party-count--title">
              ${party_list[i]}
            </div>
        </div>
        `
        let z = document.createElement('div');
        z.innerHTML = element;
        document.querySelector(".party-count--container").appendChild(z);
    }


}

function GenerateTable(sentor_list) {
    var info = "<table id=myTable>"
    info += "<tr><th>Senator</th><th>Party</th><th>State</th><th>Gender</th>" +
        "<th>Senator Rank</th><th>Detail</th></tr>";
    for (var i = 0; i < sentor_list.length; i++) {

        var senator = sentor_list[i].person.firstname;
        let lastname = sentor_list[i].person.lastname

        var party = sentor_list[i].party;
        var state = sentor_list[i].state;
        var gender = sentor_list[i].person.gender;
        var senator_rank = sentor_list[i].senator_rank;

        let idi = sentor_list[i].person.bioguideid

        info += `<tr id="row_${idi}">
                    <td> ${senator} ${lastname}</td>
                    <td> ${party} </td>
                    <td> ${state}</td>
                    <td> ${gender}</td>
                    <td> ${senator_rank} </td>
                    <td> 
                        <button type="button" class= "morebtn" onclick="detailedInfo('${idi}')">More</button>
                    </td>
                </tr>
                `
    }
    info.concat("<table>")
    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = info;
}

function page_display(pagenumber) {
    let pg_start = (pagenumber - 1) * no_entries
    _gl_page_start = pg_start
    let pg_end = (pagenumber * no_entries)
    curr_data = sentor_list.slice(pg_start, pg_end)
    console.log(pg_start, 'Page start')
    GenerateTable(curr_data)
    page_no_highlighter(pagenumber)

    data_id.pop()
}

function page_no_highlighter(pagenumber){
    let pages = Math.ceil(sentor_list.length / no_entries)
    for(let i=1; i<=pages; i++){
        document.getElementById(`page_${i}`).style.backgroundColor = "#555"
    }
    document.getElementById(`page_${pagenumber}`).style.backgroundColor = "#ddd";
}

function generate_page_no(data) {
    let pages = Math.ceil(data.length / no_entries)
    let page_no = ''
    for (let i = 1; i <= pages; i++) {
        page_no += `<div id="page_${i}" onclick="page_display(${i})">${i}</div>`
       // document.getElementsByClassName('active').innerHTML = ${i} ;
    }
    document.getElementById('pages').innerHTML = page_no
    page_display(1)
}

function generate_leadership_role(data) {
    let leadership = ''
    for (let i = 0; i < data.length; i++) {
        if (data[i].leadership_title !== null && data[i].leadership_title !== '') {
            leadership +=
                `<div class="leadership_content">
                <div class="leadership_title">
                ${(data[i].leadership_title !== null && data[i].leadership_title !== "") && data[i].leadership_title}
                </div>
                    <div class="leadership_name">
                        ${(data[i].person.firstname !== "" && data[i].person.firstname !== null) && data[i].person.firstname}
                        ${(data[i].person.lastname !== "" && data[i].person.lastname !== null) && data[i].person.lastname}
                        (${(data[i].party !== "" && data.party !== null) && data[i].party})
                    </div>
            </div>`
        }
    }
    return leadership
}

function insert_leadership_details(sentor_list) {
    let adjElement = document.getElementById('leadership_list')
    let element = generate_leadership_role(sentor_list)
    adjElement.innerHTML = element
}

function delete_leadership_details() {
    let adjElement = document.getElementById('leadership_list')
    adjElement.innerHTML = ""
}

function toggle_leadership(sentor_list, condition) {
    //listState = true;
    if (condition) {
        insert_leadership_details(sentor_list);
        document.getElementById("accordion").style.transform = 'rotate(90deg)';
    } else {
        delete_leadership_details();
        document.getElementById("accordion").style.transform = 'rotate(0deg)';
    }
    listState = !listState
}

function generate_inner_row(i) {
    let detailedArray = []
    for(let j=0; j<sentor_list.length; j++){
        if(sentor_list[j].person.bioguideid == i){
            detailedArray.push(sentor_list[j])
        }
    }

    var twitterImage = "<img src='image/twitter.png' style='width:20px;height:20px;'>";
    var youtubeImage = "<img src='image/youtube.png' style='width:20px;height:20px;'>";
    var officeImage = "<img src='image/work-time.png' style='width:20px;height:20px;'>";
    var websiteImage = "<img src='image/website.png' style='width:20px;height:20px;'>";
    var office = detailedArray[0].extra.office !== null && detailedArray[0].extra.office !== "" ? detailedArray[0].extra.office : false;
    var dob = detailedArray[0].person.birthday !== null && detailedArray[0].person.birthday !== "" ? detailedArray[0].person.birthday : false;
    var startDate = detailedArray[0].startdate !== null && detailedArray[0].startdate !== "" ? detailedArray[0].startdate : false;
    var twitterId = detailedArray[0].person.twitterid !== null && detailedArray[0].person.twitterid !== "" ? detailedArray[0].person.twitterid : false;
    var youTubeId = detailedArray[0].person.youtubeid !== null && detailedArray[0].person.youtubeid !== "" ? detailedArray[0].person.youtubeid : false;
    var website = detailedArray[0].person.link !== null && detailedArray[0].person.link !== "" ? detailedArray[0].person.link : false;

        var contact_out = `<tr id="inner_row_${i}">
                    <td class="innerColor" colspan=6>
                        <div id='left'>
                            ${startDate!== false ?`<div><b> Start Date: </b> ${startDate}</div>` : ''}
                            ${dob !== false ? `<div><b>Birthday: </b> ${dob} </div>`: ''}
                            ${office !== false ? `<div><b>Office: </b> ${office} </div></div>`:''}
                            ${twitterId !== false ? `<div id='right'><div> ${twitterImage} :  ${twitterId} </div>`: ''}
                            ${youTubeId !== false ? `<div > ${youtubeImage} :  ${youTubeId} </div>` : ''}
                            ${website !== false ? `<div> ${websiteImage} : <a target= _blank href=' ${website} '>Website</a></div></div>`:''}
                    </td>
        </tr>`;

    var subTable = document.getElementById(`row_${i}`);
    subTable.insertAdjacentHTML("afterend",contact_out)
}

function detailedInfo(i) {

    let id = i
    if (data_id.length == 0) {
        generate_inner_row(id)
        data_id[0] = id
    } else {
        if (data_id[0] === id) {
            document.getElementById(`inner_row_${id}`).remove()
            data_id.pop()
        } else if (data_id[0] !== id) {
            document.getElementById(`inner_row_${data_id[0]}`).remove()
            data_id.pop()
            data_id[0] = id
            generate_inner_row(id)
        }
    }
}

function stateData() {
    let uniquestate = []
    let data = [...sentor_list]
    data = data.sort(function (a, b) {
        return a.state.localeCompare(b.state)
    })
    for (var i = 0; i < data.length; i++) {
        if (data[i].state !== '' && uniquestate.indexOf(data[i].state) === -1) uniquestate.push(data[i].state);
    }
    var stateoption = "<option selected disabled>Choose one State</option><option value= 'showall'>Show All</option>";
    for (var i = 0; i < uniquestate.length; i++) {
        stateoption += '<option value="' + uniquestate[i] + '">' + uniquestate[i] + "</option>"
    }
    document.getElementById("stateoption").innerHTML = stateoption;
}

function rankData() {
    var uniquerank = [];
    let data = [...sentor_list]
    data = data.sort(function (a, b) {
        return a.senator_rank.localeCompare(b.senator_rank)
    })
    for (let i = 0; i < data.length; i++) {
        if (data[i].senator_rank !== '' && uniquerank.indexOf(data[i].senator_rank) === -1) uniquerank.push(data[i].senator_rank);
    }
    var rankoption = "<option selected disabled>Choose one Rank</option><option value=showall>Show All</option>";
    for (let i = 0; i < uniquerank.length; i++) {
        rankoption += '<option value="' + uniquerank[i] + '">' + uniquerank[i] + "</option>"
    }
    document.getElementById("rankoption").innerHTML = rankoption;
}

function partData(data) {
    var partyoption = "<option selected disabled>Choose one Party</option><option value=showall>Show All</option>";
    for (let i = 0; i < data.length; i++) {
        partyoption += '<option value="' + data[i] + '">' + data[i] + "</option>"
    }
    document.getElementById("partyoption").innerHTML = partyoption;
}

function filterTable(elem) {
    var selectedValue = elem.value;
    if (elem.id == 'partyoption') {
        filterOptions[0] = selectedValue.toLowerCase()
    } else if (elem.id == 'stateoption') {
        filterOptions[1] = selectedValue.toLowerCase()
    } else if (elem.id == 'rankoption') {
        filterOptions[2] = selectedValue.toLowerCase()
    }
    display_filter_option(filterOptions)
    filter();
}

function display_filter_option(arr){
    let bool = true;
    document.querySelector("#filter_container--values").innerHTML = ""
    if (arr.length !== 0){
        for(let i=0; i<arr.length; i++){
            if(arr[i] !== 'showall'){
                let element = 
                `
                <div class="filter_tab" id="filter_tab_${i}" onclick="removeFilterTab(${i})">
                    <span id="filterby">
                        ${arr[i]}
                    <span id="filterby" class="close">
                        &times;
                    </span>
                    </span>
              </div>
                `
                let z = document.createElement('div');
                z.innerHTML = element;
                document.querySelector("#filter_container--values").appendChild(z);
            }
            if(arr[i] !== 'showall'){
                bool = false
            }
        }
    }
    if (!bool){
        document.getElementById('pages').innerHTML = ''
    }else{
        generate_page_no(sentor_list)
    }
}

function filter() {
    let filtered_Arr = []
    for (let i = 0; i < sentor_list.length; i++) {
        let filter_party = filterOptions[0] == "showall" ? true : sentor_list[i].party.toLowerCase() == filterOptions[0]
        let filter_state = filterOptions[1] == "showall" ? true : sentor_list[i].state.toLowerCase() == filterOptions[1]
        let filter_rank = filterOptions[2] == "showall" ? true : sentor_list[i].senator_rank.toLowerCase() == filterOptions[2]
        if (filter_party && filter_state && filter_rank) {
            filtered_Arr.push(sentor_list[i])
        }
    }
    data_id.pop()
    if(filtered_Arr.length === 0){
        var dvTable = document.getElementById("dvTable");
        let elem = `<div class='oopps'>NO DATA FOUND!</div>`
        dvTable.innerHTML = elem
    }else{
        GenerateTable(filtered_Arr)
    }
}


function sortByParty(data) {
    let sort_data = data.sort(function (a, b) {
        return a.party.localeCompare(b.party)
    })
    return sort_data
}

function reset_filter() {
    filterOptions = ['showall', 'showall', 'showall']
    GenerateTable(sentor_list)
    display_filter_option(filterOptions)
    document.getElementById('partyoption').value = 'showall'
    document.getElementById('stateoption').value = 'showall'
    document.getElementById('rankoption').value = 'showall'
}

function removeFilterTab(i){
    document.getElementById(`filter_tab_${i}`).remove()
    filterOptions[i] = "showall"
    filter()
    display_filter_option(filterOptions)

    if(i == 0){
        document.getElementById('partyoption').value = 'showall'
    }else if(i == 1){
        document.getElementById('stateoption').value = 'showall'
    }else{
        document.getElementById('rankoption').value = 'showall'
    }
}
