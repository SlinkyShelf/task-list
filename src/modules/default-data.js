function objClone(obj)
{return JSON.parse(JSON.stringify(obj))}

const defaultTag = {
  "title": "School",
  "color": "#ff0000"
}

const defaultTask = {
  "title": "test",
  "metadata": {

  },
  "tags": {
    "fakeId": true
  }
}

const defaultTaskList = {
  "title": "Untitled",
  "type": "task-list",
  "tags": {
    
  }
}

const defaultSettings = {

}

const defaultFrameData = {
  "title": "Frame Title",
  "type": "local",
    "documents": {
      
    },
    "tags": {
      
    },
    "tasks": {
      
    },
  }

const defaultUserData = {
  "frames": {

  },
  "settings": objClone(defaultSettings),
}

export { 
  defaultFrameData, 
  defaultSettings, 
  defaultUserData,  
  defaultTaskList, 
  defaultTag, 
  defaultTask, 
  objClone 
}