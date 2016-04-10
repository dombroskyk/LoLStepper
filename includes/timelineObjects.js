//Custom Timeline Linked List
module.exports = function (matchJson){
    var timeline = matchJson.timeline;
    var events = [new GameStartEvent(timeline.frames[0])];
    //console.log(timeline.frames[1].events[0]);
    
    for(var frameIndex = 1; frameIndex < timeline.frames.length; frameIndex++ ){
        for( var eventIndex = 0; eventIndex < timeline.frames[frameIndex].events.length; eventIndex++){
            var event = timeline.frames[frameIndex].events[eventIndex];
            //console.log(event.eventType);
            //build MM:SS value
            event.seconds = Math.round(event.timestamp / 1000)
            event.minutes = Math.floor(event.seconds / 60);
            event.seconds = event.seconds - event.minutes * 60;
            if( event.minutes < 10 )
                event.minutes = "0" + event.minutes.toString();
            if( event.seconds < 10 )
                event.seconds = "0" + event.seconds.toString();

            switch( event.eventType ){
                case 'BUILDING_KILL':
                    //teamId in event already
                    events.push(new BuildingKillEvent(event));
                    break;
                case 'CHAMPION_KILL':
                    if( event.killerId in matchJson.team1.participants ){
                        event.teamId = 100;
                        event.killerChampionId = matchJson.team1.participants[event.killerId].championId;
                        event.victimChampionId = matchJson.team2.participants[event.victimId].championId;
                        event.assistingChampionIds = [];
                        for(var participantIndex = 0; participantIndex < event.assistingParticipantIds.length; participantIndex++){
                            event.assistingChampionIds.push(matchJson.team1.participants[event.assistingParticipantIds[participantIndex]]);
                        } 
                    }else{
                        event.teamId = 200;
                        event.killerChampionId = matchJson.team2.participants[event.killerId].championId;
                        event.victimChampionId = matchJson.team1.participants[event.victimId].championId;
                        event.assistingChampionIds = [];
                        for(var participantIndex = 0; participantIndex < event.assistingParticipantIds.length; participantIndex++){
                            event.assistingChampionIds.push(matchJson.team2.participants[event.assistingParticipantIds[participantIndex]]);
                        } 
                    }
                    events.push(new ChampionKillEvent(event));
                    break;
                case 'ELITE_MONSTER_KILL':
                    if( event.killerId in matchJson.team1.participants )
                        event.teamId = 100;
                    else
                        event.teamId = 200;
                    events.push(new EliteMonsterKillEvent(event));
                    break;
                case 'ITEM_SOLD':
                    if( event.participantId in matchJson.team1.participants )
                        event.teamId = 100;
                    else
                        event.teamId = 200;
                    events.push(new ItemSoldEvent(event));
                    break;
                case 'ITEM_UNDO':
                    if( event.participantId in matchJson.team1.participants )
                        event.teamId = 100;
                    else
                        event.teamId = 200;
                    events.push(new ItemUndoEvent(event));
                    break;
                case 'WARD_KILL':
                    if( event.killerId in matchJson.team1.participants )
                        event.teamId = 100;
                    else
                        event.teamId = 200;
                    events.push(new WardKillEvent(event));
                    break;
                case 'WARD_PLACED':
                    if( event.participantId in matchJson.team1.participants )
                        event.teamId = 100;
                    else
                        event.teamId = 200;
                    events.push(new WardPlacedEvent(event));
                    break;
                default:
                    //console.log(event.eventType + ': dont care, continue');
            }
        }
    }
    return events;
}

function GameStartEvent (frame){
    this.participantFrames = frame.participantFrames;
    this.stepperHTML = "<div class='gameStartEvent timeline-event' id='GameStartEvent_"+ this.timestamp +"'></div>";
}

// GameStartEvent.prototype.getStepperHTML = function (){
//     return 
// } 


function BuildingKillEvent (event){
    this.timestamp = event.timestamp;
    this.position = event.position;
    this.killerId = event.killerId;
    this.laneType = event.laneType;
    this.buildingType = event.buildingType;
    this.teamId = event.teamId;
    this.stepperHTML = "<div class='buildingKillEvent timeline-event team-" + event.teamId + "-event' id='BuildingKillEvent_"+ this.timestamp +"'>";
    this.stepperHTML += "<div class='timeline-timestamp'>" + event.minutes + ":" + event.seconds + "</div>";
    if(event.teamId == 100){
        //champ 
        this.stepperHTML += "<img class='champ64-4 lone-left-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
        this.stepperHTML += "<img class='tl-center-img vert-center-48' src='/assets/img/kill100.png' width='48' height='48'/>";
        this.stepperHTML += "<img class='lone-right-64 vert-center-64' src='/assets/img/Placeholder.jpg' width='64' height='64'/>";
    }else if(event.teamId == 200){
        //building
        this.stepperHTML += "<img class='lone-left-64 vert-center-64' src='/assets/img/Placeholder.jpg' width='64' height='64'/>";
        this.stepperHTML += "<img class='tl-center-img vert-center-48' src='/assets/img/kill200.png' width='48' height='48'/>";
        this.stepperHTML += "<img class='champ64-4 lone-right-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
    }
    this.stepperHTML += "</div>";
}

