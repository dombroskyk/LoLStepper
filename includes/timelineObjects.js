//Custom Timeline Linked List
module.exports = function (timeline){
    var events = [new GameStartEvent(timeline.frames[0])];
    
    for(var frameIndex = 1; frameIndex < timeline.frames.length; frameIndex++ ){
        for( var eventIndex = 0; eventIndex < timeline.frames[frameIndex].events.length; eventIndex++){
            var event = timeline.frames[frameIndex].events[eventIndex];
            //console.log(event.eventType);
            switch( event.eventType ){
                case 'BUILDING_KILL':
                    events.push(new BuildingKillEvent(event));
                    break;
                case 'CHAMPION_KILL':
                    events.push(new ChampionKillEvent(event));
                    break;
                case 'ELITE_MONSTER_KILL':
                    events.push(new EliteMonsterKillEvent(event));
                    break;
                case 'ITEM_SOLD':
                    events.push(new ItemSoldEvent(event));
                    break;
                case 'ITEM_UNDO':
                    events.push(new ItemUndoEvent(event));
                    break;
                case 'WARD_KILL':
                    events.push(new WardKillEvent(event));
                    break;
                case 'WARD_PLACED':
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
    this.stepperHTML = "<div class='gameStartEvent timelineEvent' id='GameStartEvent_"+ this.timestamp +"'></div>";
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
    this.stepperHTML = "<div class='buildingKillEvent timelineEvent' id='BuildingKillEvent_"+ this.timestamp +"'></div>";
}

// BuildingKillEvent.prototype.getStepperHTML = function (){
//     return 
// }

function ChampionKillEvent (event){
    this.timestamp = event.timestamp;
    this.position = event.position;
    this.victimId = event.victimId;
    this.killerId = event.killerId;
    this.assistingParticipantIds = event.assistingParticipantIds;
    this.stepperHTML = "<div class='championKillEvent timelineEvent' id='ChampionKillEvent_"+ this.timestamp +"'></div>";
}

// ChampionKillEvent.prototype.getStepperHTML = function (){
//     return 
// }

function EliteMonsterKillEvent (event){
    this.timestamp = event.timestamp;
    this.position = event.position;
    this.killerId = event.killerId;
    this.monsterType = event.monsterType;
    this.stepperHTML = "<div class='eliteMonsterKillEvent timelineEvent' id='EliteMonsterKillEvent_"+ this.timestamp +"'></div>";
}

// EliteMonsterKillEvent.prototype.getStepperHTML = function (){
//     return 
// }

function ItemPurchasedEvent (event){
    console.log("hi! ima new  itemPurchasedEvent object!")
    this.timestamp = event.timestamp;
    this.participantId = event.participantId;
    this.itemId = event.itemId;
    this.stepperHTML = "<div class='itemPurchasedEvent timelineEvent' id='ItemPurchasedEvent_"+ this.timestamp +"'></div>";
}

// ItemPurchasedEvent.prototype.getStepperHTML = function (){
//     return 
// }

function ItemSoldEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.participantId;
    this.itemId = event.itemId;
    this.stepperHTML = "<div class='itemSoldEvent timelineEvent' id='ItemSoldEvent_"+ this.timestamp +"'></div>"
}

// ItemSoldEvent.prototype.getStepperHTML = function (){
//     return 
// }

function ItemDestroyedEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.participantId;
    this.itemId = event.itemId;
    this.stepperHTML = "<div class='itemDestroyedEvent timelineEvent' id='ItemDestroyedEvent_"+ this.timestamp +"'></div>";
}

// ItemDestroyedEvent.prototype.getStepperHTML = function (){
//     return 
// }

function ItemUndoEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.participantId;
    this.itemId = event.itemId;
    this.stepperHTML = "<div class='itemUndoEvent timelineEvent' id='ItemUndoEvent_"+ this.timestamp +"'></div>";
}

// ItemUndoEvent.prototype.getStepperHTML = function (){
//     return 
// }

function WardKillEvent (event){
    this.timestamp = event.timestamp;
    this.killerId = event.participantId;
    this.wardType = event.wardType;
    this.stepperHTML = "<div class='wardKillEvent timelineEvent' id='WardKillEvent_"+ this.timestamp +"'></div>";
}

// WardKillEvent.prototype.getStepperHTML = function (){
//     return 
// }

function WardPlacedEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.creatorId;
    this.wardType = event.wardType;
    this.stepperHTML = "<div class='wardPlacedEvent timelineEvent' id='WardPlacedEvent_"+ this.timestamp +"'></div>"; 
}

// WardPlacedEvent.prototype.getStepperHTML = function (){
//     return 
// }