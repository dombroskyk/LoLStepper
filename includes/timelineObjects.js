//Custom Timeline Linked List
module.exports = function (timeline){
    var events = [new GameStart(timeline.frames[0])];
    
    for(var frameIndex = 1; frameIndex < timeline.frames.length; frameIndex++ ){
        for( var eventIndex = 0; eventIndex < timeline.frames[frameIndex].events.length; eventIndex++){
            var event = timeline.frames[frameIndex].events[eventIndex];
            console.log(event.eventType);
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
                    console.log(event.eventType + ': dont care, continue');
            }
        }
    }
    return events;
}

function GameStart (frame){
    this.participantFrames = frame.participantFrames;
}


function BuildingKillEvent (event){
    this.timestamp = event.timestamp;
    this.position = event.position;
    this.killerId = event.killerId;
    this.laneType = event.laneType;
    this.buildingType = event.buildingType;
    this.teamId = event.teamId;
}

BuildingKillEvent.prototype.getStepperHTML = function (){
    return "<div class='buildingKillEvent timelineEvent' id='BuildingKillEvent_"+ this.timestamp +"'></div>"
}

function ChampionKillEvent (event){
    this.timestamp = event.timestamp;
    this.position = event.position;
    this.victimId = event.victimId;
    this.killerId = event.killerId;
    this.assistingParticipantIds = event.assistingParticipantIds;
}

function EliteMonsterKillEvent (event){
    this.timestamp = event.timestamp;
    this.position = event.position;
    this.killerId = event.killerId;
    this.monsterType = event.monsterType;
}

function ItemPurchasedEvent (event){
    console.log("hi! ima new  itemPurchasedEvent object!")
    this.timestamp = event.timestamp;
    this.participantId = event.participantId;
    this.itemId = event.itemId;
}

function ItemSoldEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.participantId;
    this.itemId = event.itemId;
}

function ItemDestroyedEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.participantId;
    this.itemId = event.itemId;
}

function ItemUndoEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.participantId;
    this.itemId = event.itemId;
}

function WardKillEvent (event){
    this.timestamp = event.timestamp;
    this.killerId = event.participantId;
    this.wardType = event.wardType;
}

function WardPlacedEvent (event){
    this.timestamp = event.timestamp;
    this.participantId = event.creatorId;
    this.wardType = event.wardType;
}