// BuildingKillEvent.prototype.getStepperHTML = function (){
//     return 
// }

function ChampionKillEvent (event){
    this.timestamp = event.timestamp;
    this.position = event.position;
    this.victimId = event.victimId;
    this.victimChampionId = event.victimId;
    this.killerId = event.killerId;
    this.killerChampionId = event.killerChampionId;
    this.assistingParticipantIds = event.assistingParticipantIds;
    var assistingHtml = "";
    if(event.assistingChampionIds.length > 0){
        for(var assistingIndex = 0; assistingIndex < event.assistingChampionIds.length; assistingIndex++){
            assistingHtml += "<img class='champ48-" + event.assistingChampionIds[assistingIndex] + " vert-center-48' src='/assets/img/t1.png' width='48' height='48'/>";
        }
    }
    this.stepperHTML = "<div class='championKillEvent timeline-event team-" + event.teamId + "-event' id='ChampionKillEvent_"+ this.timestamp +"'>";
    this.stepperHTML += "<div class='timeline-timestamp'>" + event.minutes + ":" + event.seconds + "</div>";
    if(event.teamId == 100){
        //this.stepperHTML += assistingHtml;
        this.stepperHTML += "<img class='champ64-" + event.killerChampionId + " lone-left-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
        this.stepperHTML += "<img class='tl-center-img vert-center-48' src='/assets/img/PageImages/kill100.png' width='48' height='48'/>";
        this.stepperHTML += "<img class='champ64-" + event.victimChampionId + " lone-right-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
    }else if(event.teamId == 200){
        this.stepperHTML += "<img class='champ64-" + event.victimChampionId + " lone-left-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
        this.stepperHTML += "<img class='tl-center-img vert-center-48' src='/assets/img/PageImages/kill200.png' width='48' height='48'/>";
        this.stepperHTML += "<img class='champ64-" + event.killerChampionId + " lone-right-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
        //this.stepperHTML += assistingHtml;
    }
    this.stepperHTML += "</div>";
}

// ChampionKillEvent.prototype.getStepperHTML = function (){
//     return 
// }

function EliteMonsterKillEvent (event){
    this.timestamp = event.timestamp;
    this.position = event.position;
    this.killerId = event.killerId;
    this.monsterType = event.monsterType;
    this.stepperHTML = "<div class='eliteMonsterKillEvent timeline-event team-" + event.teamId + "-event' id='EliteMonsterKillEvent_"+ this.timestamp +"'>";
    this.stepperHTML += "<div class='timeline-timestamp'>" + event.minutes + ":" + event.seconds + "</div>";
    if(event.teamId == 100){
        //killer
        this.stepperHTML += "<img class='champ64-4 lone-left-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
        this.stepperHTML += "<img class='tl-center-img vert-center-48' src='/assets/img/kill100.png' width='48' height='48'/>";
        this.stepperHTML += "<img class='lone-right-64 vert-center-64' src='/assets/img/Placeholder.jpg' width='64' height='64'/>";
    }else if(event.teamId == 200){
        //elite monster
        this.stepperHTML += "<img class='lone-left-64 vert-center-64' src='/assets/img/Placeholder.jpg' width='64' height='64'/>";
        this.stepperHTML += "<img class='tl-center-img vert-center-48' src='/assets/img/kill200.png' width='48' height='48'/>";
        this.stepperHTML += "<img class='champ64-4 lone-right-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
    }
    this.stepperHTML += "</div>";
}

// EliteMonsterKillEvent.prototype.getStepperHTML = function (){
//     return 
// }

function ItemPurchasedEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.participantId;
    this.itemId = event.itemId;
    this.stepperHTML = "<div class='itemPurchasedEvent timeline-event team-" + event.teamId + "-event' id='ItemPurchasedEvent_"+ this.timestamp +"'>";
    this.stepperHTML += "<div class='timeline-timestamp'>" + event.minutes + ":" + event.seconds + "</div>";
    this.stepperHTML += "<img class='champ64-4 lone-left-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
    this.stepperHTML += "<img class='tl-center-img vert-center-48' src='/assets/img/Placeholder.jpg' width='48' height='48'/>";
    this.stepperHTML += "<img class='item-" + event.itemId + " lone-right-48 vert-center-48' src='/assets/img/t1.png' width='48' height='48'/>";
    this.stepperHTML += "</div>"; 
}

// ItemPurchasedEvent.prototype.getStepperHTML = function (){
//     return 
// }

function ItemSoldEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.participantId;
    this.itemId = event.itemId;
    this.stepperHTML = "<div class='itemSoldEvent timeline-event team-" + event.teamId + "-event' id='ItemSoldEvent_"+ this.timestamp +"'>";
    this.stepperHTML += "<div class='timeline-timestamp'>" + event.minutes + ":" + event.seconds + "</div>";
    this.stepperHTML += "<img class='champ64-4 lone-left-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
    this.stepperHTML += "<img class='tl-center-img vert-center-48' src='/assets/img/Placeholder.jpg' width='48' height='48'/>";
    this.stepperHTML += "<img class='item-" + event.itemId + " lone-right-48 vert-center-48' src='/assets/img/t1.png' width='48' height='48'/>";
    this.stepperHTML += "</div>"; 
}

// ItemSoldEvent.prototype.getStepperHTML = function (){
//     return 
// }

function ItemDestroyedEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.participantId;
    this.itemId = event.itemId;
    this.stepperHTML = "<div class='itemDestroyedEvent timeline-event team-" + event.teamId + "-event' id='ItemDestroyedEvent_"+ this.timestamp +"'>";
    this.stepperHTML += "<div class='timeline-timestamp'>" + event.minutes + ":" + event.seconds + "</div>";
    this.stepperHTML += "<img class='champ64-4 lone-left-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
    this.stepperHTML += "<img class='tl-center-img v    ert-center-48' src='/assets/img/Placeholder.jpg' width='48' height='48'/>";
    this.stepperHTML += "<img class='item-" + event.itemId + " lone-right-48 vert-center-48' src='/assets/img/t1.png' width='48' height='48'/>";
    this.stepperHTML += "</div>"; 
}

// ItemDestroyedEvent.prototype.getStepperHTML = function (){
//     return 
// }

function ItemUndoEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.participantId;
    this.itemId = event.itemBefore;
    this.stepperHTML = "<div class='itemUndoEvent timeline-event team-" + event.teamId + "-event' id='ItemUndoEvent_"+ this.timestamp +"'>";
    this.stepperHTML += "<div class='timeline-timestamp'>" + event.minutes + ":" + event.seconds + "</div>";
    this.stepperHTML += "<img class='champ64-4 lone-left-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
    this.stepperHTML += "<img class='tl-center-img vert-center-48' src='/assets/img/Placeholder.jpg' width='48' height='48'/>";
    this.stepperHTML += "<img class='item-" + event.itemBefore + " lone-right-48 vert-center-48' src='/assets/img/t1.png' width='48' height='48'/>";
    this.stepperHTML += "</div>"; 
}

// ItemUndoEvent.prototype.getStepperHTML = function (){
//     return 
// }

function WardKillEvent (event){
    this.timestamp = event.timestamp;
    this.killerId = event.participantId;
    this.wardType = event.wardType;
    this.stepperHTML = "<div class='wardKillEvent timeline-event team-" + event.teamId + "-event' id='WardKillEvent_"+ this.timestamp +"'>";
    this.stepperHTML += "<div class='timeline-timestamp'>" + event.minutes + ":" + event.seconds + "</div>";
    this.stepperHTML += "<img class='champ64-4 lone-left-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
    this.stepperHTML += "<img class='tl-center-img vert-center-48' src='/assets/img/Placeholder.jpg' width='48' height='48'/>";
    this.stepperHTML += "<img class='item-3340 lone-right-48 vert-center-48' src='/assets/img/t1.png' width='48' height='48'/>";
    this.stepperHTML += "</div>"; 
}

// WardKillEvent.prototype.getStepperHTML = function (){
//     return 
// }

function WardPlacedEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.creatorId;
    this.wardType = event.wardType;
    this.stepperHTML = "<div class='wardPlacedEvent timeline-event team-" + event.teamId + "-event' id='WardPlacedEvent_"+ this.timestamp +"'>";
    this.stepperHTML += "<div class='timeline-timestamp'>" + event.minutes + ":" + event.seconds + "</div>";
    this.stepperHTML += "<img class='champ64-4 lone-left-64 vert-center-64' src='/assets/img/t1.png' width='64' height='64'/>";
    this.stepperHTML += "<img class='tl-center-img vert-center-48' src='/assets/img/Placeholder.jpg' width='48' height='48'/>";
    this.stepperHTML += "<img class='item-3340 lone-right-48 vert-center-48' src='/assets/img/t1.png' width='48' height='48'/>";
    this.stepperHTML += "</div>"; 
}

// WardPlacedEvent.prototype.getStepperHTML = function (){
//     return 
// }